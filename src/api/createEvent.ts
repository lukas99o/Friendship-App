export default async function CreateEvent(parameters: any) {
    const res = await fetch("https://friendship-c3cfdgejf5ateyc2.swedencentral-01.azurewebsites.net/api/event", {
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
            img: parameters.img
        })
    });

    if (!res.ok) {
        throw new Error("Failed to create event");
    }
}