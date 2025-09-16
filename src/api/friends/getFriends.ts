import { API_BASE_URL } from "../../config";

export async function GetFriends() {
    const token = localStorage.getItem("jwtToken");

    if (!token) {
        return null;
    }

    const res = await fetch(`${API_BASE_URL}/api/friendship/friends`, {
        method: "GET",
        headers: {
            "Authorization": `Bearer ${token}`
        },
    });

    if (!res.ok) {
        throw new Error("Failed to fetch friends");
    }

    return await res.json();
}