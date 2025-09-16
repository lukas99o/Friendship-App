import { API_BASE_URL } from "../../config";
  
export async function readEvent(eventId: number) {
  const response = await fetch(`${API_BASE_URL}/api/event/${eventId}`, {
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