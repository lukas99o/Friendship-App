// export async function getEventMessages(eventId: number) {
//     const token = localStorage.getItem("jwtToken");

//     const response = await fetch(`/api/events/${eventId}/messages`, {
//         headers: {
//             "Authorization": `Bearer ${token}`
//         },
//     });

//     if (!response.ok) {
//         throw new Error("Failed to fetch event messages");
//     }

//     return response.json();
// }