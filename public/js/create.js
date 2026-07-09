const form = document.getElementById("createForm");
const languageChoices = new Choices("#language", {
  removeItemButton: true,
  searchEnabled: false,
  shouldSort: false,
});

form.addEventListener("submit", function (e) {
  e.preventDefault();


  clearAllErrors();

  const username = document.getElementById("username");
  const email = document.getElementById("email");
  const mobile = document.getElementById("mobile");
  const dob = document.getElementById("dob");
  const password = document.getElementById("password");
  const role = document.getElementById("role");
  const gender = document.querySelector('input[name="gender"]:checked');

  const skills = [];

  document
    .querySelectorAll('input[name="skills"]:checked')
    .forEach((item) => skills.push(item.value));

  let valid = true;

  const emailRegex =
    /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.(com|org|net|edu|gov|co|in)$/i;

  const mobileRegex = /^[6-9]\d{9}$/;

  if (username.value.trim() === "") {
    showError("username", "usernameError", "Username is required.");
    valid = false;
  }

  if (!emailRegex.test(email.value.trim())) {
    console.log('show error is triggered');
    showError("email", "emailError", "Enter a valid email.");
    valid = false;
  }

  if (!mobileRegex.test(mobile.value.trim())) {
    showError("mobile", "mobileError", "Enter a valid mobile number.");
    valid = false;
  }

  // Password Validation
  if (password.value.trim() === "") {
    showError("password", "passwordError", "Password is required.");
    valid = false;
  } else if (password.value.length < 6) {
    showError(
      "password",
      "passwordError",
      "Password must be at least 6 characters."
    );
    valid = false;
  }

  // Role Validation
  if (role.value === "") {
    showError("role", "roleError", "Select a role.");
    valid = false;
  }

  if (!dob.value) {
    showError("dob", "dobError", "Select Date of Birth.");
    valid = false;
  }

  if (!gender) {
    document.getElementById("genderError").innerText = "Select Gender.";
    valid = false;
  }
  // languages
  const languages = languageChoices.getValue(true);
  if (languages.length === 0) {
    showError("language", "languageError", "Select at least one language.");
    valid = false;
  }


  if (skills.length === 0) {
    document.getElementById("skillsError").innerText =
      "Select at least one skill.";
    valid = false;
  }

  if (!valid) return;

  form.submit();
});
