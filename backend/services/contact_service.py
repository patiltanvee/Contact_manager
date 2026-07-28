from database.db import contacts_collection
from models.contact_model import create_contact
from bson import ObjectId


# ==========================
# ADD CONTACT
# ==========================
def add_contact(
    name,
    email,
    phone,
    company,
    role,
    category,
    profile_image_url
):
    contact = create_contact(
        name,
        email,
        phone,
        company,
        role,
        category,
        profile_image_url
    )

    result = contacts_collection.insert_one(contact)

    return str(result.inserted_id)


# ==========================
# GET ALL CONTACTS
# ==========================
def get_all_contacts():

    contacts = []

    for contact in contacts_collection.find():

        contact["id"] = str(contact["_id"])
        del contact["_id"]

        contacts.append(contact)

    return contacts


# ==========================
# UPDATE CONTACT
# ==========================
def update_contact(
    contact_id,
    name,
    email,
    phone,
    company,
    role,
    category,
    profile_image_url
):

    result = contacts_collection.update_one(

        {"_id": ObjectId(contact_id)},

        {
            "$set": {
                "name": name.strip(),
                "email": email.strip().lower(),
                "phone": phone.strip(),
                "company": company.strip(),
                "role": role.strip(),
                "category": category.strip(),
                "profile_image_url": profile_image_url.strip()
            }
        }

    )

    return result.modified_count > 0


# ==========================
# DELETE CONTACT
# ==========================
def delete_contact(contact_id):

    result = contacts_collection.delete_one(
        {"_id": ObjectId(contact_id)}
    )

    return result.deleted_count > 0


# ==========================
# SEARCH CONTACTS
# ==========================
def search_contacts(query):

    contacts = []

    results = contacts_collection.find({

        "$or": [

            {"name": {"$regex": query, "$options": "i"}},

            {"email": {"$regex": query, "$options": "i"}},

            {"phone": {"$regex": query, "$options": "i"}},

            {"company": {"$regex": query, "$options": "i"}},

            {"role": {"$regex": query, "$options": "i"}},

            {"category": {"$regex": query, "$options": "i"}}

        ]

    })

    for contact in results:

        contact["id"] = str(contact["_id"])
        del contact["_id"]

        contacts.append(contact)

    return contacts


# ==========================
# CHECK DUPLICATE EMAIL
# ==========================
def email_exists(email):

    return contacts_collection.find_one(
        {"email": email.lower()}
    ) is not None