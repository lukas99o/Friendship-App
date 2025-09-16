import { useEffect, useState } from "react";
import type { EventDto } from "../types.ts";
import { getMyCreatedEvents, getMyJoinedEvents,  } from "../api/events/events.ts";
import { LeaveEvent } from "../api/events/leaveEvent.ts";
import { hostDeleteEvent } from "../api/events/deleteEvent.ts";
import { Link } from "react-router-dom";
import EventCard from "../components/EventCard.tsx";

export default function MyEvents() {
    const [createdEvents, setCreatedEvents] = useState<EventDto[]>([]);
    const [joinedEvents, setJoinedEvents] = useState<EventDto[]>([]);
    const [activeView, setActiveView] = useState<"created" | "joined" | "invited" | "saved">("joined");
    const [width, setWidth] = useState(document.body.clientWidth);

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

    useEffect(() => {
        const handleResize = () => {
            setWidth(document.body.clientWidth);
        }

        window.addEventListener('resize', handleResize);
        return () => {
            window.removeEventListener('resize', handleResize);
        }
    }, [])

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
            <EventCard 
            key={event.eventId} 
            event={event} 
            variant="myEvents" 
            onLeave={handleLeaveEvent} 
            />
        ))
    );

    return (
        <div className="container">
            <div className="text-center mb-2">
                <Link to="/my-events/create-event" className="btn btn-orange px-3 py-2 create-btn">
                    Skapa Evenemang
                </Link>
            </div>
            <ul className="nav nav-tabs justify-content-center shadow-sm rounded bg-light">
                <li className="nav-item">
                <button
                    className={`nav-link ${activeView === "joined" ? "active" : ""}`}
                    onClick={() => setActiveView("joined")}
                    style={{ color: "black" }}
                >
                    Deltar
                </button>
                </li>
                <li className="nav-item">
                <button
                    className={`nav-link ${activeView === "created" ? "active" : ""}`}
                    onClick={() => setActiveView("created")}
                    style={{ color: "black" }}
                >
                    Skapat
                </button>
                </li>
                <li className="nav-item">
                <button
                    className={`nav-link ${activeView === "invited" ? "active" : ""}`}
                    onClick={() => setActiveView("invited")}
                    style={{ color: "black" }}
                >
                    Inbjudan
                </button>
                </li>
                <li className="nav-item">
                <button
                    className={`nav-link ${activeView === "saved" ? "active" : ""}`}
                    onClick={() => setActiveView("saved")}
                    style={{ color: "black" }}
                >
                    Sparat
                </button>
                </li>
            </ul>

            <div className="mt-3 pb-5 d-flex justify-content-center">
                <div style={{ width: width > 1399 ? "95%" : "100%" }}>
                    {activeView === "joined" && (
                        joinedEvents.length > 0 ? (
                            width > 1399 ? (
                                <div className="d-flex flex-wrap justify-content-between gap-3">{renderEvents(joinedEvents)}</div>
                            ) : (
                                <div className="d-flex flex-wrap justify-content-center gap-3">{renderEvents(joinedEvents)}</div>
                            )
                        ) : (
                            <div className="alert alert-info w-100 text-center">
                                Du deltar inte i några evenemang än.
                            </div>
                        )
                    )}
                    {activeView === "created" && (
                        createdEvents.length > 0 ? (
                            width > 1399 ? (
                                <div className="d-flex flex-wrap justify-content-between gap-3">{renderEvents(createdEvents)}</div>
                            ) : (
                                <div className="d-flex flex-wrap justify-content-center gap-3">{renderEvents(createdEvents)}</div>
                            )
                        ) : (
                            <div className="alert alert-info w-100 text-center">
                                Du har inte skapat några evenemang än.
                            </div>
                        )
                    )}
                    {activeView === "invited" && (
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
        </div>
    );
}
