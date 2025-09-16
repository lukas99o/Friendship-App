import { API_BASE_URL } from "../../config";

export async function hostDeleteEvent(eventId: number) {
    const res = await fetch(`${API_BASE_URL}/api/event/host-delete/${eventId}`, {
        method: "DELETE",
        headers: {
            Authorization: `Bearer ${localStorage.getItem("jwtToken")}`
        }
    });
    if (!res.ok) throw new Error("Failed to remove event");
}