import { useEffect, useState } from "react";
import type { EventDto } from "../types.ts";
import { getMyCreatedEvents, getMyJoinedEvents,  } from "../api/events"; // Jag antar du har en för inbjudna events
import { formatDate } from "../utils/date";
import { left } from "@popperjs/core/index";

export default function MyEvents() {
    const [createdEvents, setCreatedEvents] = useState<EventDto[]>([]);
    const [joinedEvents, setJoinedEvents] = useState<EventDto[]>([]);
    const [invitedEvents, setInvitedEvents] = useState<EventDto[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeView, setActiveView] = useState<"created" | "joined" | "invited" | "saved">("joined");

    useEffect(() => {
        async function fetchEvents() {
            try {
                const [joined, created, ] = await Promise.all([
                    getMyJoinedEvents(),
                    getMyCreatedEvents(),
                    // getMyInvitedEvents()
                ]);
                setJoinedEvents(joined);
                setCreatedEvents(created);
                // setInvitedEvents(invited);
            } catch (error) {
                console.error("Fel vid hämtning av evenemang", error);
            } finally {
                setLoading(false);
            }
        }

        fetchEvents();
    }, []);

    if (loading) {
        return <div className="text-center mt-4">Laddar dina evenemang...</div>
    }

    // Dummy funktioner för knapparna - ersätt med riktig logik!
    const leaveEvent = (eventId: number) => {
        alert(`Lämnar evenemang med ID: ${eventId}`);
    };

    const askQuestion = (eventId: number) => {
        alert(`Skriver fråga till skaparen av event ID: ${eventId}`);
    };

    const renderEvents = (events: EventDto[]) => (
        events.map((event) => (
            <div key={event.eventId} className="card mb-2 p-2 gap-2" style={{ maxWidth: "600px", maxHeight: "220px", flexDirection: "row" }}>
                <img
                    src={event.img}
                    alt={event.title}
                    style={{
                        width: "150px",
                        height: "150px",
                        objectFit: "cover",
                        borderTopLeftRadius: ".25rem",
                        borderBottomLeftRadius: ".25rem",
                        alignSelf: "center",
                        flex: "1"
                    }}
                />

                <div style={{ flex: "1"}}>
                    <h5 className="card-title">{event.title}</h5>
                    <p className="text-muted mb-2" style={{ fontSize: "0.9rem" }}>
                        {formatDate(event.startTime)} - {formatDate(event.endTime)}
                    </p>
                </div>
                
                <div className="mt-auto d-flex gap-2" style={{ flex: "1" }}>
                    <button
                        type="button"
                        className="btn btn-primary btn-sm flex-grow-1"
                        onClick={() => askQuestion(event.eventId)}
                    >
                        💬
                    </button>
                    <button
                        type="button"
                        className="btn btn-outline-danger btn-sm flex-grow-1"
                        onClick={() => leaveEvent(event.eventId)}
                    >
                        <p style={{ margin: "0", color: "transparent", background: "#999", padding: "0", backgroundClip: "text", WebkitBackgroundClip: "text" }}>❌</p>
                    </button>
                </div>
            </div>
        ))
    );

    return (
        <div className="container bg-light">
            <div className="d-flex justify-content-around p-4 gap-4" style={{ borderRadius: "1rem", background: "#dddddd" }}>
                <button className={`btn-grass ${activeView === "joined" ? 'btn-grass-active' : ''}`} onClick={() => setActiveView("joined")}>Deltar</button>
                <button className={`btn-grass ${activeView === "created" ? 'btn-grass-active' : ''}`} onClick={() => setActiveView("created")}>Skapat</button>
                <button className={`btn-grass ${activeView === "invited" ? 'btn-grass-active' : ''}`} onClick={() => setActiveView("invited")}>Inbjudan</button>
                <button className={`btn-grass ${activeView === "saved" ? 'btn-grass-active' : ''}`} onClick={() => setActiveView("saved")}>Sparat</button>
            </div>

            <div className="d-flex flex-row flex-wrap justify-content-between mt-4 bg-dark" style={{ width: "66.67%", alignSelf: "center" }}>
                {activeView === "joined" && renderEvents(joinedEvents)}
                {activeView === "created" && renderEvents(createdEvents)}
                {activeView === "invited" && renderEvents(invitedEvents)}
                {activeView === "saved" && (
                    <div className="alert alert-info w-100 text-center">
                        Inga sparade evenemang.
                    </div>
                )}
            </div>
        </div>
    );
}
