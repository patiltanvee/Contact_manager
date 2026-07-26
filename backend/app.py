from flask import Flask
from routes.contact_routes import contact_bp

app = Flask(__name__)

app.register_blueprint(contact_bp)


@app.route("/")
def home():
    return {
        "success": True,
        "message": "Contact Management API is running."
    }


if __name__ == "__main__":
    app.run(debug=True)