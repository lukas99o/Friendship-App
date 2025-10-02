import { API_BASE_URL } from "../../config";

export async function updateUserAbout(about: string) {
    localStorage.getItem("jwtToken");
    if (!localStorage.getItem("jwtToken")) return;

    const response = await fetch(`${API_BASE_URL}/api/user/update-about/${about}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${localStorage.getItem("jwtToken")}`
        },
        body: JSON.stringify({ about }),
    });
    if (!response.ok) {
        throw new Error("Failed to update about");
    }
}