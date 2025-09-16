import type { ConversationMessageDto } from "../../types";

export async function GetConversationMessages(id: number): Promise<ConversationMessageDto[]> {
    const response = await fetch(`https://localhost:7106/api/conversation/get-conversation-messages/${id}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${localStorage.getItem("jwtToken")}`
        }
    });
    if (!response.ok) {
        throw new Error("Failed to fetch conversation messages");
    }
    return response.json();
}
