import asyncio
import websockets
import json
from aiokafka import AIOKafkaConsumer
import os

if "KAFKA_HOST" in os.environ:
    KAFKA_HOST = os.getenv("KAFKA_HOST")
else:
    KAFKA_HOST = "localhost:9092"

if "KAFKA_TOPIC" in os.environ:
    KAFKA_TOPIC = os.getenv("KAFKA_TOPIC")
else:
    KAFKA_TOPIC = "reddit_praw_sentimented"


async def kafka_socket(websocket):
    consumer = AIOKafkaConsumer(
                KAFKA_TOPIC,
                bootstrap_servers=KAFKA_HOST
        )

    await consumer.start() 
    
    async for msg in consumer:
        data = msg.value.decode("utf-8") 
        await websocket.send(json.dumps(data))


start_server = websockets.serve(kafka_socket, "0.0.0.0", 8765)

asyncio.get_event_loop().run_until_complete(start_server)
asyncio.get_event_loop().run_forever()



