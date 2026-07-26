from database.db import contacts_collection
from models.contact_model import create_contact
from bson import ObjectId


def add_contact(name, email, phone):
    contact = create_contact(name, email, phone)
    result = contacts_collection.insert_one(contact)
    return str(result.inserted_id)


def get_all_contacts():
    contacts = []

    for contact in contacts_collection.find():
        contact["_id"] = str(contact["_id"])
        contacts.append(contact)

    return contacts

def update_contact(contact_id, name, email, phone):
    result = contacts_collection.update_one(
        {"_id": ObjectId(contact_id)},
        {
            "$set": {
                "name": name.strip(),
                "email": email.strip().lower(),
                "phone": phone.strip()
            }
        }
    )

    return result.modified_count > 0

def delete_contact(contact_id):
    result = contacts_collection.delete_one(
        {"_id": ObjectId(contact_id)}
    )

    return result.deleted_count > 0

def search_contacts(query):
    contacts = []

    results = contacts_collection.find({
        "$or": [
            {"name": {"$regex": query, "$options": "i"}},
            {"email": {"$regex": query, "$options": "i"}},
            {"phone": {"$regex": query, "$options": "i"}}
        ]
    })

    for contact in results:
        contact["_id"] = str(contact["_id"])
        contacts.append(contact)

    return contacts

def email_exists(email):
    return contacts_collection.find_one(
        {"email": email.lower()}
    ) is not None