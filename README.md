# ContactHub — Professional Directory Manager

A clean, minimal, and high-performance contact directory designed to organize professional connections effortlessly. Built with simplicity in mind, ContactHub features a sleek, dark-mode default visual design, real-time index searching, robust input validation, and a persistent database backend.

## Team Members
*   **Tanvi Patil**
*   **Ananya Kadam**
*   **Swara Pimprikar**

---

## Tech Stack

### Frontend
*   **Markup & Logic:** HTML5, Vanilla JavaScript (ES6+)
*   **Styling:** Premium Custom CSS (utilizing CSS variables, Flexbox/Grid layouts, glassmorphism, and responsive transitions)
*   **Typography:** Google Fonts (`Outfit` for headings, `Plus Jakarta Sans` for body content, and `Playfair Display` for editorial accents)

### Backend
*   **Framework:** Python (Flask)
*   **Database Integration:** PyMongo (MongoDB Atlas)
*   **Middleware:** Flask-CORS (Cross-Origin Resource Sharing enablement)

---

## Core Features

*   **Premium Minimalist Interface:** Glassmorphism card grid layout with default dark mode and toggleable light mode.
*   **Real-time Search & Sort:** Instant directory searching by name, email, company, or job role, along with quick category tabs and alphabetical sorting.
*   **Robust Input Validation:** Form guards that prevent duplicate email addresses, empty fields, or malformed phone/email inputs.
*   **Resilient Fallback Mode:** Gracefully handles database connection failures by falling back to local data storage, keeping the interface operational.
*   **Dynamic Visual Elements:** Editorial styling and interactive card-stack swipe animations.

---

## How to Run

### 1. Backend Setup
1. Navigate to the `backend/` folder:
   ```bash
   cd backend
   ```
2. Install Python dependencies:
   ```bash
   pip install -r requirements.txt
   ```
   *(Ensure `flask`, `flask-cors`, and `pymongo` are installed in your environment)*
3. Create a `.env` file in the `backend/` root and populate your database details:
   ```env
   MONGO_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/
   DATABASE_NAME=contact_manager
   COLLECTION_NAME=contacts
   ```
4. Start the server:
   ```bash
   python app.py
   ```
   The backend API will run locally at `http://127.0.0.1:5000`.

### 2. Frontend Setup
1. Open the `frontend/index.html` file in any modern web browser.
2. The frontend will automatically hook into the Flask API. If the server is offline, it will fall back to local directory rendering.

---

## Future Improvements
*   **Authentication & Access Control:** Implement JWT-based secure login and registration.
*   **Contact Exporting:** Support exporting selected contacts to CSV or vCard formats.
*   **Custom Labels:** Allow users to create custom categories and tags for better organization.
*   **Interaction History:** Log details of recent messaging activities or update histories for each connection.
