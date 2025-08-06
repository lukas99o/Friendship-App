import { useEffect, useState } from "react";
import type { EventDto } from "../types.ts";
import { getMyCreatedEvents } from "../api/events";
import { getMyJoinedEvents } from "../api/events";
import { formatDate } from "../utils/date";

export default function MyEvents() {
    const [createdEvents, setCreatedEvents] = useState<EventDto[]>([]);
    const [joinedEvents, setJoinedEvents] = useState<EventDto[]>([]);
    const [invitedEvents, setInvitedEvents] = useState<EventDto[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeView, setActiveView] = useState<"created" | "joined" | "invited" | "saved">("joined");

    useEffect(() => {
        async function fetchEvents() {
            try {
                const joined = await getMyJoinedEvents();
                setJoinedEvents(joined);
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

    return (
        <div className="container">
            <div className="d-flex justify-content-around p-4" style={{ borderRadius: "1rem", background: "#dddddd"}}>
                <button className={`btn-grass ${activeView === "joined" ? 'btn-grass-active' : ''}`} onClick={() => setActiveView("joined")}>Deltar</button>
                <button className={`btn-grass ${activeView === "created" ? 'btn-grass-active' : ''}`} onClick={() => setActiveView("created")}>Skapat</button>
                <button className={`btn-grass ${activeView === "invited" ? 'btn-grass-active' : ''}`} onClick={() => setActiveView("invited")}>Inbjudan</button>
                <button className={`btn-grass ${activeView === "saved" ? 'btn-grass-active' : ''}`} onClick={() => setActiveView("saved")}>Sparat</button>
            </div>

            <div className="d-flex flex-column mt-4 gap-4">
                {activeView === "joined" && joinedEvents.map((event) => (
                    <div key={event.eventId} className="card d-flex flex-row" style={{ width: "18rem" }}>
                        <div>
                            <img src={event.img} className="card-img-top" alt={event.title} />
                        </div>
                        
                        <div className="card-body">
                            <h5 className="card-title">{event.title}</h5>
                            <p className="card-text">{event.description}</p>
                            <p className="card-text"><small className="text-muted">Datum: {formatDate(event.startTime)} - {formatDate(event.endTime)}</small></p>
                        </div>
                    </div>
                ))}
                

                {activeView === "created" && createdEvents.map((event) => (
                    <div key={event.eventId} className="card" style={{ width: "18rem" }}>
                        <img src={event.img} className="card-img-top" alt={event.title} />
                        <div className="card-body">
                            <h5 className="card-title">{event.title}</h5>
                            <p className="card-text">{event.description}</p>
                            <p className="card-text"><small className="text-muted">Datum: {formatDate(event.startTime)} - {formatDate(event.endTime)}</small></p>
                        </div>
                    </div>
                ))}

                {activeView === "invited" && invitedEvents.map((event) => (
                    <div key={event.eventId} className="card" style={{ width: "18rem" }}>
                        <img src={event.img} className="card-img-top" alt={event.title} />
                        <div className="card-body">
                            <h5 className="card-title">{event.title}</h5>
                            <p className="card-text">{event.description}</p>
                            <p className="card-text"><small className="text-muted">Datum: {formatDate(event.startTime)} - {formatDate(event.endTime)}</small></p>
                        </div>
                    </div>
                ))}

                {activeView === "saved" && (
                    <div className="alert alert-info w-100 text-center">
                        Inga sparade evenemang.
                    </div>
                )}
            </div>
        </div>
    );
}