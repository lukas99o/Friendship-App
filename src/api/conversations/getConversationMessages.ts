import type { ConversationMessageDto } from "../../types";
import { API_BASE_URL } from "../../config";

export async function GetConversationMessages(id: number): Promise<ConversationMessageDto[]> {
    const response = await fetch(`${API_BASE_URL}/api/conversation/get-conversation-messages/${id}`, {
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
