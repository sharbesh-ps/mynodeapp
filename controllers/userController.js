const querystring = require("querystring");
const userModel = require("../models/userModel");
const { validateUser } = require("../utils/validator");
const { hashPassword } = require("../utils/password");

// ==========================================
// Create User
// ==========================================
async function createUser(req, res) {
  let body = "";

  req.on("data", (chunk) => {
    body += chunk.toString();
  });

  req.on("end", async () => {
    try {
      const data = querystring.parse(body);

      // Convert skills to array
      if (data.skills) {
        data.skills = Array.isArray(data.skills)
          ? data.skills
          : [data.skills];
      } else {
        data.skills = [];
      }

      // Validation
      const validation = validateUser(data);

      if (!validation.valid) {
        res.writeHead(400, {
          "Content-Type": "application/json",
        });

        return res.end(
          JSON.stringify({
            status: "error",
            errors: validation.errors,
          })
        );
      }

      // Hash password
      data.password = await hashPassword(data.password);

      // Default values
      data.isActive = true;
      data.createdAt = new Date();
      data.updatedAt = new Date();

      // Save user
      await userModel.createUser(data);

      res.writeHead(302, {
        Location: "/views",
      });

      res.end();
    } catch (err) {
      console.error(err);

      res.writeHead(500, {
        "Content-Type": "application/json",
      });

      res.end(
        JSON.stringify({
          status: "error",
          message: "Unable to create user.",
        })
      );
    }
  });
}

// ==========================================
// Get All Users
// ==========================================
async function getUsers(req, res) {
  try {
    const url = new URL(req.url, `http://${req.headers.host}`);

    const filters = {
      search: url.searchParams.get("search") || "",
      gender: url.searchParams.get("gender") || "",
      role: url.searchParams.get("role") || "",
      languages: [],
      skills: [],
    };

    // Multiple Language Filter
    const language = url.searchParams.get("language");

    if (language) {
      filters.languages = language
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean);
    }

const users = await userModel.getUsers(filters);
    // Skills Filter
    const skills = url.searchParams.get("skills");
    if (skills) {
      filters.skills = skills
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean);
    }



    res.writeHead(200, {
      "Content-Type": "application/json",
    });

    res.end(
      JSON.stringify({
        status: "success",
        count: users.length,
        data: users,
      })
    );
  } catch (err) {
    console.error(err);

    res.writeHead(500, {
      "Content-Type": "application/json",
    });

    res.end(
      JSON.stringify({
        status: "error",
        message: "Unable to fetch users.",
      })
    );
  }
}

// ==========================================
// Get Single User
// ==========================================
async function getUser(req, res, id) {
  try {
    const user = await userModel.getUserById(id);

    if (!user) {
      res.writeHead(404, {
        "Content-Type": "application/json",
      });

      return res.end(
        JSON.stringify({
          status: "error",
          message: "User not found",
        })
      );
    }

    res.writeHead(200, {
      "Content-Type": "application/json",
    });

    res.end(
      JSON.stringify({
        status: "success",
        data: user,
      })
    );
  } catch (err) {
    console.error(err);

    res.writeHead(500, {
      "Content-Type": "application/json",
    });

    res.end(
      JSON.stringify({
        status: "error",
        message: "Unable to fetch user",
      })
    );
  }
}

// ==========================================
// Update User
// ==========================================
async function updateUser(req, res, id) {
  let body = "";

  req.on("data", (chunk) => {
    body += chunk.toString();
  });

  req.on("end", async () => {
    try {
      const data = JSON.parse(body);

      // Ensure skills is always an array
      if (!Array.isArray(data.skills)) {
        data.skills = data.skills ? [data.skills] : [];
      }

      // Validate
      const validation = validateUser(data);

      if (!validation.valid) {
        res.writeHead(400, {
          "Content-Type": "application/json",
        });

        return res.end(
          JSON.stringify({
            status: "error",
            errors: validation.errors,
          })
        );
      }

      // Hash password only if user entered one
      if (data.password && data.password.trim() !== "") {
        data.password = await hashPassword(data.password);
      } else {
        delete data.password;
      }

      // Update timestamp
      data.updatedAt = new Date();

      // Update user
      await userModel.updateUser(id, data);

      // Fetch updated user
      const updatedUser = await userModel.getUserById(id);

      res.writeHead(200, {
        "Content-Type": "application/json",
      });

      res.end(
        JSON.stringify({
          status: "success",
          message: "User updated successfully.",
          data: updatedUser,
        })
      );
    } catch (err) {
      console.error(err);

      res.writeHead(500, {
        "Content-Type": "application/json",
      });

      res.end(
        JSON.stringify({
          status: "error",
          message: "Unable to update user.",
        })
      );
    }
  });
}

// ==========================================
// Delete User
// ==========================================
async function deleteUser(req, res, id) {
  try {
    // Check whether the user exists
    const user = await userModel.getUserById(id);

    if (!user) {
      res.writeHead(404, {
        "Content-Type": "application/json",
      });

      return res.end(
        JSON.stringify({
          status: "error",
          message: "User not found",
        })
      );
    }

    await userModel.deleteUser(id);

    res.writeHead(200, {
      "Content-Type": "application/json",
    });

    res.end(
      JSON.stringify({
        status: "success",
        message: "User deleted successfully.",
      })
    );
  } catch (err) {
    console.error(err);

    res.writeHead(500, {
      "Content-Type": "application/json",
    });

    res.end(
      JSON.stringify({
        status: "error",
        message: "Unable to delete user.",
      })
    );
  }
}

// ==========================================
// Export Controller Functions
// ==========================================
module.exports = {
  createUser,
  getUsers,
  getUser,
  updateUser,
  deleteUser,
};