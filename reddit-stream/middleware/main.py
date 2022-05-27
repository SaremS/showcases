import asyncio
import websockets
import json
from kafka import KafkaConsumer
import os
from collections import deque
import threading
from functools import reduce

if "KAFKA_HOST" in os.environ:
    KAFKA_HOST = os.getenv("KAFKA_HOST")
else:
    KAFKA_HOST = "localhost:9092"

if "KAFKA_TOPIC" in os.environ:
    KAFKA_TOPIC = os.getenv("KAFKA_TOPIC")
else:
    KAFKA_TOPIC = "reddit_praw"



class DataCache():

    def __init__(self, target_topic: str):
        self._cache = deque(maxlen=500)
        self._full_topic = KAFKA_TOPIC + "_{}".format(target_topic)
        self._load_cache()

        self._consumer = KafkaConsumer(
                self._full_topic,
                bootstrap_servers=KAFKA_HOST
        )
        self.start_kafka_loop()


    async def read(self):
        update = list(self._cache)
        return update
   

    def start_kafka_loop(self):
        self._kafka_thread = threading.Thread(target=self._kafka_consumer_loop)
        self._kafka_thread.start()


    def _kafka_consumer_loop(self):
        for message in self._consumer:
            data = json.loads(message.value.decode("utf-8"))
            self._cache.append(data)
            self._save_cache()


    def _load_cache(self):
        try:
            with open(self._full_topic + ".json","r") as f:
                cache = json.load(f)
                for item in cache:
                    self._cache.append(item)
        except Exception as e:
            print(e)


    def _save_cache(self):
        with open(self._full_topic + ".json", 'w') as f:
            json.dump(self.get_cache_as_list(), f)


    def get_cache_as_list(self):
        return list(self._cache)



class TitleCache():

    def __init__(self, target_topic: str):
        self._cache = []
        self._full_topic = KAFKA_TOPIC + "_{}".format(target_topic)
        self._load_cache()

        self._consumer = KafkaConsumer(
                self._full_topic,
                bootstrap_servers=KAFKA_HOST
        )
        self.start_kafka_loop()


    async def read(self):
        min_one = self._get_min_from_cache("avg_sentiment")
        max_one = self._get_max_from_cache("avg_sentiment")
        count_one = self._get_max_from_cache("count")

        return {"min": min_one, "max": max_one, "countmax": count_one}
   

    def start_kafka_loop(self):
        self._kafka_thread = threading.Thread(target=self._kafka_consumer_loop)
        self._kafka_thread.start()


    def _kafka_consumer_loop(self):
        for message in self._consumer:
            data = json.loads(message.value.decode("utf-8"))
            
            self._cache = list(filter(lambda x: x["timestamp"] > data["timestamp"] - 60, self._cache))
            self._cache = [r for r in self._cache if r["title"]!=data["title"]]
            
            if not "Daily General Discussion" in data["title"]:
                self._cache.append(data)
            self._save_cache()


    def _get_max_from_cache(self, field: str = "timestamp"):
        if len(self._cache)==0:
            return None
        else:
            return reduce(lambda l,r: l if l[field]>r[field] else r, self._cache)


    def _get_min_from_cache(self, field: str = "timestamp"):
        if len(self._cache)==0:
            return None
        else:
            return reduce(lambda l,r: l if l[field]<r[field] else r, self._cache)


    def _load_cache(self):
        try:
            with open(self._full_topic + ".json","r") as f:
                cache = json.load(f)
                for item in cache:
                    self._cache.append(item)
        except Exception as e:
            print(e)


    def _save_cache(self):
        with open(self._full_topic + ".json", 'w') as f:
            json.dump(self.get_cache_as_list(), f)


    def get_cache_as_list(self):
        return list(self._cache)


sentiment_mean_cache = DataCache("sentimented")
title_sentiment_cache = TitleCache("aggregated")


async def kafka_socket(websocket):

    while True:
        newest_sm = await sentiment_mean_cache.read()
        newest_ts = await title_sentiment_cache.read()

        if newest_sm is not None and newest_ts is not None:
            await websocket.send(json.dumps({"sentiment_mean": newest_sm, "title_sentiment": newest_ts}))
        await asyncio.sleep(10)



start_server = websockets.serve(kafka_socket, "0.0.0.0", 8765)

asyncio.get_event_loop().run_until_complete(start_server)
asyncio.get_event_loop().run_forever()
