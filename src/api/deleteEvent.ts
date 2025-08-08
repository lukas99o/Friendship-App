export async function hostDeleteEvent(eventId: number) {
    const res = await fetch(`https://friendship-c3cfdgejf5ateyc2.swedencentral-01.azurewebsites.net/api/event/host-delete/${eventId}`, {
        method: "DELETE",
        headers: {
            Authorization: `Bearer ${localStorage.getItem("jwtToken")}`
        }
    });
    if (!res.ok) throw new Error("Failed to remove event");
}