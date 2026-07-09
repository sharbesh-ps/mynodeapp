const id = location.pathname.split("/")[2];

const form = document.getElementById("updateForm");


// Load user details
async function loadUser() {
  try {
    const response = await fetch(`/user/${id}`);
    const result = await response.json();

    if (result.status !== "success") {
      alert("User not found");
      location.href = "/views";
      return;
    }

    const user = result.data;

    document.getElementById("username").value = user.username || "";
    document.getElementById("email").value = user.email || "";
    document.getElementById("mobile").value = user.mobile || "";
    document.getElementById("dob").value = user.dob || "";
    document.getElementById("language").value = user.language || "";
    document.getElementById("role").value = user.role;
    document.getElementById("role").value = user.role;

    // Gender
    const gender = document.querySelector(
      `input[name="gender"][value="${user.gender}"]`,
    );

    if (gender) {
      gender.checked = true;
    }

    // Skills
    if (Array.isArray(user.skills)) {
      user.skills.forEach((skill) => {
        const checkbox = document.querySelector(
          `input[name="skills"][value="${skill}"]`,
        );

        if (checkbox) {
          checkbox.checked = true;
        }
      });
    }
  } catch (err) {
    console.error(err);
    alert("Unable to load user.");
  }
}

loadUser();

form.addEventListener("submit", async function (e) {
  e.preventDefault();

  clearAllErrors();

  const username = document.getElementById("username");
  const email = document.getElementById("email");
  const mobile = document.getElementById("mobile");
  const dob = document.getElementById("dob");
  const language = document.getElementById("language");
  const password = document.getElementById("password");
  const role = document.getElementById("role");

  const gender = document.querySelector('input[name="gender"]:checked');

  const skills = [];

  document
    .querySelectorAll('input[name="skills"]:checked')
    .forEach((skill) => skills.push(skill.value));

  let valid = true;

  const emailRegex =
    /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.(com|org|net|edu|gov|co|in)$/i;

  const mobileRegex = /^[6-9]\d{9}$/;

  if (username.value.trim() === "") {
    showError("username", "usernameError", "Username is required.");
    valid = false;
  }

  if (!emailRegex.test(email.value.trim())) {
    showError("email", "emailError", "Enter a valid email.");
    valid = false;
  }

  if (!mobileRegex.test(mobile.value.trim())) {
    showError("mobile", "mobileError", "Enter a valid mobile number.");
    valid = false;
  }

  if (!dob.value) {
    alert("Select Date of Birth");
    valid = false;
  }

  if (!gender) {
    alert("Select Gender");
    valid = false;
  }

  if (!language.value) {
    alert("Select Language");
    valid = false;
  }

  // Role validation
  if (!role.value) {
    showError("role", "roleError", "Select a role.");
    valid = false;
  }

  // Password is optional
  if (
    password.value.trim() !== "" &&
    password.value.trim().length < 6
  ) {
    showError(
      "password",
      "passwordError",
      "Password must be at least 6 characters."
    );
    valid = false;
  }

  if (skills.length === 0) {
    alert("Select at least one Skill");
    valid = false;
  }

  if (!valid) return;

  const body = {
    username: username.value.trim(),
    email: email.value.trim(),
    password: password.value.trim(), // Empty if unchanged
    role: role.value,
    mobile: mobile.value.trim(),
    dob: dob.value,
    gender: gender.value,
    language: language.value,
    skills,
  };

  try {
    const response = await fetch(`/update/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    const result = await response.json();

    if (result.status === "success") {
      alert("User updated successfully.");
      location.href = "/views";
    } else {
      alert(result.message || "Update failed.");
    }
  } catch (err) {
    console.error(err);
    alert("Server Error");
  }
});
