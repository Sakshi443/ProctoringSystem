# 🎓 AI-Powered Proctoring System

An AI-driven proctoring system designed to ensure the integrity of online examinations by detecting and reporting suspicious behaviors such as face absence, multiple faces, and gaze aversion in real-time using computer vision techniques.

## 🚀 Project Overview

The **AI-Powered Proctoring System** is a web-based application that:
- Monitors candidates during online assessments using their webcam.
- Detects and flags various types of violations including:
  - No face detected
  - Multiple faces detected
  - Candidate looking away
- Captures violation evidence and maintains session logs for post-exam review.

## 🛠️ Tech Stack

- **Frontend:** HTML, CSS, JavaScript, Tailwind CSS
- **Backend:** Firebase (Firestore, Authentication, Storage)
- **AI/ML:** face-api.js (TensorFlow.js)
- **Deployment:** Render

## 📌 Key Features

✅ Real-time face detection and landmark recognition  
✅ Automated violation detection (No Face, Multiple Faces, Looking Away)  
✅ Violation snapshots and timestamped logs  
✅ Admin panel for exam creation, student management, and violation review  
✅ User authentication for both admin and students  
✅ Responsive and user-friendly UI  

## 📸 Screenshots

| Exam Start Page | Violation Report | Live Proctoring |
|-----------------|-----------------|------------------|
| *![Screenshot 2025-06-30 152034](https://github.com/user-attachments/assets/905faa09-25bd-4600-a3fa-2f38bbffdf65)* | *![image](https://github.com/user-attachments/assets/bc15e7cb-441b-49df-a554-98180d4d4aba)* | *![WhatsApp Image 2025-06-29 at 22 24 41_a3bb4723](https://github.com/user-attachments/assets/07b46ba0-087e-427f-a2c5-1677e1d56d4b)* |

## 📝 How to Use

1. **Clone the repository**
   ```bash
   git clone https://github.com/Sakshi443/ProctoringSystem.git
   cd ProctoringSystem
