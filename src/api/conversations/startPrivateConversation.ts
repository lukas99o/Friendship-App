import type { ConversationDto } from "../../types";
import { API_BASE_URL } from "../../config";

export const StartPrivateConversation = async (username: string): Promise<ConversationDto | null> => {
  try {
    const res = await fetch(`${API_BASE_URL}/api/conversation/start-private-conversation/${username}`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${localStorage.getItem("jwtToken")}`,
        "Content-Type": "application/json",
      },
    });
    if (!res.ok) return null;
    const data: ConversationDto = await res.json();
    return data;
  } catch (err) {
    console.error(err);
    return null;
  }
};
