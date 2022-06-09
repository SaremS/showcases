module Outliers

using HTTP, JSON3, StructTypes, HMMBase, Distributions
using ConjugatePriors, StatsBase

mutable struct TimeSeries
	values::Vector{Float64}
end

mutable struct OutlierOutput
	values::Vector{Float64}
	probabilities::Vector{Float64}
end

StructTypes.StructType(::Type{TimeSeries}) = StructTypes.Struct()
StructTypes.StructType(::Type{OutlierOutput}) = StructTypes.Struct()

function fit_map(::Type{<:Normal}, observations, responsibilities)
    mu = mean(observations, StatsBase.Weights(responsibilities))

    ss = suffstats(ConjugatePriors.NormalKnownMu(mu), observations, responsibilities)
    prior = ConjugatePriors.InverseGamma(1, 1)
    posterior = ConjugatePriors.posterior_canon(prior, ss)
    s2 = mode(posterior)

    Normal(mu, sqrt(s2))
end


function getCorsHeaders()



end

function handlePreflight(req::HTTP.Request)
	

	if ("JULIA_ENV" in keys(ENV))
		if (ENV["JULIA_ENV"] == "PROD")
			headers = [
        		"Access-Control-Allow-Origin" => "https://showcases.sarem-seitz.com",
        		"Access-Control-Allow-Methods" => "POST, OPTIONS",
			"Access-Control-Allow-Headers" => "Content-Type"
    			]
			return HTTP.Response(200, headers)
		else
			headers = [
        		"Access-Control-Allow-Origin" => "http://localhost:3000",
        		"Access-Control-Allow-Methods" => "POST, OPTIONS",
			"Access-Control-Allow-Headers" => "Content-Type"
    			]
			return HTTP.Response(200, headers)
		end
	else
			headers = [
        		"Access-Control-Allow-Origin" => "http://localhost:3000",
        		"Access-Control-Allow-Methods" => "POST, OPTIONS",
			"Access-Control-Allow-Headers" => "Content-Type"
    			]
			return HTTP.Response(200, headers)
	end

end

function handleData(req::HTTP.Request)
	
	timeSeries = JSON3.read(IOBuffer(HTTP.payload(req)), TimeSeries)
	
	vals = timeSeries.values

	valsNormed = (vals .- mean(vals))./std(vals)

	hmm = HMM([0.5 0.5; 0.5 0.5], [Normal(-1,3),Normal(1,3)])
	hmmFit,_ = fit_mle(hmm,valsNormed,estimator=fit_map)
	minIdx = argmin(hmmFit.a)
	
	probs,_ = forward(hmmFit,valsNormed)
	
	output = OutlierOutput(vals, probs[:,minIdx])

	headers = [
        	"Access-Control-Allow-Origin" => "*",
        	"Access-Control-Allow-Methods" => "POST, OPTIONS",
		"Access-Control-Allow-Headers" => "Content-Type"
    	]

	return HTTP.Response(200, headers, body=JSON3.write(output))
end

function serve()
	println("Serving at port 8081")
	TS_Router = HTTP.Router()
	HTTP.@register(TS_Router, "POST", "/forecast", handleData)
	HTTP.@register(TS_Router, "OPTIONS", "/forecast", handlePreflight)
	HTTP.serve(TS_Router, HTTP.ip"0.0.0.0", 8081)
end

end # module
