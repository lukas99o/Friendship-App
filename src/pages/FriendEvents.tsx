import { GetFriendEvents } from "../api/friendEvents";
import { useEffect, useState } from "react";
import { GetEventParticipantStatus } from "../api/participantStatus";
import { JoinEvent } from "../api/joinEvent";
import { LeaveEvent } from "../api/leaveEvent";
import EventCard from "../components/EventCard";
import type { EventDto } from "../types.ts";

export default function FriendEvents() {
    const [friendEvents, setFriendEvents] = useState<EventDto[]>([]);
    const [loading, setLoading] = useState(true);
    const [joinedEvents, setJoinedEvents] = useState<number[]>([]);

    const fetchFriendEvents = async () => {
        GetFriendEvents().then((res) => {
            setFriendEvents(res);
            setLoading(false);
        })
    }

    useEffect(() => {
        fetchFriendEvents();

        GetEventParticipantStatus().then((res) => {
            setJoinedEvents(res);
        })
    }, []);

    const formatDate = (dateStr: string) => {
        const options: Intl.DateTimeFormatOptions = {
            year: "numeric",
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit"
        }

        const date = new Date(dateStr);
        return date.toLocaleDateString(undefined, options);
    }

    const toggleJoinStatus = async (eventId: number) => {
        try {
            if (joinedEvents.includes(eventId)) {
                // Leave event
                await LeaveEvent(eventId);
                setJoinedEvents(joinedEvents.filter(id => id !== eventId));
            } else {
                // Join event
                await JoinEvent(eventId);
                setJoinedEvents([...joinedEvents, eventId]);
            }
        } catch (error) {
            console.error("Error toggling join status:", error);
            alert("Ett fel uppstod när du försökte ändra din status för evenemanget.");
        }
    }

    return (
        <div className="min-vw-100 min-vh-100 d-flex align-items-center flex-column pt-5 mt-5">
            <div className="container my-4 d-flex flex-column">
                <h1 className="text-center mb-4">Vän Träffar</h1>

                {loading && <p>Laddar...</p>}
                {!loading && friendEvents.length === 0 && <p>Inga evenemang hittades.</p>}
            </div>

            <div className="container d-flex flex-column align-items-center">
                {friendEvents.map((e) => (
                    <EventCard
                        key={e.eventId}
                        event={e}
                        isJoined={joinedEvents.includes(e.eventId)}
                        onToggleJoin={toggleJoinStatus}
                        formatDate={formatDate}
                    />
                ))}
            </div>
        </div>
    )
}