package streamer

import org.apache.spark.sql.{SparkSession, DataFrame}
import org.apache.spark.sql.types.{StructType, StringType, IntegerType, FloatType}
import org.apache.spark.sql.functions.{udf, from_json, mean, max, window, to_json, struct, count}

class StreamTransformer(spark: SparkSession, sentimentModel: SentimentModel) {
  
  import spark.implicits._
  
  def createSentimentAggregateStreamDf(streamDf: DataFrame): DataFrame = {
    val presentimentStreamDf = streamDf
      .withColumn("value_string", bytesToStringUdf($"value"))
      .withColumn("jsonData", from_json($"value_string", inputSchema))
      .select("timestamp", "jsonData.*")
    
    val sentimentedStreamDf = sentimentModel.getSentiment(presentimentStreamDf)

    val aggregatedStreamDf = sentimentedStreamDf
      .withWatermark("timestamp", "5 minutes")
      .groupBy(window($"timestamp", "5 minutes", "30 seconds"))
      .agg(max($"created_utc").as("timestamp"), mean($"sentiment").as("sentiment_moving_avg"), count($"timestamp").as("count"))

    val outputStreamDf = aggregatedStreamDf
      .select(to_json(struct($"timestamp",$"sentiment_moving_avg",$"count")).alias("value"))

    return outputStreamDf
  } 


  private val bytesToStringUdf = udf((byteArray: Array[Byte]) => new String(byteArray))

  private val inputSchema = new StructType()
    .add("created_utc", IntegerType, false)
    .add("comment_body", StringType, false)

}
