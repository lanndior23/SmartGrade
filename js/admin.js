// js/admin.js
import { auth, db } from "../firebase/config.js";
import {
  signOut, onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/9.22.2/firebase-auth.js";
import {
  collection, addDoc, getDocs, deleteDoc, doc, setDoc, serverTimestamp
} from "https://www.gstatic.com/firebasejs/9.22.2/firebase-firestore.js";

// Check if admin is logged in
onAuthStateChanged(auth, (user) => {
  if (!user) window.location.href = "login.html";
});

// Logout
document.getElementById("logoutBtn").addEventListener("click", async () => {
  await signOut(auth);
});

// Add Grade
const gradeForm = document.getElementById("gradeForm");
const formMsg = document.getElementById("formMsg");

gradeForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  formMsg.textContent = "";

  const studentName = gradeForm.studentName.value.trim();
  const studentID = gradeForm.studentID.value.trim();
  const subject = gradeForm.subject.value.trim();
  const score = parseFloat(gradeForm.score.value);
  const term = gradeForm.term.value.trim();

  const grade = score >= 90 ? 'A+' :
                score >= 80 ? 'A' :
                score >= 70 ? 'B' :
                score >= 60 ? 'C' :
                score >= 50 ? 'D' : 'F';

  const editId = gradeForm.dataset.editId;

  try {
    if (editId) {
      const gradeRef = doc(db, "grades", editId);
      await setDoc(gradeRef, {
        studentName, studentID, subject, score, grade, term, date: serverTimestamp()
      });
      formMsg.textContent = "✅ Grade updated!";
      delete gradeForm.dataset.editId;
      document.querySelector(".btn-add").textContent = "Add Grade";
    } else {
      await addDoc(collection(db, "grades"), {
        studentName, studentID, subject, score, grade, term, date: serverTimestamp()
      });
      formMsg.textContent = "✅ Grade added!";
    }

    gradeForm.reset();
    loadGrades();
  } catch (err) {
    formMsg.textContent = "❌ Error: " + err.message;
  }
});

// Load Grades
const gradesBody = document.getElementById("gradesBody");

async function loadGrades() {
  gradesBody.innerHTML = "";
  const querySnapshot = await getDocs(collection(db, "grades"));
querySnapshot.forEach((docSnap) => {
  const data = docSnap.data();
  const tr = document.createElement("tr");

  tr.innerHTML = `
    <td>${data.studentName}</td>
    <td>${data.studentID}</td>
    <td>${data.subject}</td>
    <td>${data.score}</td>
    <td>${data.grade}</td>
    <td>${data.term}</td>
    <td>
      <button class="action-btn" onclick="editGrade('${docSnap.id}', '${data.studentName}', '${data.studentID}', '${data.subject}', ${data.score}, '${data.term}')">Edit</button>
      <button class="action-btn delete" onclick="deleteGrade('${docSnap.id}')">Delete</button>
    </td>
  `;
  gradesBody.appendChild(tr);
});
}
window.deleteGrade = async function (id) {
  if (confirm("Delete this grade?")) {
    await deleteDoc(doc(db, "grades", id));
    loadGrades();
  }
};
window.editGrade = function (id, name, studentID, subject, score, term) {
  document.getElementById("studentName").value = name;
  document.getElementById("studentID").value = studentID;
  document.getElementById("subject").value = subject;
  document.getElementById("score").value = score;
  document.getElementById("term").value = term;

  formMsg.innerText = "Editing grade...";

  gradeForm.dataset.editId = id;
  document.querySelector(".btn-add").textContent = "Update Grade";
};

loadGrades();
