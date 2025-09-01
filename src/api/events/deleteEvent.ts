export async function hostDeleteEvent(eventId: number) {
    const res = await fetch(`https://ashy-stone-09b187203.2.azurestaticapps.net/api/event/host-delete/${eventId}`, {
        method: "DELETE",
        headers: {
            Authorization: `Bearer ${localStorage.getItem("jwtToken")}`
        }
    });
    if (!res.ok) throw new Error("Failed to remove event");
}