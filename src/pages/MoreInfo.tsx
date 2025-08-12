import { useParams } from "react-router-dom";
import { readEvent } from "../api/readEvent";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { eventSendMessage } from "../api/eventSendMessage";
import type { EventDto, EventMessageDto } from "../types.ts";
import * as signalR from "@microsoft/signalr";

export default function MoreInfo() {
  const { eventId } = useParams();
  const [event, setEvent] = useState<EventDto | null>(null);
  const [loading, setLoading] = useState(true);
  const [messages, setMessages] = useState<EventMessageDto[]>([]);
  const [messageText, setMessageText] = useState("");
  const navigate = useNavigate();

  const connectionRef = useRef<signalR.HubConnection | null>(null);

  useEffect(() => {
    if (eventId) {
      readEvent(Number(eventId))
        .then(event => {
          setEvent(event);
          setLoading(false);
        })
        .catch(error => {
          console.error("Failed to fetch event:", error);
          setLoading(false);
        });
    }
  }, [eventId]);

  useEffect(() => {
    if (!eventId) return;

    const connection = new signalR.HubConnectionBuilder()
      .withUrl(`https://din-api-url/messageHub?eventId=${eventId}`)
      .withAutomaticReconnect()
      .build();

    connection.start().then(() => {
      console.log("SignalR connected");

      connection.on("ReceiveMessage", (message) => {
        setMessages(prev => [...prev, message]);
      });
    })
    .catch(err => console.error("SignalR connection error:", err));

    connectionRef.current = connection;

    return () => {
      connection.stop();
    };
  }, [eventId]);

  const sendMessage = async () => {
    if (connectionRef.current && messageText.trim()) {
      try {
        await connectionRef.current.invoke("SendMessage", Number(eventId), "MittNamn", messageText);
        setMessageText("");
      } catch (error) {
        console.error("Failed to send message:", error);
      }
    }
  };

  if (loading) return <div className="text-center shadow rounded pt-4 pb-1 mx-auto" style={{ backgroundColor: "rgba(255, 255, 255, 0.93)", maxWidth: "300px" }}><p>Laddar...</p></div>;
  if (!event) return <div className="text-center shadow rounded pt-4 pb-1 mx-auto" style={{ backgroundColor: "rgba(255, 255, 255, 0.93)", maxWidth: "300px" }}><p>Eventet hittades inte.</p></div>;

  return (
    <div className="container" style={{ maxWidth: "1200px" }}>
        
        <button onClick={() => navigate(-1)} className="btn btn-warning text-decoration-none mb-3">
          ← Tillbaka
        </button>

        <div className="card shadow-lg border-0" style={{ borderRadius: "20px" }}>
            {event.img && (
            <img
                src={event.img}
                alt={event.title}
                className="card-img-top"
                style={{ maxHeight: "400px", objectFit: "cover", borderTopLeftRadius: "20px", borderTopRightRadius: "20px" }}
            />
            )}

        <div className="card-body p-4">
          <h2 className="card-title mb-3">{event.title}</h2>

          <p className="text-muted">
            <strong>🕒 Datum & tid: </strong>
            {new Date(event.startTime).toLocaleString()} – {new Date(event.endTime).toLocaleString()}
          </p>

          {event.location && (
            <p className="text-muted">
              <strong>📍 Plats:</strong> {event.location}
            </p>
          )}

          {(event.ageRangeMin || event.ageRangeMax) && (
            <p className="text-muted">
              <strong>🎂 Åldersintervall:</strong> {event.ageRangeMin}–{event.ageRangeMax} år
            </p>
          )}

          {event.interests && event.interests.length > 0 && (
            <p className="text-muted">
              <strong>🎯 Intressen:</strong> {event.interests.join(", ")}
            </p>
          )}

          {event.eventParticipants && event.eventParticipants.length > 0 && (
            <div className="mb-3">
              <strong>👥 Deltagare ({event.eventParticipants.length}):</strong>
              <ul className="list-unstyled mt-1 mb-0">
                {event.eventParticipants.map((p, i) => (
                  <li key={i}>• {p.userName} ({p.role})</li>
                ))}
              </ul>
            </div>
          )}

          {event.description && (
            <div className="mt-4">
              <h5>📘 Beskrivning</h5>
              <p>{event.description}</p>
            </div>
          )}

          <div className="mt-5">
            <h5 className="mb-3">💬 Meddelanden</h5>
            
            <div 
              className="border rounded-3 p-3 mb-3 bg-white shadow-sm position-relative" 
              style={{ 
                height: "300px", 
                overflowY: "auto",
                background: "linear-gradient(145deg, #f8f9fa, #e9ecef)"
              }}
            >
              <div className="text-center text-muted h-100 d-flex align-items-center justify-content-center">
                <div>
                  {messages.length > 0 ? (
                    messages.map((msg, index) => (
                      <div key={index} className="mb-2">
                        <strong>{msg.senderId}</strong> <small className="text-muted">{new Date(msg.createdAt).toLocaleString()}</small>
                        <p className="mb-0">{msg.content}</p>
                      </div>
                    ))
                  ) : (
                    <div className="text-center">
                      <i className="bi bi-chat-dots-fill fs-1 opacity-50 mb-3"></i>
                      <p className="mb-0">Inga meddelanden än...</p>
                      <small>Var första att starta konversationen!</small>
                    </div>
                  )}
                </div>
              </div>
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
              />
              <button className="btn btn-warning px-4 fw-bold" onClick={sendMessage}>
                <i className="bi bi-send-fill me-1"></i>
                Skicka
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
