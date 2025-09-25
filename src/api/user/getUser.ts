import { API_BASE_URL } from "../../config";

export async function GetUser(): Promise<any | null> {
    const token = localStorage.getItem("jwtToken");
    if (!token) return null;
    try {
        const res = await fetch(`${API_BASE_URL}/api/user`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        if (!res.ok) {
            console.error("Fetch failed:", res.statusText);
            return null;
        }
        const data = await res.json();
        return data;
    }
    catch (error) {
        console.error("Network or server error:", error);
        return null;
    }
}