import { useParams } from "react-router-dom";
import { readEvent } from "../api/events/readEvent.ts";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import type { EventDto, FriendDto } from "../types.ts";
import EventChat from "../components/EventChat.tsx";
import { SendFriendRequest } from "../api/friends/sendFriendRequest.ts";
import { GetFriendRequests } from "../api/friends/getFriendsRequests.ts";
import type { FriendRequestDto } from "../types.ts";
import { RegretFriendRequest } from "../api/friends/regretFriendRequest.ts";
import { GetFriends } from "../api/friends/getFriends.ts";

export default function MoreInfo() {
  const { eventId } = useParams();
  const [event, setEvent] = useState<EventDto | null>(null);
  const [loading, setLoading] = useState(true);
  // const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const userId = localStorage.getItem("userId") || "";
  const username = localStorage.getItem("username") || "";
  const [friendRequests, setFriendRequests] = useState<FriendRequestDto>({
    incomingUsernames: [],
    outgoingUsernames: [],
  });
  const [friends, setFriends] = useState<FriendDto[]>([]);

  useEffect(() => {
    if (eventId) {
      readEvent(Number(eventId))
        .then(event => {
          setEvent(event);
        })
        .catch(error => {
          console.error("Failed to fetch event:", error);
          setLoading(false);
          // setError("Misslyckades med att hämta eventet.");
        });

      GetFriendRequests()
        .then(requests => {
          setFriendRequests(requests);
        })
        .catch(error => {
          console.error("Failed to fetch friend requests:", error);
          setLoading(false);
          // setError("Misslyckades med att hämta vänförfrågningar.");
        });

      GetFriends()
        .then(friendsList => {
          setFriends(friendsList);
          console.log("Friends list:", friendsList);
        })
        .catch(error => {
          console.error("Failed to fetch friends:", error);
          setLoading(false);
          // setError("Misslyckades med att hämta vänner.");
        });

      setLoading(false);
    }
  }, [eventId]);

  const sendFriendRequest = (targetUsername: string) => {
    if (
      friendRequests.outgoingUsernames.includes(targetUsername) ||
      friendRequests.incomingUsernames.includes(targetUsername)
    ) {
      alert("Du eller mottagaren har redan skickat en vänförfrågan.");
      return;
    }

    SendFriendRequest(targetUsername)
      .then(() => {
        setFriendRequests(prev => ({
          ...prev,
          outgoingUsernames: [...prev.outgoingUsernames, targetUsername],
        }));
      })
      .catch(error => {
        console.error("Failed to send friend request:", error);
      });
  };

  const regretFriendRequest = async (targetUsername: string) => {
    const success = await RegretFriendRequest(targetUsername);

    if (success) {
      setFriendRequests(prev => ({
        ...prev,
        outgoingUsernames: prev.outgoingUsernames.filter(u => u !== targetUsername),
      }));
    } else alert("Misslyckades med att avbryta vänförfrågan.");
  };

  if (loading)
    return (
      <div
        className="text-center shadow rounded pt-4 pb-1 mx-auto"
        style={{ backgroundColor: "rgba(255, 255, 255, 0.93)", maxWidth: "300px" }}
      >
        <p>Laddar...</p>
      </div>
    );
  if (!event)
    return (
      <div
        className="text-center shadow rounded pt-4 pb-1 mx-auto"
        style={{ backgroundColor: "rgba(255, 255, 255, 0.93)", maxWidth: "300px" }}
      >
        <p>Eventet hittades inte.</p>
      </div>
    );

  return (
    <div className="container" style={{ maxWidth: "1200px" }}>
      <button onClick={() => navigate(-1)} className="btn-orange mb-3">
        ← Tillbaka
      </button>

      <div className="card shadow-lg border-0" style={{ borderRadius: "20px" }}>
        {event.img && (
          <img
            src={event.img}
            alt={event.title}
            className="card-img-top"
            style={{
              maxHeight: "400px",
              objectFit: "cover",
              borderTopLeftRadius: "20px",
              borderTopRightRadius: "20px",
            }}
          />
        )}

        <div className="card-body p-4">
          <h2 className="card-title mb-3">{event.title}</h2>

          <p className="text-muted">
            <strong>🕒 Datum & tid: </strong>
            {new Date(event.startTime).toLocaleString()} –{" "}
            {new Date(event.endTime).toLocaleString()}
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
                  <li className="mt-1" key={i}>
                    • {p.userName} ({p.role})
                    {friends.find(f => f.username === p.userName) ? (
                      <span className="mx-1 badge bg-success p-2" style={{ fontSize: "14px" }}>Vän</span>
                    ) : p.userName === username ? null : friendRequests.outgoingUsernames?.includes(p.userName) ? (
                      <button
                        className="mx-1 btn btn-warning btn-sm"
                        onClick={() => regretFriendRequest(p.userName)}
                      >
                        Avbryt förfrågan
                      </button>
                    ) : friendRequests.incomingUsernames?.includes(p.userName) ? (
                      <span className="mx-1 badge bg-info p-2" style={{ fontSize: "14px" }}>Vänförfrågan mottagen</span>
                    ) : (
                      <button
                        className="mx-1 btn btn-secondary btn-sm"
                        onClick={() => sendFriendRequest(p.userName)}
                      >
                        Lägg till vän
                      </button>
                    )}
                  </li>
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
                senderId={userId}
                messageList={event.eventMessages}
              />
            )}
          </div>
        </div>
      </div>
      <div className="pt-5"></div>
    </div>
  );
}
