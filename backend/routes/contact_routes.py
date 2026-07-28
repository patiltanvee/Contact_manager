from flask import Blueprint, request, jsonify

from services.contact_service import (
    add_contact,
    get_all_contacts,
    update_contact,
    delete_contact,
    search_contacts,
    email_exists
)

from utils.validators import validate_contact

contact_bp = Blueprint("contacts", __name__)


# ============================
# CREATE CONTACT
# ============================
@contact_bp.route("/contacts", methods=["POST"])
def create_new_contact():

    data = request.get_json()

    name = data.get("name", "")
    email = data.get("email", "")
    phone = data.get("phone", "")
    company = data.get("company", "")
    role = data.get("role", "")
    category = data.get("category", "General")
    profile_image_url = data.get("profile_image_url", "")

    error = validate_contact(name, email, phone)

    if error:
        return jsonify({
            "success": False,
            "message": error
        }), 400

    if email_exists(email):
        return jsonify({
            "success": False,
            "message": "Email already exists"
        }), 409

    contact_id = add_contact(
        name,
        email,
        phone,
        company,
        role,
        category,
        profile_image_url
    )

    return jsonify({
        "success": True,
        "message": "Contact added successfully",
        "id": contact_id
    }), 201


# ============================
# GET ALL CONTACTS
# ============================
@contact_bp.route("/contacts", methods=["GET"])
def get_contacts():

    contacts = get_all_contacts()

    return jsonify({
        "success": True,
        "contacts": contacts
    }), 200


# ============================
# SEARCH CONTACTS
# ============================
@contact_bp.route("/contacts/search", methods=["GET"])
def search_contact():

    query = request.args.get("q", "")

    contacts = search_contacts(query)

    return jsonify({
        "success": True,
        "contacts": contacts
    }), 200


# ============================
# UPDATE CONTACT
# ============================
@contact_bp.route("/contacts/<contact_id>", methods=["PUT"])
def edit_contact(contact_id):

    data = request.get_json()

    success = update_contact(
        contact_id,
        data.get("name", ""),
        data.get("email", ""),
        data.get("phone", ""),
        data.get("company", ""),
        data.get("role", ""),
        data.get("category", "General"),
        data.get("profile_image_url", "")
    )

    if success:
        return jsonify({
            "success": True,
            "message": "Contact updated successfully"
        }), 200

    return jsonify({
        "success": False,
        "message": "Contact not found"
    }), 404


# ============================
# DELETE CONTACT
# ============================
@contact_bp.route("/contacts/<contact_id>", methods=["DELETE"])
def remove_contact(contact_id):

    success = delete_contact(contact_id)

    if success:
        return jsonify({
            "success": True,
            "message": "Contact deleted successfully"
        }), 200

    return jsonify({
        "success": False,
        "message": "Contact not found"
    }), 404