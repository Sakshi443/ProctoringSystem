   import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-app.js";
    import { getFirestore, collection, getDocs } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-firestore.js";

    const firebaseConfig = {
      apiKey: "AIzaSyAg-Qc46CzCYdN_JGayHuR7xYxlsryUpZc",
      authDomain: "proctored-system.firebaseapp.com",
      projectId: "proctored-system",
      storageBucket: "proctored-system.appspot.com",
      messagingSenderId: "512898908874",
      appId: "1:512898908874:web:23584b6cad04eb9e0c2a33"
    };

    const app = initializeApp(firebaseConfig);
    const db = getFirestore(app);

    const examListDiv = document.getElementById("examList");
    const examSection = document.getElementById("examSection");
    const examForm = document.getElementById("examForm");
    const examTitle = document.getElementById("examTitle");
    const mainContent = document.getElementById("mainContent");

    let tabSwitchCount = 0;
    let examStarted = false;

    async function fetchExams() {
      const examsSnapshot = await getDocs(collection(db, "exams"));
      examsSnapshot.forEach((docSnap) => {
        const exam = docSnap.data();
        const btn = document.createElement("button");
        btn.className = "block w-full text-left bg-white shadow p-4 rounded hover:bg-blue-50";
        btn.textContent = `📘 ${exam.testName} — ${new Date(exam.startDateTime).toLocaleString()}`;
        btn.onclick = () => startExam(docSnap.id, exam);
        examListDiv.appendChild(btn);
      });
    }
    document.getElementById("startExamBtn").addEventListener("click", () => {
      document.documentElement.requestFullscreen();

      navigator.mediaDevices.getUserMedia({ video: true })
        .then(stream => {
          document.getElementById("cameraFeed").srcObject = stream;
        })
        .catch(error => {
          alert("Camera access denied!");
        });
    });


    async function startExam(id, exam) {
      examStarted = true;
      tabSwitchCount = 0;

      // Fullscreen on start
      if (mainContent.requestFullscreen) {
        await mainContent.requestFullscreen();
      }

      examTitle.textContent = `Exam: ${exam.testName}`;
      examListDiv.classList.add("hidden");
      examSection.classList.remove("hidden");

      startWebcam();

      exam.questions.forEach((q, index) => {
        const qBlock = document.createElement("div");
        qBlock.innerHTML = `
          <p class="font-medium">${index + 1}. ${q.questionText}</p>
          ${q.options.map((opt, i) => `
            <label class="block">
              <input type="radio" name="q${index}" value="${i + 1}" class="mr-2" />
              ${opt}
            </label>
          `).join("")}
        `;
        examForm.appendChild(qBlock);
      });
    }

    function startWebcam() {
      const video = document.getElementById("webcam");
      navigator.mediaDevices.getUserMedia({ video: true })
        .then((stream) => video.srcObject = stream)
        .catch(() => alert("Camera access denied. Cannot start exam."));
    }

    document.getElementById("submitExamBtn").onclick = () => {
      alert("✅ Exam submitted successfully!");
      location.reload();
    };

    function terminateExam(reason = "❌ Exam terminated due to policy violation.") {
      examForm.innerHTML = "";
      document.getElementById("submitExamBtn").remove();
      const webcam = document.getElementById("webcam");
      if (webcam.srcObject) {
        webcam.srcObject.getTracks().forEach(track => track.stop());
      }
      examTitle.textContent = reason;
      if (document.fullscreenElement) {
        document.exitFullscreen();
      }
    }

    // Tab switching detection
    window.addEventListener("blur", () => {
      if (!examStarted) return;

      tabSwitchCount++;

      if (tabSwitchCount === 1) {
        alert("⚠️ Tab switch detected! If this happens again, your exam will be terminated.");
      } else {
        alert("❌ Tab switch limit exceeded. Exam terminated.");
        terminateExam();
      }
    });

    window.addEventListener("focus", () => {
      console.log("Tab is active again.");
    });

    fetchExams();