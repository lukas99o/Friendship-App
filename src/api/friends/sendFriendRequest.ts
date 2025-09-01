export async function SendFriendRequest(username: string) {
    const token = localStorage.getItem("jwtToken");

    if (!token) {
        return null;
    }

    const res = await fetch(`https://friendship-c3cfdgejf5ateyc2.swedencentral-01.azurewebsites.net/api/friendship/send-friend-request/${username}`, {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
        },
    });
        
    return res.ok;
}