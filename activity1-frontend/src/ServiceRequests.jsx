import { useEffect, useState } from "react";
import "./ServiceRequests.css";

const API_URL = "http://localhost:8080/api/requests";

function ServiceRequests() {

    const [requests, setRequests] = useState([]);
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [category, setCategory] = useState("");
    const [editingId, setEditingId] = useState(null);
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(true);

    const getToken = () => {
        return (
            localStorage.getItem("token") ||
            localStorage.getItem("jwt") ||
            localStorage.getItem("accessToken")
        );
    };

    const loadRequests = async () => {

        const token = getToken();

        if (!token) {
            setError("Please login first.");
            setLoading(false);
            return;
        }

        try {

            const response = await fetch(API_URL, {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            if (response.status === 401) {
                setError("Your session has expired. Please login again.");
                setLoading(false);
                return;
            }

            if (!response.ok) {
                throw new Error("Failed to load service requests.");
            }

            const data = await response.json();

            setRequests(data);
            setError("");

        } catch (error) {
            setError(error.message);
        }

        setLoading(false);
    };

    useEffect(() => {
        loadRequests();
    }, []);

    const handleSubmit = async (e) => {

        e.preventDefault();

        setMessage("");
        setError("");

        const token = getToken();

        if (!token) {
            setError("Please login first.");
            return;
        }

        try {

            let url = API_URL;
            let method = "POST";

            if (editingId) {
                url = `${API_URL}/${editingId}`;
                method = "PUT";
            }

            const response = await fetch(url, {
                method: method,
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({
                    title: title,
                    description: description,
                    category: category
                })
            });

            if (response.status === 401) {
                throw new Error("Please login again.");
            }

            if (response.status === 403) {
                throw new Error("You are not allowed to modify this request.");
            }

            if (!response.ok) {
                throw new Error("Failed to save request.");
            }

            if (editingId) {
                setMessage("Request updated successfully.");
            } else {
                setMessage("Request created successfully.");
            }

            clearForm();
            loadRequests();

        } catch (error) {
            setError(error.message);
        }
    };

    const editRequest = (request) => {

        setEditingId(request.id);
        setTitle(request.title);
        setDescription(request.description);
        setCategory(request.category);

        setMessage("");
        setError("");
    };

    const deleteRequest = async (id) => {

        const confirmed = window.confirm(
            "Are you sure you want to delete this request?"
        );

        if (!confirmed) {
            return;
        }

        const token = getToken();

        if (!token) {
            setError("Please login first.");
            return;
        }

        try {

            const response = await fetch(
                `${API_URL}/${id}`,
                {
                    method: "DELETE",
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            if (response.status === 401) {
                throw new Error("Please login again.");
            }

            if (response.status === 403) {
                throw new Error(
                    "You are not allowed to delete this request."
                );
            }

            if (!response.ok) {
                throw new Error("Failed to delete request.");
            }

            setMessage("Request deleted successfully.");

            loadRequests();

        } catch (error) {
            setError(error.message);
        }
    };

    const clearForm = () => {
        setTitle("");
        setDescription("");
        setCategory("");
        setEditingId(null);
    };

    const logout = () => {

        localStorage.removeItem("token");
        localStorage.removeItem("jwt");
        localStorage.removeItem("accessToken");

        window.location.href = "/login";
    };

    if (loading) {
        return (
            <div className="service-page">
                <div className="form-container">
                    <h2>Loading...</h2>
                </div>
            </div>
        );
    }

    return (
        <div className="service-page">

            <div className="header">

                <div>
                    <h1>My Service Requests</h1>
                    <p>Create and manage your service requests.</p>
                </div>

                <button onClick={logout}>
                    Logout
                </button>

            </div>

            {message && (
                <div className="success">
                    {message}
                </div>
            )}

            {error && (
                <div className="error">
                    {error}
                </div>
            )}

            <div className="form-container">

                <h2>
                    {editingId
                        ? "Edit Service Request"
                        : "Create Service Request"}
                </h2>

                <form onSubmit={handleSubmit}>

                    <label>Title</label>

                    <input
                        type="text"
                        value={title}
                        onChange={(e) =>
                            setTitle(e.target.value)
                        }
                        placeholder="Enter request title"
                        required
                    />

                    <label>Category</label>

                    <select
                        value={category}
                        onChange={(e) =>
                            setCategory(e.target.value)
                        }
                        required
                    >

                        <option value="">
                            Select category
                        </option>

                        <option value="IT Support">
                            IT Support
                        </option>

                        <option value="Technical Issue">
                            Technical Issue
                        </option>

                        <option value="Maintenance">
                            Maintenance
                        </option>

                        <option value="Account">
                            Account
                        </option>

                        <option value="Other">
                            Other
                        </option>

                    </select>

                    <label>Description</label>

                    <textarea
                        value={description}
                        onChange={(e) =>
                            setDescription(e.target.value)
                        }
                        placeholder="Enter request description"
                        required
                    />

                    <div className="buttons">

                        <button type="submit">
                            {editingId
                                ? "Update Request"
                                : "Create Request"}
                        </button>

                        {editingId && (
                            <button
                                type="button"
                                onClick={clearForm}
                            >
                                Cancel
                            </button>
                        )}

                    </div>

                </form>

            </div>

            <div className="requests-container">

                <h2>My Requests</h2>

                {requests.length === 0 ? (

                    <p>
                        You don't have any service requests yet.
                    </p>

                ) : (

                    requests.map((request) => (

                        <div
                            className="request-card"
                            key={request.id}
                        >

                            <h3>
                                #{request.id} {request.title}
                            </h3>

                            <p>
                                {request.description}
                            </p>

                            <p>
                                <strong>Category:</strong>{" "}
                                {request.category}
                            </p>

                            <p>
                                <strong>Created By:</strong>{" "}
                                {request.createdBy}
                            </p>

                            <p>
                                <strong>Date Created:</strong>{" "}
                                {new Date(
                                    request.dateCreated
                                ).toLocaleString()}
                            </p>

                            <div className="buttons">

                                <button
                                    onClick={() =>
                                        editRequest(request)
                                    }
                                >
                                    Edit
                                </button>

                                <button
                                    onClick={() =>
                                        deleteRequest(request.id)
                                    }
                                >
                                    Delete
                                </button>

                            </div>

                        </div>

                    ))
                )}

            </div>

        </div>
    );
}

export default ServiceRequests;