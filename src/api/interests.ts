export async function getInterests() {
    const res = await fetch("https://friendship-c3cfdgejf5ateyc2.swedencentral-01.azurewebsites.net/api/event/interests", {
        method: "Get",
        headers: {
            "Authorization": `Bearer ${localStorage.getItem("jwtToken")}`
        },
    });

    if (!res.ok) {
        throw new Error("Failed to fetch interests");
    }

    return await res.json();
}
