import asyncio
import websockets
import json
from kafka import KafkaConsumer
import os
from collections import deque
from copy import deepcopy
import threading

if "KAFKA_HOST" in os.environ:
    KAFKA_HOST = os.getenv("KAFKA_HOST")
else:
    KAFKA_HOST = "localhost:9092"

if "KAFKA_TOPIC" in os.environ:
    KAFKA_TOPIC = os.getenv("KAFKA_TOPIC")
else:
    KAFKA_TOPIC = "reddit_praw_sentimented"



class DataCache():

    def __init__(self):
        self._cache = deque(maxlen=500)
        self._load_cache()
        self._update_read = False

        self._consumer = KafkaConsumer(
                KAFKA_TOPIC,
                bootstrap_servers=KAFKA_HOST
        )
        self.start_kafka_loop()


    async def read(self):
        update = list(self._cache)
        self._update_read = True
        return update
   

    def start_kafka_loop(self):
        self._kafka_thread = threading.Thread(target=self._kafka_consumer_loop)
        self._kafka_thread.start()


    def _kafka_consumer_loop(self):
        for message in self._consumer:
            data = json.loads(message.value.decode("utf-8"))
            self._cache.append(data)
            self._save_cache()
            self._update_read = False


    def _load_cache(self):
        try:
            with open("data_cache.json","r") as f:
                cache = json.load(f)
                for item in cache:
                    self._cache.append(item)
        except Exception as e:
            print(e)


    def _save_cache(self):
        with open('data_cache.json', 'w') as f:
            json.dump(self.get_cache_as_list(), f)


    def get_cache_as_list(self):
        return list(self._cache)



cache = DataCache()


async def kafka_socket(websocket):

    while True:
        newest = await cache.read()
        if newest is not None:
            await websocket.send(json.dumps(newest))
        await asyncio.sleep(10)



start_server = websockets.serve(kafka_socket, "0.0.0.0", 8765)

asyncio.get_event_loop().run_until_complete(start_server)
asyncio.get_event_loop().run_forever()
