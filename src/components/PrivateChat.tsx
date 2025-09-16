import { useEffect, useRef, useState } from "react";
import * as signalR from "@microsoft/signalr";
import type { ConversationMessageDto } from "../types";
import { GetConversationMessages } from "../api/conversations/getConversationMessages";

interface Props {
  conversationId?: number;
  senderId: string;
}

export default function PrivateChat({ conversationId, senderId }: Props) {
  const [messages, setMessages] = useState<ConversationMessageDto[]>([]);
  const [messageText, setMessageText] = useState("");
  const connectionRef = useRef<signalR.HubConnection | null>(null);
  const bottomRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!conversationId) {
      setMessages([]);
      return;
    }

    GetConversationMessages(conversationId)
      .then(fetchedMessages => setMessages(fetchedMessages))
      .catch(err => {
        setMessages([]);
        console.error("Kunde inte hämta meddelanden:", err);
      });
  }, [conversationId]);

  useEffect(() => {
    if (!conversationId) return;

    const connection = new signalR.HubConnectionBuilder()
      .withUrl("https://localhost:7106/messageHub")
      .withAutomaticReconnect()
      .build();

    connection.start()
      .then(() => connection.invoke("JoinConversation", conversationId))
      .catch(err => console.error("SignalR connection failed: ", err));

    connection.on("ReceiveMessage", (message: ConversationMessageDto) => {
      setMessages(prev => [...prev, message]);
    });

    connectionRef.current = connection;

    return () => {
      if (connectionRef.current && conversationId) {
        connectionRef.current.invoke("LeaveConversation", conversationId)
          .catch(() => {})
          .finally(() => connectionRef.current?.stop());
      }
    };
  }, [conversationId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async () => {
    if (!messageText.trim() || !connectionRef.current || !conversationId) return;
    await connectionRef.current.invoke("SendMessage", conversationId, senderId, messageText);
    setMessageText("");
  };

  return (
    <div className="d-flex flex-column h-100">
      <div className="flex-grow-1 overflow-auto p-3 border rounded-3 mb-3 bg-white shadow-sm" style={{ background: "linear-gradient(145deg, #f8f9fa, #e9ecef)" }}>
        {messages.length ? messages.map(msg => (
          <div key={msg.messageId} className="mb-2">
            <strong className="text-orange">{msg.senderName}</strong>
            <small className="text-muted ms-2">{new Date(msg.createdAt).toLocaleString()}</small>
            <p className="mb-0">{msg.content}</p>
          </div>
        )) : (
          <div className="text-center text-muted h-100 d-flex align-items-center justify-content-center flex-column">
            <i className="bi bi-chat-dots-fill fs-1 opacity-50 mb-3"></i>
            <p className="mb-0">Inga meddelanden än...</p>
            <small>Var första att skriva!</small>
          </div>
        )}
        <div ref={bottomRef}></div>
      </div>

      <div className="input-group shadow-sm">
        <span className="input-group-text bg-warning border-warning">
          <i className="bi bi-chat-fill text-white"></i>
        </span>
        <input
          type="text"
          className="form-control border-warning"
          placeholder="Skriv ett meddelande..."
          style={{ borderLeft: "none" }}
          value={messageText}
          onChange={e => setMessageText(e.target.value)}
          onKeyDown={e => e.key === "Enter" && sendMessage()}
        />
        <button className="btn-orange px-2 px-lg-4 py-1 py-lg-2 px-4 fw-bold" onClick={sendMessage}>
          <i className="bi bi-send-fill me-1"></i> Skicka
        </button>
      </div>
    </div>
  );
}
