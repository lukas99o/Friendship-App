export async function AcceptFriendRequest(username: string): Promise<boolean> {
    const token = localStorage.getItem("jwtToken");

    if (!token) {
        return false;
    }

    const res = await fetch(`https://localhost:7106/api/friendship/accept-friend-request/${username}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
    });

    return res.ok;
}

