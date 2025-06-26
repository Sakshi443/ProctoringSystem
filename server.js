// src/server.js
const app = require('./app');
const dotenv = require('dotenv');

const admin = require('./firebase/firebase-config'); // Adjust path if needed
const db = admin.firestore();

// Load environment variables
dotenv.config();

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
