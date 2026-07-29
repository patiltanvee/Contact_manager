import os
import certifi
from pymongo import MongoClient
from config import MONGO_URI, DATABASE_NAME, COLLECTION_NAME

# Fallback values to prevent 'NoneType' crashes if env variables are missing
DB_NAME = DATABASE_NAME or "contact_manager"
COLL_NAME = COLLECTION_NAME or "contacts"

# Initialize MongoDB client with SSL certificates for Render/Atlas
client = MongoClient(MONGO_URI, tlsCAFile=certifi.where())

# Connect to database and collection
db = client[DB_NAME]
contacts_collection = db[COLL_NAME]
