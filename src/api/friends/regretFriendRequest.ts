export async function RegretFriendRequest(username: string): Promise<boolean> {
    const token = localStorage.getItem("jwtToken");

    if (!token) {
        return false;
    }

    const res = await fetch(`https://ashy-stone-09b187203.2.azurestaticapps.net/api/friendship/regret-friend-request/${username}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
    });

    return res.ok;
}

