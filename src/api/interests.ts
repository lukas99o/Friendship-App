import { API_BASE_URL } from "../config";

export async function getInterests() {
    const res = await fetch(`${API_BASE_URL}/api/event/interests`, {
        method: "Get",
        headers: {
            "Authorization": `Bearer ${localStorage.getItem("jwtToken")}`
        },
    });

    if (!res.ok) {
        throw new Error("Failed to fetch interests");
    }

    return await res.json();
}
