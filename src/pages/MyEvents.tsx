import { useEffect, useState } from "react";
import type { EventDto } from "../types.ts";
import { getMyCreatedEvents, getMyJoinedEvents,  } from "../api/events/events.ts";
import { formatDate } from "../utils/date";
import { LeaveEvent } from "../api/events/leaveEvent.ts";
import { hostDeleteEvent } from "../api/events/deleteEvent.ts";
import { Link } from "react-router-dom";

export default function MyEvents() {
    const [createdEvents, setCreatedEvents] = useState<EventDto[]>([]);
    const [joinedEvents, setJoinedEvents] = useState<EventDto[]>([]);
    // const [invitedEvents, setInvitedEvents] = useState<EventDto[]>([]);
    // const [loading, setLoading] = useState(true);
    const [activeView, setActiveView] = useState<"created" | "joined" | "invited" | "saved">("joined");

    useEffect(() => {
        async function fetchEvents() {
            try {
                const [joined, created, ] = await Promise.all([
                    getMyJoinedEvents(),
                    getMyCreatedEvents(),
                ]);
                setJoinedEvents(joined);
                setCreatedEvents(created);
            } catch (error) {
                console.error("Fel vid hämtning av evenemang", error);
            } 
        }

        fetchEvents();
    }, []);

 

    const handleLeaveEvent = (eventId: number) => {
        if (createdEvents.some(event => event.eventId === eventId)) {
            hostDeleteEvent(eventId)
                .then(() => {
                    setJoinedEvents(joinedEvents.filter(event => event.eventId !== eventId));
                    setCreatedEvents(createdEvents.filter(event => event.eventId !== eventId));
                });
        }
        else {
            LeaveEvent(eventId)
                .then(() => {
                    setJoinedEvents(joinedEvents.filter(event => event.eventId !== eventId));
                })
            .catch(error => {
                console.error("Fel vid lämning av evenemang", error);
                alert("Ett fel uppstod när du försökte lämna evenemanget.");
            });
        }
    };

    // const askQuestion = (eventId: number) => {
    //     // Gör ingenting just nu
    // };

    const renderEvents = (events: EventDto[]) => (
        events.map((event) => (
            <div key={event.eventId} className="card mb-2 p-2 gap-2" style={{ maxWidth: "600px", maxHeight: "220px", flexDirection: "row", opacity: "0.95" }}>
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

                <div className="mt-auto d-flex gap-2 justify-content-end" style={{ flex: "1" }}>
                    <Link to={`/more-info/${event.eventId}`} className="btn btn-warning btn-sm">
                        🔍
                    </Link>
                    <button
                        type="button"
                        className="btn btn-primary btn-sm"
                        // onClick={() => askQuestion(event.eventId)}
                    >
                        💬
                    </button>
                    <button
                        type="button"
                        className="btn btn-outline-danger btn-sm"
                        onClick={() => handleLeaveEvent(event.eventId)}
                    >
                        <p style={{ margin: "0", color: "transparent", background: "#999", padding: "0", backgroundClip: "text", WebkitBackgroundClip: "text" }}>❌</p>
                    </button>
                </div>
            </div>
        ))
    );

    return (
        <div className="container">
            <div>
                <Link to={"/create-event"} className="btn btn-orange w-100 mb-3 create-btn">
                    Skapa Evenemang
                </Link>
            </div>
            <div className="d-flex justify-content-around p-4 gap-4 bg-light shadow-sm flex-wrap rounded">
                <button className={`btn-orange ${activeView === "joined" ? 'btn-orange-active' : ''}`} onClick={() => setActiveView("joined")}>Deltar</button>
                <button className={`btn-orange ${activeView === "created" ? 'btn-orange-active' : ''}`} onClick={() => setActiveView("created")}>Skapat</button>
                <button className={`btn-orange ${activeView === "invited" ? 'btn-orange-active' : ''}`} onClick={() => setActiveView("invited")}>Inbjudan</button>
                <button className={`btn-orange ${activeView === "saved" ? 'btn-orange-active' : ''}`} onClick={() => setActiveView("saved")}>Sparat</button>
            </div>

            <div className="d-flex flex-row flex-wrap justify-content-around mt-4">
                {activeView === "joined" && (
                    joinedEvents.length > 0 ? renderEvents(joinedEvents) : (
                        <div className="alert alert-info w-100 text-center">
                            Du deltar inte i några evenemang än.
                        </div>
                    )
                )}
                {activeView === "created" && (
                    createdEvents.length > 0 ? renderEvents(createdEvents) : (
                        <div className="alert alert-info w-100 text-center">
                            Du har inte skapat några evenemang än.
                        </div>
                    )
                )}
                {activeView === "invited" && (
                    // invitedEvents.length > 0 ? renderEvents(invitedEvents) : (
                        <div className="alert alert-info w-100 text-center">
                            Du har inga väntande inbjudningar.
                        </div>
                    )
                }
                {activeView === "saved" && (
                    <div className="alert alert-info w-100 text-center">
                        Inga sparade evenemang.
                    </div>
                )}
            </div>
        </div>
    );
}
