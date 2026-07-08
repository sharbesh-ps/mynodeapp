const id = location.pathname.split("/")[2];

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
    document.getElementById("username").textContent = capitalize(user.username);
    document.getElementById("email").textContent = user.email;
    document.getElementById("mobile").textContent = user.mobile;
    document.getElementById("dob").textContent = user.dob;
    document.getElementById("gender").textContent = user.gender;
    document.getElementById("language").textContent = user.language;
    document.getElementById("skills").textContent = Array.isArray(user.skills)
      ? user.skills.join(", ")
      : "";
    document.getElementById("editBtn").onclick = () => {
      location.href = `/update/${id}`;
    };
  } catch (err) {
    console.error(err);
    alert("Unable to load user.");
  }
}

loadUser();
