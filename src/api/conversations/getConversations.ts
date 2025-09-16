import { API_BASE_URL } from "../../config";

export async function GetConversations() {
    const token = localStorage.getItem("jwtToken");

    if (!token) {
        return null;
    }
    
    const res = await fetch(`${API_BASE_URL}/api/conversation`, {
        method: "GET",
        headers: {
            "Authorization": `Bearer ${token}`
        },
    });

    if (!res.ok) {
        throw new Error("Failed to fetch conversations");
    }

    return await res.json();
}