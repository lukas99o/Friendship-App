export async function GetFriends() {
    const token = localStorage.getItem("jwtToken");

    if (!token) {
        return null;
    }

    const res = await fetch("https://friendship-c3cfdgejf5ateyc2.swedencentral-01.azurewebsites.net/api/friendship/friends", {
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