import { API_BASE_URL } from "../../config";

export async function GetFriendEvents() {
    const token = localStorage.getItem("jwtToken");

    if (!token) {
        return null;
    }

    const res = await fetch(`${API_BASE_URL}/api/event/friendsevents`, {
        method: "GET",
        headers: {
            "Authorization": `Bearer ${token}`
        },
    });
    

    if (!res.ok) {
        throw new Error("Failed to fetch friend events");
    }

    return await res.json();
}