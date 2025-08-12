import React, { useEffect, useState } from "react";
import * as signalR from "@microsoft/signalr";
import type { MessageDto, UserDto } from "../types.ts";

const EventChat: React.FC<UserDto> = ({ eventId, username }) => {
  const [connection, setConnection] = useState<signalR.HubConnection | null>(null);
  const [messages, setMessages] = useState<MessageDto[]>([]);
  const [input, setInput] = useState("");

  useEffect(() => {
    const newConnection = new signalR.HubConnectionBuilder()
      .withUrl("https://localhost:7106/messagehub") 
      .withAutomaticReconnect()
      .build();

    newConnection.start()
      .then(() => {
        console.log("SignalR Connected.");
        newConnection.invoke("JoinEventGroup", eventId);
      })
      .catch(err => console.error("SignalR Connection Error: ", err));

    newConnection.on("ReceiveMessage", (user, message) => {
      setMessages(prev => [...prev, { user, text: message }]);
    });

    newConnection.on("SystemMessage", (message) => {
      setMessages(prev => [...prev, { user: "System", text: message }]);
    });

    setConnection(newConnection);

    return () => {
      if (newConnection.state === signalR.HubConnectionState.Connected) {
        newConnection.invoke("LeaveEventGroup", eventId);
        newConnection.stop();
      }
    };
  }, [eventId]);

  const sendMessage = async () => {
    if (connection && input.trim()) {
      await connection.invoke("SendMessageToEvent", eventId, username, input);
      setInput("");
    }
  };

  return (
    <div className="p-4 border rounded max-w-md">
      <div className="h-64 overflow-y-auto border mb-2 p-2 bg-gray-50">
        {messages.map((m, i) => (
          <div key={i} className={m.user === "System" ? "text-gray-500 text-sm" : ""}>
            <strong>{m.user}:</strong> {m.text}
          </div>
        ))}
      </div>
      <div className="flex gap-2">
        <input
          type="text"
          className="border p-1 flex-1"
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <button
          onClick={sendMessage}
          className="bg-blue-500 text-white px-3 py-1 rounded"
        >
          Skicka
        </button>
      </div>
    </div>
  );
};

export default EventChat;
