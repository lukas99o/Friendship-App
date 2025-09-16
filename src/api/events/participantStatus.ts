import { API_BASE_URL } from "../../config";

export async function GetEventParticipantStatus() {
    const token = localStorage.getItem("jwtToken");

    if (!token) {
        return null;
    }

    const res = await fetch(`${API_BASE_URL}/api/event/participant-status`, {
        method: "GET",
        headers: {
            "Authorization": `Bearer ${token}`
        }
    });

    if (!res.ok) {
        throw new Error("Failed to fetch participant status");
    }

    return await res.json();
}