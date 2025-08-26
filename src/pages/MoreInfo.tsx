import { useParams } from "react-router-dom";
import { readEvent } from "../api/readEvent";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import type { EventDto } from "../types.ts";
import EventChat from "../components/EventChat.tsx";

export default function MoreInfo() {
  const { eventId } = useParams();
  const [event, setEvent] = useState<EventDto | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const username = localStorage.getItem("username") || "";

  console.log(event?.conversationId)

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
          {event && (
            <EventChat 
              conversationId={event.conversationId} 
              senderId={username}
            />
          )}
          </div>
        </div>
      </div>
    </div>
  );
}
