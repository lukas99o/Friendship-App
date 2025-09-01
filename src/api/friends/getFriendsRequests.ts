export async function GetFriendRequests() {
    const token = localStorage.getItem("jwtToken");

    if (!token) {
        return null;
    }

    const res = await fetch("https://friendship-c3cfdgejf5ateyc2.swedencentral-01.azurewebsites.net/api/friendship/friend-requests", {
        method: "GET",
        headers: {
            "Authorization": `Bearer ${token}`
        },
    });

    if (!res.ok) {
        throw new Error("Failed to fetch friend requests");
    }

    return await res.json();
}