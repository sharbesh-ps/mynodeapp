// =====================================
// Load Logged-in Student
// =====================================

async function loadStudent() {
  try {
    const response = await fetch("/student/details");

    const result = await response.json();

    if (result.status !== "success") {
      alert(result.message);
      return;
    }

    const student = result.data;

    document.getElementById(
      "studentName"
    ).textContent = `Welcome ${student.username}`;

  } catch (error) {
    console.error(error);
    alert("Unable to load student details.");
  }
}

loadStudent();