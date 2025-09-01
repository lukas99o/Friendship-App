export async function SendFriendRequest(username: string) {
    const token = localStorage.getItem("jwtToken");

    if (!token) {
        return null;
    }

    const res = await fetch(`https://ashy-stone-09b187203.2.azurestaticapps.net/api/friendship/send-friend-request/${username}`, {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
        },
    });
        
    return res.ok;
}