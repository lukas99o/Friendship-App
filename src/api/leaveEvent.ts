export async function LeaveEvent(id: number) {
    const token = localStorage.getItem("jwtToken");

    if (!token) {
        return null;
    }

    const res = await fetch(`https://ashy-stone-09b187203.2.azurestaticapps.net/api/event/leave/${id}`, {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
        },
    })

    if (!res.ok) {
        throw new Error("Failed to leave event");
    }

    return 
}