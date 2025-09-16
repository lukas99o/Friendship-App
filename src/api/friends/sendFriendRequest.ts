import { API_BASE_URL } from "../../config";

export async function SendFriendRequest(username: string) {
    const token = localStorage.getItem("jwtToken");

    if (!token) {
        return null;
    }

    const res = await fetch(`${API_BASE_URL}/api/friendship/send-friend-request/${username}`, {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
        },
    });
        
    return res.ok;
}