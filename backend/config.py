import os
from dotenv import load_dotenv

load_dotenv()

MONGO_URI = os.getenv("MONGO_URI")
DATABASE_NAME = os.getenv("DATABASE_NAME", "contact_manager")
COLLECTION_NAME = os.getenv("COLLECTION_NAME", "contacts")
