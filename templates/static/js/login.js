// ✅ Firebase SDK Modular Imports
import { app, auth, db } from '/static/js/firebase-config.js';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendEmailVerification,
  signInWithPopup,
  GoogleAuthProvider,
  sendPasswordResetEmail,
  signOut,
} from "https://www.gstatic.com/firebasejs/9.22.0/firebase-auth.js";
import {
  doc,
  setDoc,
  getDoc,
} from "https://www.gstatic.com/firebasejs/9.22.0/firebase-firestore.js";

const googleProvider = new GoogleAuthProvider();

// ✅ Register logic
document
  .getElementById("registerForm")
  .addEventListener("submit", async (e) => {
    e.preventDefault();
    const email = e.target.regEmail.value;
    const pass = e.target.regPassword.value;
    const username = e.target.regUsername.value;
    const role = e.target.regRole.value;

    try {
      const cred = await createUserWithEmailAndPassword(auth, email, pass);
      const uid = cred.user.uid;

      await setDoc(doc(db, "users", uid), {
        username,
        email,
        role,
        approved: role === "teacher" ? false : true,
        createdAt: new Date(),
        emailVerified: false,
      });

      await sendEmailVerification(cred.user);

      alert(
        role === "teacher"
          ? "Registered! Verify email and await admin approval."
          : "Registered! Verify your email to log in."
      );

      await signOut(auth);
      // Logic to switch to login view could go here if needed
      document.getElementById("showLogin").click(); // Trigger toggle to login
    } catch (err) {
      alert(err.message);
    }
  });

// ✅ Login logic
document.getElementById("loginForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  const email = e.target.loginEmail.value;
  const pass = e.target.loginPassword.value;

  try {
    const cred = await signInWithEmailAndPassword(auth, email, pass);

    if (!cred.user.emailVerified) {
      alert("Please verify your email before logging in.");
      await signOut(auth);
      return;
    }

    await handleUserRedirection(cred.user);

  } catch (err) {
    alert("Login failed: " + err.message);
  }
});

// ✅ Google Sign-In Logic
const googleBtn = document.getElementById("googleBtn");
if (googleBtn) {
  googleBtn.addEventListener("click", async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;

      // Check if user doc exists, if not create it (Student by default or Ask? We'll default to student for ease)
      const userDocRef = doc(db, "users", user.uid);
      const userSnap = await getDoc(userDocRef);

      if (!userSnap.exists()) {
        await setDoc(userDocRef, {
          username: user.displayName,
          email: user.email,
          role: "student", // Default role for Google Login
          approved: true,
          createdAt: new Date(),
          emailVerified: true
        });
      }

      await handleUserRedirection(user);

    } catch (error) {
      console.error(error);
      alert("Google Sign-In Error: " + error.message);
    }
  });
}

// ✅ Forgot Password Logic
const forgotBtn = document.getElementById("forgotPasswordBtn");
if (forgotBtn) {
  forgotBtn.addEventListener("click", async (e) => {
    e.preventDefault();
    const email = prompt("Please enter your email address to reset password:");
    if (email) {
      try {
        await sendPasswordResetEmail(auth, email);
        alert("Password reset email sent! Check your inbox.");
      } catch (error) {
        alert("Error: " + error.message);
      }
    }
  });
}

// Helper: Handle Redirection
async function handleUserRedirection(user) {
  const uid = user.uid;

  // Admin shortcut
  if (user.email === "mmanoorkar9@gmail.com") {
    const userData = { uid, email: user.email, role: "admin" };
    saveSession(userData);
    window.location.href = "admin.html";
    return;
  }

  const snap = await getDoc(doc(db, "users", uid));
  if (!snap.exists()) throw new Error("No profile found in database.");

  const { role, approved, username } = snap.data();

  if (!approved) {
    alert("Your account is pending admin approval.");
    await signOut(auth);
    return;
  }

  const userInfo = { uid, email: user.email, role, username };
  saveSession(userInfo);

  if (role === "teacher") {
    window.location.href = "./profDashboard/professorDashboard.html";
  } else if (role === "student") {
    window.location.href = "./studDashboard/studentDashboard.html";
  } else {
    alert("Unknown role.");
  }
}

function saveSession(data) {
  sessionStorage.setItem("loggedUser", JSON.stringify(data));
  localStorage.setItem("loggedUser", JSON.stringify(data));
}
