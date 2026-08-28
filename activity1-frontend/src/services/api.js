const API_BASE_URL = "http://localhost:8080/api";

export async function registerUser(userData) {
    const response = await fetch(
        `${API_BASE_URL}/auth/register`,
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
        throw new Error(data.message || "Registration failed");
    }

    return data;
}

export async function loginUser(userData) {
    const response = await fetch(
        `${API_BASE_URL}/auth/login`,
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
        throw new Error(data.message || "Invalid email or password");
    }

  
    localStorage.setItem("token", data.token);

    return data;
}