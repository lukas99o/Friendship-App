export async function hostDeleteEvent(eventId: number) {
    const res = await fetch(`https://localhost:7106/api/event/host-delete/${eventId}`, {
        method: "DELETE",
        headers: {
            Authorization: `Bearer ${localStorage.getItem("jwtToken")}`
        }
    });
    if (!res.ok) throw new Error("Failed to remove event");
}