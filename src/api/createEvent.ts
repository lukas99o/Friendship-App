export default async function CreateEvent(parameters: any) {
    const res = await fetch("https://localhost:7106/api/Event", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${localStorage.getItem("jwtToken")}`
        },
    });

    if (!res.ok) {
        throw new Error("Failed to create event");
    }
}