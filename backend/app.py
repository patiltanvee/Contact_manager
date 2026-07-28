from flask import Flask
from flask_cors import CORS
from routes.contact_routes import contact_bp

app = Flask(__name__)

# Enable CORS
CORS(app)

app.register_blueprint(contact_bp)

@app.route("/")
def home():
    return {
        "success": True,
        "message": "Contact Management API is running."
    }

if __name__ == "__main__":
    app.run(debug=True)