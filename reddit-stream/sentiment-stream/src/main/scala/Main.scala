package streamer

import org.apache.spark.sql.SparkSession


object SentimentStreamer{

  def main(args: Array[String]): Unit = {
  
    val spark = SparkSession
      .builder
      .appName("SentimentStreamer")
      .master("local[*]")
      .getOrCreate()

    val kafkaHost = sys.env.get("KAFKA_HOST").get

    val sentimentModel = new SentimentModel(spark, "sentimentdl_use_twitter", "comment_body")
    val streamTransformer = new StreamTransformer(spark, sentimentModel)

    val streamDf = spark
      .readStream
      .format("kafka")
      .option("kafka.bootstrap.servers", kafkaHost)
      .option("subscribe", "reddit_praw")
      .load()

    val transformedStreamDf = streamTransformer.createSentimentAggregateStreamDf(streamDf)
    
    transformedStreamDf
      .writeStream
      .format("kafka")
      .option("kafka.bootstrap.servers", kafkaHost)
      .option("topic", "reddit_praw_sentimented")
      .option("checkpointLocation", "checkpoint/kafka_checkpoint")
      .start()
      .awaitTermination()
  }
}
