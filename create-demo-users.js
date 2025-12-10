const admin = require("firebase-admin");
const serviceAccount = require("./serviceAccountKey.json");

// Initialize Firebase Admin
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();
const auth = admin.auth();

const users = [
    {
        uid: "demo-student-id",
        email: "studentid@gmail.com",
        password: "student@123",
        displayName: "Demo Student ID",
        role: "student",
        approved: true
    },
    {
        uid: "demo-professor-id",
        email: "professorid@gmail.com",
        password: "professor@123",
        displayName: "Demo Professor ID",
        role: "teacher",
        approved: true
    }
];

async function createDemoUsers() {
    console.log("🚀 Starting Demo User Creation...");

    for (const user of users) {
        try {
            console.log(`\nProcessing: ${user.email} (${user.role})`);

            // 1. Check if user exists by email and delete if so (to enforce our UID)
            try {
                const existingUser = await auth.getUserByEmail(user.email);
                console.log(`ℹ️ User ${user.email} exists with UID: ${existingUser.uid}. Deleting to enforce new UID...`);
                await auth.deleteUser(existingUser.uid);
                console.log(`🗑️ Deleted old user.`);
            } catch (e) {
                // User doesn't exist, proceed
            }

            // 2. Create Auth User
            await auth.createUser({
                uid: user.uid,
                email: user.email,
                password: user.password,
                displayName: user.displayName,
                emailVerified: true
            });
            console.log(`✅ Auth User Created: ${user.email}`);

            // 2. Create or Update Firestore Document
            await db.collection("users").doc(user.uid).set({
                username: user.displayName,
                email: user.email,
                role: user.role,
                approved: user.approved,
                createdAt: new Date(),
                uid: user.uid
            }, { merge: true });

            console.log(`✅ Firestore Profile Saved: ${user.uid}`);

        } catch (error) {
            console.error(`❌ Error processing ${user.email}:`, error.message);
        }
    }

    console.log("\n✨ Demo Users Setup Complete!");
    process.exit(0);
}

createDemoUsers();
