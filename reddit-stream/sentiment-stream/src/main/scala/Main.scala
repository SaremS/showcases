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
    val inputTransformer = new InputTransformer(spark, sentimentModel)
    val sentimentAverageTransformer = new SentimentAverageTransformer(spark)
    val titleSentAggregationTransformer = new TitleSentAggregationTransformer(spark)

    val inputDf = spark
      .readStream
      .format("kafka")
      .option("kafka.bootstrap.servers", kafkaHost)
      .option("subscribe", "reddit_praw")
      .load()

    val sentimentedDf = inputTransformer.transformStream(inputDf)
    val sentimentAverageDf = sentimentAverageTransformer.transformStream(sentimentedDf)
    val titleSentDf = titleSentAggregationTransformer.transformStream(sentimentedDf)

    
    sentimentAverageDf
      .writeStream
      .format("kafka")
      .option("kafka.bootstrap.servers", kafkaHost)
      .option("topic", "reddit_praw_sentimented")
      .option("checkpointLocation", "checkpoint/kafka_checkpoint")
      .start()
    
    titleSentDf
      .writeStream
      .format("kafka")
      .option("kafka.bootstrap.servers", kafkaHost)
      .option("topic", "reddit_praw_aggregated")
      .option("checkpointLocation", "checkpoint/kafka_checkpoint")
      .start()

  }
}
