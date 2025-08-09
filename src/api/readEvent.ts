export async function readEvent(eventId: number) {
  const response = await fetch(`https://localhost:7106/api/event/${eventId}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${localStorage.getItem("jwtToken")}`
    }
  });

  if (!response.ok) {
    throw new Error("Failed to fetch event");
  }
  //hej
  return await response.json();
}