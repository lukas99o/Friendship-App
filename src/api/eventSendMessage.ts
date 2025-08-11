export async function eventSendMessage(id: number, text: string) {
    const token = localStorage.getItem("jwtToken");

    const response = await fetch(`/api/events/send-message`, {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ message: text, eventId: id })
    });

    if (!response.ok) {
        throw new Error("Failed to send event message");
    }

    return response.json();
}