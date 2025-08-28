export async function SendFriendRequest(username: string) {
    const token = localStorage.getItem("jwtToken");

    if (!token) {
        return null;
    }

    const res = await fetch(`https://localhost:7106/api/friendship/send-friend-request/${username}`, {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
        },
    });

    if (!res.ok) {
        throw new Error("Failed to send friend request");
    }

    return await res.json();
}