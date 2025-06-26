// ✅ Firebase SDK Modular Imports
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-app.js";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendEmailVerification,
  signOut,
} from "https://www.gstatic.com/firebasejs/9.22.0/firebase-auth.js";
import {
  getFirestore,
  doc,
  setDoc,
  getDoc,
} from "https://www.gstatic.com/firebasejs/9.22.0/firebase-firestore.js";

// ✅ Firebase Configuration
const firebaseConfig = {
  apiKey: "AIzaSyAg-Qc46CzCYdN_JGayHuR7xYxlsryUpZc",
  authDomain: "proctored-system.firebaseapp.com",
  projectId: "proctored-system",
  storageBucket: "proctored-system.appspot.com",
  messagingSenderId: "512898908874",
  appId: "1:512898908874:web:23584b6cad04eb9e0c2a33",
  measurementId: "G-3SL8C6C8RD",
};

// ✅ Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// ✅ Panel toggle handlers
const container = document.getElementById("container");
document.getElementById("goRegister").onclick = () =>
  container.classList.add("right-panel-active");
document.getElementById("goLogin").onclick = () =>
  container.classList.remove("right-panel-active");

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
      container.classList.remove("right-panel-active");
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

    const uid = cred.user.uid;

    // Admin shortcut
    if (email === "mmanoorkar9@gmail.com" && pass === "admin123") {
      const userData = {
        uid,
        email: cred.user.email,
        role: "admin",
      };
      sessionStorage.setItem("loggedUser", JSON.stringify(userData));
      localStorage.setItem("loggedUser", JSON.stringify(userData));
      window.location.href = "admin.html";
      return;
    }

    const snap = await getDoc(doc(db, "users", uid));
    if (!snap.exists()) throw new Error("No profile found.");

    const { role, approved, username } = snap.data();

    if (!approved) {
      alert("Your account is pending admin approval.");
      await signOut(auth);
      return;
    }

    const userInfo = {
      uid,
      email: cred.user.email,
      role,
      username,
    };
    sessionStorage.setItem("loggedUser", JSON.stringify(userInfo));
    localStorage.setItem("loggedUser", JSON.stringify(userInfo));

    if (role === "teacher") {
      window.location.href = "./profDashboard/professorDashboard.html";
    } else if (role === "student") {
      window.location.href = "./studDashboard/studentDashboard.html";
    } else {
      alert("Unknown role.");
      await signOut(auth);
    }
  } catch (err) {
    alert(err.message);
  }
});
