const API_BASE_URL = "http://localhost:8080/api";

export async function registerUser(userData) {
  const response = await fetch(
    `${API_BASE_URL}/register`,
    {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify(userData),
    }
  );

  let data;

  try {
    data = await response.json();
  } catch {
    data = {};
  }

  if (!response.ok) {
    throw new Error(
      data.message || "Registration failed"
    );
  }

  return data;
}

export async function loginUser(userData) {
  const response = await fetch(
    `${API_BASE_URL}/login`,
    {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify(userData),
    }
  );

  let data;

  try {
    data = await response.json();
  } catch {
    data = {};
  }

  if (!response.ok) {
    throw new Error(
      data.message || "Login failed"
    );
  }

  return data;
}