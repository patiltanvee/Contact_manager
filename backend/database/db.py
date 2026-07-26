from pymongo import MongoClient
from config import MONGO_URI, DATABASE_NAME, COLLECTION_NAME
import certifi

client = MongoClient(
    MONGO_URI,
    tlsCAFile=certifi.where()
)

db = client[DATABASE_NAME]

contacts_collection = db[COLLECTION_NAME]