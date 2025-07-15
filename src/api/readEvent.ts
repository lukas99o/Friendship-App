export async function readEvent(eventId: number) {
  const response = await fetch(`https://ashy-stone-09b187203.2.azurestaticapps.net/api/event/${eventId}`, {
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