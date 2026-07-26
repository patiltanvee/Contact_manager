def create_contact(name, email, phone):
    return {
        "name": name.strip(),
        "email": email.strip().lower(),
        "phone": phone.strip()
    }