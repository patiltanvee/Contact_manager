import re

EMAIL_REGEX = r'^[\w\.-]+@[\w\.-]+\.\w+$'


def validate_contact(name, email, phone):
    if not name or not name.strip():
        return "Name is required"

    if not email or not email.strip():
        return "Email is required"

    if not re.match(EMAIL_REGEX, email):
        return "Invalid email format"

    if not phone or not phone.strip():
        return "Phone number is required"

    if not phone.isdigit() or len(phone) != 10:
        return "Phone number must contain exactly 10 digits"

    return None