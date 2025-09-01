export async function GetFriends() {
    const token = localStorage.getItem("jwtToken");

    if (!token) {
        return null;
    }

    const res = await fetch("https://ashy-stone-09b187203.2.azurestaticapps.net/api/friendship/friends", {
        method: "GET",
        headers: {
            "Authorization": `Bearer ${token}`
        },
    });

    if (!res.ok) {
        throw new Error("Failed to fetch friends");
    }

    return await res.json();
}