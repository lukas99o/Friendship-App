export async function getEvents(filters: any) {
    const res = await fetch("https://friendship-c3cfdgejf5ateyc2.swedencentral-01.azurewebsites.net/api/event/publicevents", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${localStorage.getItem("jwtToken")}`
        },
        body: JSON.stringify(filters)
    });

    if (!res.ok) {
        throw new Error("Failed to fetch events");
    }

    return await res.json();
}
