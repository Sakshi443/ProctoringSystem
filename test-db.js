const admin = require("firebase-admin");

try {
    const serviceAccount = require("./serviceAccountKey.json");
    console.log("Found Service Account for Project:", serviceAccount.project_id);

    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount)
    });

    const db = admin.firestore();

    console.log("Attempting to write to Firestore...");

    db.collection("test").add({
        timestamp: new Date().toISOString(),
        message: "Connection Check"
    }).then(docRef => {
        console.log("✅ Success! Document written with ID:", docRef.id);
        process.exit(0);
    }).catch(error => {
        console.error("❌ Firestore Write Failed:", error.message);
        if (error.code) console.error("Error Code:", error.code);
        process.exit(1);
    });

} catch (error) {
    console.error("❌ Setup Failed:", error.message);
}
