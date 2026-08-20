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

  const data = await response.json();

  if (!response.ok) {
    throw new Error("Registration failed");
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


  const data = await response.text();

  if (!response.ok) {
    throw new Error(data || "Invalid email or password");
  }

  return data;
}