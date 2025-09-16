export async function GetConversations() {
    const token = localStorage.getItem("jwtToken");

    if (!token) {
        return null;
    }

    const res = await fetch("https://localhost:7106/api/conversation", {
        method: "GET",
        headers: {
            "Authorization": `Bearer ${token}`
        },
    });

    if (!res.ok) {
        throw new Error("Failed to fetch conversations");
    }

    return await res.json();
}