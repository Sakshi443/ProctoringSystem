# 🛡️ Proctor (ExamSecure)

> **Automated Proctoring System to Prevent Exam Cheating**

Proctor (also known as ExamSecure) is a comprehensive web-based proctoring solution designed to ensure the integrity of online examinations. Leveraging AI and machine learning, it tracks candidate activity remotely to detect and prevent malpractice.

**Key Features:**
*   🤖 **AI-Powered Monitoring:** Real-time Face Detection, Head Pose Estimation, and Impersonation Detection.
*   🔒 **Browser Lockdown:** Prevents tab switching and restricts browser functionality during exams.
*   📊 **Real-time Analysis:** Detects loss of attention and suspicious behavior.
*   ☁️ **Cloud Integration:** Built on Firebase for secure authentication and real-time data handling.

---

## 🚀 Getting Started

Follow these instructions to set up the project on your local machine for development and testing.

### 📋 Prerequisites

Ensure you have the following installed:
*   **Node.js** (v14 or higher)
*   **Python** (v3.8 or higher)
*   **Firebase Account** (for database and auth)

### 🛠️ Installation

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/Sakshi443/proctor.git
    cd proctor
    ```

2.  **Install Node.js dependencies:**
    ```bash
    npm install
    ```

3.  **Install Python dependencies:**
    ```bash
    pip install flask
    # If a requirements.txt exists in the future, use: pip install -r requirements.txt
    ```

### ⚙️ Configuration

1.  **Environment Variables:**
    Create a `.env` file in the root directory. You can use the following template:

    ```env
    # Server Configuration
    PORT=5000

    # Firebase Admin SDK (Path to your service account key)
    GOOGLE_APPLICATION_CREDENTIALS="./serviceAccountKey.json"
    ```

2.  **Firebase Setup:**
    *   Place your Firebase Admin SDK JSON file in the root directory and name it `serviceAccountKey.json`.
    *   Update `templates/static/js/firebase-config.js` with your client-side Firebase configuration keys.

---

## 💻 Usage Guide

### Start the Development Server (Node.js)

To serve the application using the Node.js Express server:

```bash
# Run in development mode (with nodemon)
npm run dev

# Run in production mode
npm start
```

The application will be available at `http://localhost:5000`.

### Run the Python Backend (Flask)

If you need to run the Python backend (e.g., for specific AI processing routes):

```bash
python main.py
```

---

## 📂 Project Structure

```text
final-proctor/
├── app/                  # 🐍 Python Flask Application
│   ├── __init__.py       # App factory
│   └── routes.py         # Flask routes
├── firebase/             # 🔥 Firebase Configuration
│   └── firebase-config.js
├── templates/            # 🎨 Frontend (HTML/Templates)
│   ├── static/           # Static Assets (CSS, JS, Images)
│   │   ├── css/          # Stylesheets
│   │   └── js/           # Client-side Logic (Proctoring, Auth)
│   ├── index.html        # Landing Page
│   ├── login.html        # Authentication Page
│   └── ...
├── app.js                # 🚀 Express App Setup
├── server.js             # 🏁 Node.js Server Entry Point
├── main.py               # 🐍 Python Entry Point
├── package.json          # 📦 Node Dependencies
└── tailwind.config.js    # 🎨 Tailwind CSS Config
```

---

## 🔌 API Reference

Currently, the project primarily serves frontend views. Backend API endpoints are under development.

| Endpoint | Method | Description |
| :--- | :--- | :--- |
| `/` | `GET` | Serves the Home/Landing page |
| `/login.html` | `GET` | Serves the Login page |
| `/admin.html` | `GET` | Serves the Admin Dashboard |

*Note: The AI proctoring logic is primarily handled via client-side scripts (`templates/static/js/main.js`) interacting with Firebase.*

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1.  Fork the repository.
2.  Create a new branch (`git checkout -b feature/YourFeature`).
3.  Commit your changes (`git commit -m 'Add some feature'`).
4.  Push to the branch (`git push origin feature/YourFeature`).
5.  Open a Pull Request.

---

**License:** ISC
