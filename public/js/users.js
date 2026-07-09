const tbody = document.getElementById("tbody");

const search = document.getElementById("search");
const genderFilter = document.getElementById("genderFilter");
const resetFilter = document.getElementById("resetBtn");
const roleFilter = document.getElementById("roleFilter");
// const languageFilters = document.getElementById("languageFilter");
// const skillFilters = document.getElementById("skillFilter");

const languageFilter = new TomSelect("#languageFilter", {
  plugins: ["remove_button"],
  placeholder: "All Languages",
  hidePlaceholder: true,
});

const skillsFilter = new TomSelect("#skillsFilter", {
  plugins: ["remove_button"],
  placeholder: "All Skills",
  hidePlaceholder: true,
});




async function loadUsers() {
  const params = new URLSearchParams();

  // Username Search
  if (search.value.trim()) {
    params.append("search", search.value.trim());
  }

  // Role Filter
  if (roleFilter.value) {
    params.append("role", roleFilter.value);
  }

  // Gender Filter
  if (genderFilter.value) {
    params.append("gender", genderFilter.value);
  }

  // Multiple Language Filter
  const languages = languageFilter.getValue();
  if (languages.length > 0) {
    params.append("language", languages.join(","));
  }

  // Multiple skills Filter
  const skills = skillsFilter.getValue();
  if (skills.length > 0) {
    params.append("skills", skills.join(","));
  } 

  const response = await fetch(`/users?${params.toString()}`);
  const result = await response.json();
  tbody.innerHTML = "";
  result.data.forEach((user, index) => {
    tbody.innerHTML += `
<tr onclick="viewUser('${user._id}')" style="cursor:pointer">
<td>${index + 1}</td>
<td>${capitalize(user.username)}</td>
<td>${user.email}</td>

<td>
  <span class="badge ${user.role === "ADMIN"
        ? "bg-danger"
        : "bg-primary"
      }">
    ${user.role || "STUDENT"}
  </span>
</td>

<td>${user.mobile}</td>
<td>${user.dob}</td>
<td>${user.gender}</td>
<td>${user.language}</td>
<td>${Array.isArray(user.skills) ? user.skills.join(", ") : user.skills}</td>

<td>
<a
href="/update/${user._id}"
class="btn btn-warning btn-sm"
onclick="event.stopPropagation()">
Edit
</a>

<button
class="btn btn-danger btn-sm"
onclick="event.stopPropagation();deleteUser('${user._id}')">
Delete
</button>

</td>
</tr>
`;
  });
}

// View User
function viewUser(id) {
  location.href = `/viewuser/${id}`;
}

// Delete User
async function deleteUser(id) {
  if (!confirm("Delete this user?")) return;
  const response = await fetch(`/delete/${id}`, {
    method: "DELETE",
  });
  const result = await response.json();
  alert(result.message);
  loadUsers();
}

function resetFilters() {
  search.value = "";
  genderFilter.value = "";
  languageFilter.clear();
  skillsFilter.clear()
  roleFilter.value = "";


  loadUsers();
}

// Event Listeners
search.addEventListener("keyup", loadUsers);
genderFilter.addEventListener("change", loadUsers);
languageFilter.on("change", loadUsers);
skillsFilter.on("change", loadUsers);
roleFilter.addEventListener("change", loadUsers);
resetFilter.addEventListener("click", resetFilters);


// Initial Load
loadUsers();
