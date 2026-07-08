// Capitalize first letter of every word
function capitalize(text) {
  if (!text) return "";

  return text.replace(/\b\w/g, (char) => char.toUpperCase());
}

// Go back to previous page
function goBack() {
  history.back();
}

// Show validation error
function showError(inputId, errorId, message) {
  const input = document.getElementById(inputId);
  const error = document.getElementById(errorId);

  if (input) {
    input.classList.add("is-invalid");
  }

  if (error) {
    error.textContent = message;
  }
}

// Clear validation error
function clearError(inputId, errorId) {
  const input = document.getElementById(inputId);
  const error = document.getElementById(errorId);

  if (input) {
    input.classList.remove("is-invalid");
  }

  if (error) {
    error.textContent = "";
  }
}

// Clear all validation errors
function clearAllErrors() {
  document.querySelectorAll(".is-invalid").forEach((element) => {
    element.classList.remove("is-invalid");
  });

  document.querySelectorAll(".text-danger").forEach((element) => {
    element.textContent = "";
  });
}
