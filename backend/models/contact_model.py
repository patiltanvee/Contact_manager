def create_contact(
    name,
    email,
    phone,
    company="",
    role="",
    category="General",
    profile_image_url=""
):
    return {
        "name": name.strip(),
        "email": email.strip().lower(),
        "phone": phone.strip(),
        "company": company.strip(),
        "role": role.strip(),
        "category": category.strip() if category else "General",
        "profile_image_url": profile_image_url.strip(),
        "lastConnected": "Just now"
    }