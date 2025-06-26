// make-exam-backend.js
import {
  getDocs,
  collection,
  query,
  where,
  addDoc,
  serverTimestamp,
} from "https://www.gstatic.com/firebasejs/9.22.0/firebase-firestore.js";

import { signOut } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-auth.js";
import { db, auth } from "../../js/firebase-config.js";

export async function loadStudentDropdown() {
  try {
    const q = query(collection(db, "users"), where("role", "==", "student"));
    const snap = await getDocs(q);
    const dropdown = document.getElementById("studentDropdown");
    dropdown.innerHTML = "";
    snap.forEach((doc) => {
      const { email, username } = doc.data();
      if (email) {
        const option = document.createElement("option");
        option.value = email;
        option.textContent = username ? `${username} (${email})` : email;
        dropdown.appendChild(option);
      }
    });
  } catch (err) {
    console.error("Error fetching student emails:", err);
  }
}

export function addQuestionBlock() {
  const container = document.createElement("div");
  container.className = "border p-3 rounded bg-gray-50";

  container.innerHTML = `
    <label class="block mb-1">Question Text</label>
    <input type="text" class="questionText w-full mb-2 border px-2 py-1 rounded" placeholder="Enter question">

    <label class="block mb-1">Marks</label>
    <input type="number" class="questionMarks w-full mb-2 border px-2 py-1 rounded" min="0">

    <label class="block mb-1">Negative Marking</label>
    <select class="negativeMarking w-full mb-2 border px-2 py-1 rounded">
      <option value="no">No</option>
      <option value="yes">Yes</option>
    </select>

    <label class="block mb-1">Answer Options</label>
    <input type="text" class="option w-full mb-1 border px-2 py-1 rounded" placeholder="Option 1">
    <input type="text" class="option w-full mb-1 border px-2 py-1 rounded" placeholder="Option 2">
    <input type="text" class="option w-full mb-1 border px-2 py-1 rounded" placeholder="Option 3">
    <input type="text" class="option w-full mb-2 border px-2 py-1 rounded" placeholder="Option 4">

    <label class="block mb-1">Correct Option (1 to 4)</label>
    <input type="number" class="correctOption w-full border px-2 py-1 rounded" min="1" max="4">
  `;

  document.getElementById("questionList").appendChild(container);
}

export async function saveExamToFirestore() {
  const uid = auth.currentUser?.uid;
  if (!uid) return alert("Not logged in.");

  const testName = document.getElementById("testName").value;
  const duration = parseInt(document.getElementById("testDuration").value);
  const dateTime = document.getElementById("testDateTime").value;
  const description = document.getElementById("testDescription").value;
  const selectedEmails = Array.from(
    document.getElementById("studentDropdown").selectedOptions
  ).map((o) => o.value);

  const questions = [];
  document.querySelectorAll("#questionList > div").forEach((q) => {
    const questionText = q.querySelector(".questionText").value;
    const marks = parseInt(q.querySelector(".questionMarks").value);
    const negative = q.querySelector(".negativeMarking").value === "yes";
    const options = Array.from(q.querySelectorAll(".option")).map((i) => i.value);
    const correct = parseInt(q.querySelector(".correctOption").value) - 1;

    questions.push({ questionText, marks, negative, options, correct });
  });

  const examDoc = {
    createdBy: uid,
    testName,
    duration,
    startDateTime: dateTime,
    description,
    invitedStudents: selectedEmails,
    questions,
    createdAt: serverTimestamp(),
  };

  try {
    await addDoc(collection(db, "exams"), examDoc);
    alert("✅ Exam saved successfully!");
  } catch (e) {
    alert("❌ Failed to save exam: " + e.message);
  }
}

export async function logoutAndRedirect() {
  try {
    await signOut(auth);
    sessionStorage.clear();
    localStorage.clear();
    window.location.href = "../../index.html";
  } catch (error) {
    console.error("Logout failed:", error);
  }
}
