import { useEffect, useState } from "react";
import { getEvents } from "../api/events";
import { JoinEvent } from "../api/joinEvent";
import { LeaveEvent } from "../api/leaveEvent";
import { GetEventParticipantStatus } from "../api/participantStatus";
import { GetFriendEvents } from "../api/friendEvents";
import EventCard from "../components/EventCard";
import Dropdown from "../components/Dropdown";
import type { EventDto } from "../types.ts";

export default function Events() {
    const [events, setEvents] = useState<EventDto[]>([]);
    const [loading, setLoading] = useState(true);
    const [ageMin, setAgeMin] = useState<number | "">("");
    const [ageMax, setAgeMax] = useState<number | "">("");
    const [joinedEvents, setJoinedEvents] = useState<number[]>([]);
    const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
    const [showOnlyFriendsEvents, setShowOnlyFriendsEvents] = useState(false);

    useEffect(() => {        
        getEvents({ ageMin: null, ageMax: null, interests: null }).then((res) => {
            setEvents(res);
            setLoading(false);
        });

        GetEventParticipantStatus().then((res) => {
            console.log("Joined events:", res);
            setJoinedEvents(res);
        })
    }, []);

    const handleSearch = () => {
        setLoading(true);

        if (showOnlyFriendsEvents) {
            GetFriendEvents().then((res) => {
                setEvents(res);
                setLoading(false);
            });
        }
        else {
            const filters = {
                ageMin: ageMin === "" ? null : ageMin,
                ageMax: ageMax === "" ? null : ageMax,
                interests: selectedInterests.length > 0 ? selectedInterests : null,
            };

            getEvents(filters).then((res) => {
                setEvents(res);
                setLoading(false);
            });
        }
    };

    const formatDate = (dateStr: string) => {
        const options: Intl.DateTimeFormatOptions = {
            year: "numeric",
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit"
        };
        const date = new Date(dateStr);
        return date.toLocaleDateString(undefined, options);
    }

    const toggleJoinStatus = async (eventId: number) => {
        try {
            if (joinedEvents.includes(eventId)) {
                await LeaveEvent(eventId);
                setJoinedEvents(joinedEvents.filter((id) => id !== eventId));
                console.log("Lämnat evenemang med ID:", eventId);
            } else {
                await JoinEvent(eventId);
                setJoinedEvents([...joinedEvents, eventId]);
                console.log("Gått med i evenemang med ID:", eventId);
            }
        }
        catch (error) {
            console.error("Fel vid hantering av evenemang:", error);
            alert("Något gick fel, försök igen senare.");
        }
    }

    return (
        <div className="d-flex flex-column">
            <div className="container d-flex flex-column p-3 rounded" style={{ backgroundColor: "#fafafa", opacity: 0.95, zIndex: 1 }}>
                <div className="gap-2 max-w-full flex-column flex-md-row d-flex bg-d">   
                    <div className="flex-1">
                        <Dropdown 
                            selectedInterests={selectedInterests}
                            onChange={setSelectedInterests}
                        />
                    </div>
                    <input
                    type="number"
                    placeholder="Minsta ålder"
                    value={ageMin}
                    className="form-control flex-1 w-25-md w-sm-50"
                    onChange={(e) => setAgeMin(e.target.value === "" ? "" : Number(e.target.value))}
                    min={0}
                    />
                    <input
                    type="number"
                    placeholder="Största ålder"
                    value={ageMax}
                    className="form-control flex-1 w-25-md w-sm-50"
                    onChange={(e) => setAgeMax(e.target.value === "" ? "" : Number(e.target.value))}
                    min={0}
                    />
                </div>

                {selectedInterests.length > 0 && (
                    <div className="mt-2 overflow-x-auto whitespace-nowrap">
                        <strong>Valda intressen:</strong>
                        <div className="mt-1 flex flex-wrap gap-2">
                            {selectedInterests.map((interest) => (
                            <span key={interest} className="badge bg-secondary">
                                {interest}
                            </span>
                            ))}
                        </div>
                    </div>
                )}

                <div className="d-flex mt-3 justify-content-around align-items-center">
                    <div className="form-check">
                        <label className="form-check-label">Visa endast vänners evenemang</label>
                        <input
                            type="checkbox"
                            className="form-check-input"
                            onChange={(e) => setShowOnlyFriendsEvents(e.target.checked)}
                        />
                    </div>
                    
                    <button className="btn btn-dark w-25" onClick={handleSearch}>
                    🔍 Sök
                    </button>
                </div>
                

                {loading && <p>Laddar...</p>}
                {!loading && events.length === 0 && <p>Inga evenemang hittades.</p>}
            </div>
            
            <div className="container d-flex flex-wrap justify-content-center gap-4 mt-4">
                {events.map((e) => (
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
    );
}
