import { API_BASE_URL } from "../../config";

export async function GetFriendRequests() {
    const token = localStorage.getItem("jwtToken");

    if (!token) {
        return null;
    }

    const res = await fetch(`${API_BASE_URL}/api/friendship/friend-requests`, {
        method: "GET",
        headers: {
            "Authorization": `Bearer ${token}`
        },
    });

    if (!res.ok) {
        throw new Error("Failed to fetch friend requests");
    }

    return await res.json();
}