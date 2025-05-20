import { useEffect, useState } from "react";
import { getEvents } from "../api/events";
import { getInterests } from "../api/interests";
import { JoinEvent } from "../api/joinEvent";
import { LeaveEvent } from "../api/leaveEvent";

interface EventDto {
    eventId: number;
    title: string;
    startTime: string;
    endTime: string;
    location: string;
    ageRangeMax: number;
    ageRangeMin: number;
    interests: string[];
}

export default function Events() {
    const [events, setEvents] = useState<EventDto[]>([]);
    const [loading, setLoading] = useState(true);
    const [ageMin, setAgeMin] = useState<number | "">("");
    const [ageMax, setAgeMax] = useState<number | "">("");
    const [interests, setInterests] = useState<string[]>([]);
    const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [joinedEvents, setJoinedEvents] = useState<number[]>([]);

    useEffect(() => {
        getInterests().then(setInterests);

        getEvents({ ageMin: null, ageMax: null, interests: null }).then((res) => {
            setEvents(res);
            setLoading(false);
        });
    }, []);

    const handleSearch = () => {
        setLoading(true);
        const filters = {
            ageMin: ageMin === "" ? null : ageMin,
            ageMax: ageMax === "" ? null : ageMax,
            interests: selectedInterests.length > 0 ? selectedInterests : null,
        };

        getEvents(filters).then((res) => {
            setEvents(res);
            setLoading(false);
        });
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

    const toggleInterest = (interest: string) => {
        if (selectedInterests.includes(interest)) {
            setSelectedInterests(selectedInterests.filter((i) => i !== interest));
        } else {
            setSelectedInterests([...selectedInterests, interest]);
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
        <div className="event-container-background min-vw-100 min-vh-100 d-flex align-items-center flex-column pt-5">
            <div className="container my-4 d-flex flex-column">
                <h1 className="text-center mb-4">Träffar</h1>

                <div className="mb-3">
                    <label>Åldersintervall</label>
                    <div className="d-flex gap-2">
                        <input
                            type="number"
                            placeholder="Min"
                            value={ageMin}
                            className="form-control"
                            onChange={(e) => setAgeMin(e.target.value === "" ? "" : Number(e.target.value))}
                            min={0}
                        />
                        <input
                            type="number"
                            placeholder="Max"
                            value={ageMax}
                            className="form-control"
                            onChange={(e) => setAgeMax(e.target.value === "" ? "" : Number(e.target.value))}
                            min={0}
                        />
                    </div>
                </div>

                <div className="mb-3">
                    <div className="dropdown">
                        <button
                            className="btn btn-secondary dropdown-toggle"
                            type="button"
                            onClick={() => setDropdownOpen(!dropdownOpen)}
                            aria-expanded={dropdownOpen}
                        >
                            {selectedInterests.length > 0
                                ? `Valda (${selectedInterests.length})`
                                : "Välj intressen"}
                        </button>
                        <ul
                            className={`dropdown-menu${dropdownOpen ? " show" : ""}`}
                            style={{ maxHeight: "200px", overflowY: "auto" }}
                        >
                            {interests.map((interest) => (
                                <li key={interest} className="dropdown-item">
                                    <div className="form-check">
                                        <input
                                            className="form-check-input"
                                            type="checkbox"
                                            id={`interest-${interest}`}
                                            checked={selectedInterests.includes(interest)}
                                            onChange={() => toggleInterest(interest)}
                                        />
                                        <label className="form-check-label" htmlFor={`interest-${interest}`}>
                                            {interest}
                                        </label>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {selectedInterests.length > 0 && (
                        <div className="mt-2">
                            <strong>Valda intressen:</strong>
                            <ul className="list-inline mt-1">
                                {selectedInterests.map((interest) => (
                                    <li key={interest} className="list-inline-item badge bg-secondary me-1">
                                        {interest}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>
                
                <div className="d-flex justify-content-center">
                    <button className="btn btn-primary mb-3 w-25" onClick={handleSearch}>
                    Sök
                    </button>
                </div>
                

                {loading && <p>Laddar...</p>}
                {!loading && events.length === 0 && <p>Inga evenemang hittades.</p>}
            </div>

            <div className="container d-flex flex-column align-items-center">
                {events.map((e) => (
                    <div
                        key={e.eventId}
                        className="border rounded p-3 mb-3 bg-light shadow-sm w-50"
                        style={{ maxWidth: "600px" }}
                    >
                        <h2>{e.title}</h2>
                        <p>
                            {formatDate(e.startTime)} - {formatDate(e.endTime)}
                        </p>

                        {e.location && <p>Plats: {e.location}</p>}
                        {(e.ageRangeMin || e.ageRangeMax) && (
                            <p>
                                Åldersintervall: {e.ageRangeMin} - {e.ageRangeMax}
                            </p>
                        )}

                        {e.interests && e.interests.length > 0 && (
                            <p>Intressen: {e.interests.join(", ")}</p>
                        )}

                        <button 
                            className={`btn ${joinedEvents.includes(e.eventId) ? "btn-danger" : "btn-success"}`}
                            onClick={() => toggleJoinStatus(e.eventId)}
                        >
                            {joinedEvents.includes(e.eventId) ? "Lämna" : "Gå med"}
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
}
