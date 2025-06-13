export default async function CreateEvent(parameters: any) {
    const res = await fetch("https://localhost:7106/api/Event", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${localStorage.getItem("jwtToken")}`
        },
        body: JSON.stringify({
            title: parameters.title,
            description: parameters.description,
            startTime: parameters.startTime,
            endTime: parameters.endTime,
            location: parameters.location,
            isPublic: parameters.isPublic,
            ageRangeMax: parameters.ageRangeMax,
            ageRangeMin: parameters.ageRangeMin,
        })
    });

    if (!res.ok) {
        throw new Error("Failed to create event");
    }
}