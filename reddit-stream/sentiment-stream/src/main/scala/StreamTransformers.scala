package streamer

import org.apache.spark.sql.{SparkSession, DataFrame}
import org.apache.spark.sql.types.{StructType, StringType, IntegerType, FloatType}
import org.apache.spark.sql.functions.{udf, from_json, mean, max, window, to_json, struct, count, unix_timestamp}




class InputTransformer(spark: SparkSession, sentimentModel: SentimentModel) {
  
  import spark.implicits._
  
  def transformStream(streamDf: DataFrame): DataFrame = {
    val presentimentStreamDf = streamDf
      .withColumn("value_string", bytesToStringUdf($"value"))
      .withColumn("jsonData", from_json($"value_string", inputSchema))
      .select("timestamp", "jsonData.*")
    
    val sentimentedStreamDf = sentimentModel.getSentiment(presentimentStreamDf)
    return sentimentedStreamDf
  } 


  private val bytesToStringUdf = udf((byteArray: Array[Byte]) => new String(byteArray))


  private val inputSchema = new StructType()
    .add("created_utc", IntegerType, false)
    .add("comment_body", StringType, false)
    .add("title", StringType, false)
}




class SentimentAverageTransformer(spark: SparkSession) {
  
  import spark.implicits._
  
  def transformStream(sentimentedStreamDf: DataFrame): DataFrame = {

    val aggregatedStreamDf = sentimentedStreamDf
      .withWatermark("timestamp", "15 seconds")
      .groupBy(window($"timestamp", "15 minutes", "15 seconds"))
      .agg(mean($"sentiment").as("sentiment_moving_avg"), count($"timestamp").as("count"))
      .withColumn("timestamp", unix_timestamp($"window.end"))

    val outputStreamDf = aggregatedStreamDf
      .select(to_json(struct($"timestamp",$"sentiment_moving_avg",$"count")).alias("value"))

    return outputStreamDf
  } 

}


class TitleSentAggregationTransformer(spark: SparkSession) {
  
  import spark.implicits._
  
  def transformStream(sentimentedStreamDf: DataFrame): DataFrame = {

    val aggregatedStreamDf = sentimentedStreamDf
      .withWatermark("timestamp", "15 seconds")
      .groupBy(window($"timestamp", "15 minutes", "15 seconds"), $"title")
      .agg(mean($"sentiment").as("avg_sentiment"),count($"sentiment").as("count"))
    .filter($"count">10)
    .withColumn("timestamp", unix_timestamp($"window.end"))

    val outputStreamDf = aggregatedStreamDf
      .select(to_json(struct($"timestamp", $"title", $"avg_sentiment", $"count")).alias("value"))
  

    return outputStreamDf
  } 

}
