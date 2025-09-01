export async function getInterests() {
    const res = await fetch("https://ashy-stone-09b187203.2.azurestaticapps.net/api/event/interests", {
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
