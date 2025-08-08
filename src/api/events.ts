import type { EventDto } from "../types";

export async function getEvents(filters: {
    ageMin: number | null;
    ageMax: number | null;
    interests: string[] | null;
}): Promise<EventDto[]> {
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

export async function getMyCreatedEvents(): Promise<EventDto[]> {
    const res = await fetch("https://friendship-c3cfdgejf5ateyc2.swedencentral-01.azurewebsites.net/api/event/my-created-events", {
        headers: {
            Authorization: `Bearer ${localStorage.getItem("jwtToken")}`
        }
    });
    if (!res.ok) throw new Error("Failed to fetch created events");
    return res.json();
}

export async function getMyJoinedEvents(): Promise<EventDto[]> {
    const res = await fetch("https://friendship-c3cfdgejf5ateyc2.swedencentral-01.azurewebsites.net/api/event/my-joined-events", {
        headers: {
            Authorization: `Bearer ${localStorage.getItem("jwtToken")}`
        }
    });
    if (!res.ok) throw new Error("Failed to fetch joined events");
    return res.json();
}

