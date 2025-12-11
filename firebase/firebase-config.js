const admin = require('firebase-admin');
const path = require('path');

let serviceAccount;
if (process.env.FIREBASE_SERVICE_ACCOUNT) {
  serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
} else {
  serviceAccount = require(path.join(__dirname, '../serviceAccountKey.json'));
}

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://proctored-system.firebaseio.com"
});

module.exports = admin;
