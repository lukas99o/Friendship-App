import { useEffect, useState } from "react";
import { getEvents } from "../api/events/events.ts";
import { JoinEvent } from "../api/events/joinEvent.ts";
import { LeaveEvent } from "../api/events/leaveEvent.ts";
import { GetEventParticipantStatus } from "../api/participantStatus";
import { GetFriendEvents } from "../api/events/friendEvents.ts";
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
    const [alphabeticalOrder, setAlphabeticalOrder] = useState(false);
    const [dateOrder, setDateOrder] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const joined = await GetEventParticipantStatus();
                setJoinedEvents(joined);

                const allEvents = await getEvents({ ageMin: null, ageMax: null, interests: null });
                const filteredEvents = allEvents.filter(e => !joined.includes(e.eventId));
                const sorted = filteredEvents.sort((a, b) => a.title.localeCompare(b.title));

                setEvents(sorted);
                setAlphabeticalOrder(true);
                setLoading(false);
            } catch (error) {
                console.error("Något gick fel:", error);
            }
        };

        fetchData();
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
                let filtered = res.filter(e => !joinedEvents.includes(e.eventId));

                if (alphabeticalOrder) {
                    filtered = filtered.sort((a, b) => a.title.localeCompare(b.title));
                } else if (dateOrder) {
                    filtered = filtered.sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime());
                }

                setEvents(filtered);
                setLoading(false);
            });
        }
    };

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
        <div className="d-flex flex-column container">
            <div className="d-flex flex-column p-3 rounded" style={{ backgroundColor: "#fafafa", opacity: 0.95, zIndex: 1 }}>
                <div className="d-flex flex-column gap-3">
                    <div className="d-flex flex-column flex-md-row gap-2 justify-content-between align-items-center">
                        <Dropdown 
                        selectedInterests={selectedInterests}
                        onChange={setSelectedInterests}
                        />

                        <input
                        type="number"
                        placeholder="Min ålder"
                        value={ageMin}
                        className="form-control"
                        onChange={(e) => setAgeMin(e.target.value === "" ? "" : Number(e.target.value))}
                        min={0}
                        />

                        <input
                        type="number"
                        placeholder="Max ålder"
                        value={ageMax}
                        className="form-control"
                        onChange={(e) => setAgeMax(e.target.value === "" ? "" : Number(e.target.value))}
                        min={0}
                        />
                    </div>

                    {selectedInterests.length > 0 && (
                        <div>
                        <strong>Valda intressen:</strong>
                        <div className="mt-2 d-flex flex-wrap gap-2">
                            {selectedInterests.map((interest) => (
                            <span key={interest} className="badge bg-warning text-dark">
                                {interest}
                            </span>
                            ))}
                        </div>
                        </div>
                    )}

                    <div className="d-flex flex-wrap gap-3 justify-content-between align-items-center">
                        <div className="d-flex align-items-center gap-2">
                        <label htmlFor="sortDropdown" className="mb-0 fw-semibold">Sortera:</label>
                        <select
                            id="sortDropdown"
                            className="form-select"
                            value={alphabeticalOrder ? "alphabetical" : dateOrder ? "date" : ""}
                            onChange={(e) => {
                            const value = e.target.value;
                            setAlphabeticalOrder(value === "alphabetical");
                            setDateOrder(value === "date");
                            }}
                            style={{ cursor: "pointer" }}
                        >
                            <option value="alphabetical">Alfabetiskt</option>
                            <option value="date">Datum</option>
                        </select>
                        </div>

                        <div className="form-check">
                        <input
                            type="checkbox"
                            className="form-check-input"
                            id="friendsEventsOnly"
                            onChange={(e) => setShowOnlyFriendsEvents(e.target.checked)}
                            style={{ border: "1px solid #888"}}
                        />
                        <label className="form-check-label ms-2" htmlFor="friendsEventsOnly">
                            Visa endast vänners evenemang
                        </label>
                        </div>

                        <button className="btn btn-dark w-25" onClick={handleSearch}>
                            Sök
                        </button>
                    </div>

                    {loading && <p>Laddar...</p>}
                    {!loading && events.length === 0 && <p>Inga evenemang hittades.</p>}
                    </div>
                {loading && <p>Laddar...</p>}
                {!loading && events.length === 0 && <p>Inga evenemang hittades.</p>}
            </div>
            
            <div className="d-flex flex-wrap justify-content-center gap-4 mt-4" style={{ paddingBottom: "40px" }}>
                {events.map((e) => (
                <EventCard
                    key={e.eventId}
                    event={e}
                    isJoined={joinedEvents.includes(e.eventId)}
                    onToggleJoin={toggleJoinStatus}
                />
                ))}
            </div>
        </div>
    );
}
