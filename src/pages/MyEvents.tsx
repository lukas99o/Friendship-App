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

    const renderEvents = (events: EventDto[]) => (
        events.map((event) => (
            <div key={event.eventId} className="card p-2 gap-2" style={{ maxWidth: "600px", maxHeight: "220px", flexDirection: "row"}}>
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
                    <Link 
                        to={`/more-info/${event.eventId}`} 
                        className="btn btn-outline-info"
                        >
                        Mer Info
                    </Link>
                    <button
                        type="button"
                        className="btn btn-outline-danger"
                        onClick={() => handleLeaveEvent(event.eventId)}
                    >
                        Lämna
                    </button>
                </div>
            </div>
        ))
    );

    return (
        <div className="container">
            <div>
                <Link to={"/create-event"} className="btn btn-orange w-100 mb-2 create-btn">
                    Skapa Evenemang
                </Link>
            </div>
            <div className="d-flex justify-content-around p-3 bg-light shadow-sm flex-wrap rounded">
                <button className={`btn-orange ${activeView === "joined" ? 'btn-orange-active' : ''}`} onClick={() => setActiveView("joined")}>Deltar</button>
                <button className={`btn-orange ${activeView === "created" ? 'btn-orange-active' : ''}`} onClick={() => setActiveView("created")}>Skapat</button>
                <button className={`btn-orange ${activeView === "invited" ? 'btn-orange-active' : ''}`} onClick={() => setActiveView("invited")}>Inbjudan</button>
                <button className={`btn-orange ${activeView === "saved" ? 'btn-orange-active' : ''}`} onClick={() => setActiveView("saved")}>Sparat</button>
            </div>

            <div className="d-flex flex-row flex-wrap mt-3 justify-content-between gap-3">
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
