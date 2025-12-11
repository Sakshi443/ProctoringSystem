const express = require("express");
const path = require("path");
const cors = require("cors");
const admin = require("firebase-admin");
require("dotenv").config();

// Initialize Firebase Admin
try {
  let serviceAccount;

  if (process.env.FIREBASE_SERVICE_ACCOUNT) {
    // If running in production/deployment with env var
    serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
  } else {
    // Local development fallback
    try {
      serviceAccount = require("./serviceAccountKey.json");
    } catch (e) {
      if (e.code === 'MODULE_NOT_FOUND') {
        throw new Error("FIREBASE_SERVICE_ACCOUNT env var is missing and serviceAccountKey.json was not found locally.");
      }
      throw e;
    }
  }

  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });
  console.log("✅ Firebase Admin Initialized");
} catch (error) {
  console.error("❌ Firebase Init Error:", error.message);
}

const db = admin.firestore();
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve dynamic firebase-config.js
app.get("/static/js/firebase-config.js", (req, res) => {
  const config = `
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "${process.env.FIREBASE_API_KEY}",
  authDomain: "${process.env.FIREBASE_AUTH_DOMAIN}",
  projectId: "${process.env.FIREBASE_PROJECT_ID}",
  storageBucket: "${process.env.FIREBASE_STORAGE_BUCKET}",
  messagingSenderId: "${process.env.FIREBASE_MESSAGING_SENDER_ID}",
  appId: "${process.env.FIREBASE_APP_ID}",
  measurementId: "${process.env.FIREBASE_MEASUREMENT_ID}"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { app, auth, db };
  `;
  res.type("application/javascript");
  res.send(config);
});

// Serve static files
app.use(express.static(path.join(__dirname, "templates")));

// --- API ROUTES ---

// Log Violation
app.post("/api/log/violation", async (req, res) => {
  try {
    const { studentId, violationType, timestamp, evidenceUrl } = req.body;
    if (!studentId || !violationType) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    await db.collection("violations").add({
      studentId,
      violationType,
      timestamp: timestamp || new Date().toISOString(),
      evidenceUrl: evidenceUrl || null,
      reviewed: false
    });

    console.log(`⚠️ Violation Logged: ${violationType} for ${studentId}`);
    res.status(200).json({ message: "Violation logged successfully" });
  } catch (error) {
    console.error("Error logging violation:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Admin: Get Reports
app.get("/api/admin/reports", async (req, res) => {
  try {
    const snapshot = await db.collection("violations").orderBy("timestamp", "desc").limit(50).get();
    const reports = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.status(200).json(reports);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch reports" });
  }
});

// Admin: Get Feedbacks
app.get("/api/admin/feedbacks", async (req, res) => {
  try {
    const snapshot = await db.collection("messages").orderBy("timestamp", "desc").get();
    const feedbacks = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.status(200).json(feedbacks);
  } catch (error) {
    console.error("Error fetching feedbacks:", error);
    res.status(500).json({ error: "Failed to fetch feedbacks" });
  }
});

// Contact Form Submission
app.post("/api/contact", async (req, res) => {
  try {
    const { name, email, phone, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    await db.collection("messages").add({
      name,
      email,
      phone: phone || null,
      message,
      timestamp: new Date().toISOString(),
      read: false
    });

    console.log(`📩 New Contact Message from ${email}`);
    res.status(200).json({ message: "Message sent successfully!" });
  } catch (error) {
    console.error("Error saving contact message:", error);
    res.status(500).json({ error: "Failed to send message" });
  }
});

// Serve HTML Pages
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "templates", "index.html"));
});

// Catch-all route for 404 errors
app.use((req, res) => {
  res.status(404).sendFile(path.join(__dirname, "templates", "error.html"));
});

app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});
