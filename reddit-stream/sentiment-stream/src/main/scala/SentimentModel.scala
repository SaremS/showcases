package streamer

import org.apache.spark.sql.{SparkSession, DataFrame}
import org.apache.spark.sql.functions.{explode, udf}

import com.johnsnowlabs.nlp.base.DocumentAssembler
import com.johnsnowlabs.nlp.annotator.UniversalSentenceEncoder
import com.johnsnowlabs.nlp.annotators.classifier.dl.SentimentDLModel
import org.apache.spark.ml.Pipeline
import com.johnsnowlabs.nlp.annotators.seq2seq.T5Transformer





class SentimentModel(spark: SparkSession, modelName: String, targetCol: String){

  import spark.implicits._

  def getSentiment(df: DataFrame): DataFrame = {
    val result = pipeline.fit(df).transform(df)

    val preOutput = result
        .withColumn("metadata",explode($"sentiment_data.metadata"))
        .withColumn("sentiment_string",$"metadata.positive")
      
    def sentStringToDouble = ((s: String) => s.toDouble * 2.0 - 1.0)

    val sentimentCol = udf(sentStringToDouble).apply($"sentiment_string")
    val output = preOutput.withColumn("sentiment", sentimentCol) 
    
    return output
  }


  private val documentAssembler = new DocumentAssembler()
    .setInputCol(targetCol)
    .setOutputCol("document")

  private val useEmbeddings = UniversalSentenceEncoder.pretrained()
    .setInputCols("document")
    .setOutputCol("embeddings")

  private val sentimentModel = SentimentDLModel.pretrained(modelName)
    .setInputCols("embeddings")
    .setThreshold(0.7F)
    .setOutputCol("sentiment_data")

  private val pipeline = new Pipeline().setStages(Array(
    documentAssembler,
    useEmbeddings,
    sentimentModel
  ))

}
