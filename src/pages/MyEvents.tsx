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
            <div
                key={event.eventId}
                className="card p-0 d-flex flex-column flex-md-row w-100"
                style={{ maxWidth: "600px" }}
            >
                <img
                    src={event.img}
                    alt={event.title}
                    className="d-block d-md-none w-100"
                    style={{
                        height: "180px",
                        objectFit: "cover",
                        borderTopLeftRadius: ".25rem",
                        borderTopRightRadius: ".25rem"
                    }}
                />

                <img
                    src={event.img}
                    alt={event.title}
                    className="d-none d-md-block"
                    style={{
                        width: "150px",
                        height: "150px",
                        objectFit: "cover",
                        borderTopLeftRadius: ".25rem",
                        borderBottomLeftRadius: ".25rem",
                        alignSelf: "center",
                        flexShrink: 0
                    }}
                />

                <div className="d-flex flex-column flex-grow-1 p-2 p-md-3">
                    <div>
                        <h5 className="card-title mb-1">{event.title}</h5>
                        <p className="text-muted mb-0" style={{ fontSize: "0.9rem" }}>
                            {formatDate(event.startTime)} - {formatDate(event.endTime)}
                        </p>
                    </div>

                    <div className="mt-2 mt-md-auto d-flex flex-column flex-md-row gap-2 justify-content-stretch justify-content-md-end">
                        <Link
                            to={`/more-info/${event.eventId}`}
                            className="btn btn-outline-info w-100 w-md-auto"
                        >
                            Mer Info
                        </Link>
                        <button
                            type="button"
                            className="btn btn-outline-danger w-100 w-md-auto"
                            onClick={() => handleLeaveEvent(event.eventId)}
                        >
                            Lämna
                        </button>
                    </div>
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
            <div className="d-flex justify-content-around p-3 bg-light shadow-sm flex-wrap rounded gap-2">
                <button className={`btn-orange ${activeView === "joined" ? 'btn-orange-active' : ''}`} onClick={() => setActiveView("joined")} style={{ width: "100px"}}>Deltar</button>
                <button className={`btn-orange ${activeView === "created" ? 'btn-orange-active' : ''}`} onClick={() => setActiveView("created")} style={{ width: "100px"}}>Skapat</button>
                <button className={`btn-orange ${activeView === "invited" ? 'btn-orange-active' : ''}`} onClick={() => setActiveView("invited")} style={{ width: "100px"}}>Inbjudan</button>
                <button className={`btn-orange ${activeView === "saved" ? 'btn-orange-active' : ''}`} onClick={() => setActiveView("saved")} style={{ width: "100px"}}>Sparat</button>
            </div>

            <div className="d-flex flex-row flex-wrap mt-3 justify-content-between gap-3 pb-5">
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
