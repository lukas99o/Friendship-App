export async function readEvent(eventId: number) {
  const response = await fetch(`https://friendship-c3cfdgejf5ateyc2.swedencentral-01.azurewebsites.net/api/event/${eventId}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${localStorage.getItem("jwtToken")}`
    }
  });

  if (!response.ok) {
    throw new Error("Failed to fetch event");
  }
  
  return await response.json();
}