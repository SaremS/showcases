#!/usr/bin/julia
using Pkg
Pkg.activate(".")
Pkg.instantiate()
using Outliers
Outliers.serve()
