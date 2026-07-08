const form = document.getElementById("loginForm");

form.addEventListener("submit", function (e) {
  e.preventDefault();

  clearAllErrors();

  const email = document.getElementById("email");
  const password = document.getElementById("password");

  let valid = true;

  const emailRegex =
    /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.(com|org|net|edu|gov|co|in)$/i;

  if (email.value.trim() === "") {
    showError("email", "emailError", "Email is required.");
    valid = false;
  } else if (!emailRegex.test(email.value.trim())) {
    showError("email", "emailError", "Enter a valid email address.");
    valid = false;
  }

  if (password.value.trim() === "") {
    showError("password", "passwordError", "Password is required.");
    valid = false;
  }

  if (!valid) {
    return;
  }

  form.submit();
});
