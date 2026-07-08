// =====================================
// Load Student Profile
// =====================================

async function loadProfile() {
  try {

    const response = await fetch("/student/details");

    const result = await response.json();

    if (result.status !== "success") {
      alert(result.message);
      return;
    }

    const student = result.data;

    document.getElementById("username").textContent =
      student.username;

    document.getElementById("email").textContent =
      student.email;

    document.getElementById("mobile").textContent =
      student.mobile;

    document.getElementById("dob").textContent =
      student.dob;

    document.getElementById("gender").textContent =
      student.gender;

    document.getElementById("language").textContent =
      student.language;

    document.getElementById("skills").textContent =
      Array.isArray(student.skills)
        ? student.skills.join(", ")
        : student.skills;

  } catch (error) {
    console.error(error);
    alert("Unable to load profile.");
  }
}

loadProfile();