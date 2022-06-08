import asyncio
import websockets
import json
from kafka import KafkaConsumer
import os
from collections import deque
import threading
from functools import reduce
import time
import math

if "KAFKA_HOST" in os.environ:
    KAFKA_HOST = os.getenv("KAFKA_HOST")
else:
    KAFKA_HOST = "localhost:9092"

if "KAFKA_TOPIC" in os.environ:
    KAFKA_TOPIC = os.getenv("KAFKA_TOPIC")
else:
    KAFKA_TOPIC = "pi_temperature"



class DataCache():

    def __init__(self, topic, host):
        self._cache = []
        self._load_cache()
        self._topic = topic

        self._consumer = KafkaConsumer(
                self._topic,
                bootstrap_servers=host
        )
        self.start_kafka_loop()


    async def read(self):
        update = self._cache
        return update
   

    def start_kafka_loop(self):
        self._kafka_thread = threading.Thread(target=self._kafka_consumer_loop)
        self._kafka_thread.start()


    def _kafka_consumer_loop(self):
        for message in self._consumer:
            data = json.loads(message.value.decode("utf-8"))
            self._cache.append(data)
            self._cache = list(filter(lambda x: x["timestamp"]>=self.get_today(),self._cache))
            self._save_cache()


    def _load_cache(self):
        try:
            with open(self._topic + ".json","r") as f:
                cache = json.load(f)
                for item in cache:
                    self._cache.append(item)
        except Exception as e:
            print(e)


    def _save_cache(self):
        with open(self._topic + ".json", 'w') as f:
            json.dump(self.get_cache_as_list(), f)


    def get_cache_as_list(self):
        return self._cache


    def get_today(self):
        now = int(time.time())
        today = math.floor(now/86400)*86400
        return today



temperature_cache = DataCache(KAFKA_TOPIC, KAFKA_HOST)


async def kafka_socket(websocket):

    while True:
        temperature_data = await temperature_cache.read()

        if temperature_data is not None:
            await websocket.send(json.dumps({"temperature_data": temperature_data}))
        await asyncio.sleep(10)



start_server = websockets.serve(kafka_socket, "0.0.0.0", 8764)

asyncio.get_event_loop().run_until_complete(start_server)
asyncio.get_event_loop().run_forever()
