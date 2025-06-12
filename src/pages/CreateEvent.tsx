import { redirect } from "react-router-dom";
import CreateEvent from "../api/createEvent";
import { useState } from "react";
import { getInterests } from "../api/interests";

export default function CreateEventPage() {
    const [title, setTitle] = useState("");
    const [startTime, setStartTime] = useState("");
    const [endTime, setEndTime] = useState("");
    const [location, setLocation] = useState("");
    const [ageRangeMin, setAgeRangeMin] = useState<number | "">("");
    const [ageRangeMax, setAgeRangeMax] = useState<number | "">("");
    const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
    const [error, setError] = useState("");
    const [dropdownOpen, setDropdownOpen] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        try {
            await CreateEvent({
                title,
                startTime,
                endTime,
                location,
                ageRangeMin: ageRangeMin === "" ? null : ageRangeMin,
                ageRangeMax: ageRangeMax === "" ? null : ageRangeMax,
                interests
            });
            redirect("/events");

        } catch (err) {
            setError("Kunde inte skapa eventet.");
        }
    };

    const toggleInterest = (interest: string) => {
        if (selectedInterests.includes(interest)) {
            setSelectedInterests(selectedInterests.filter(i => i !== interest));
        } else {
            setSelectedInterests([...selectedInterests, interest]);
        }
    }

    return (
        <div className="min-vh-100 d-flex justify-content-center align-items-center">
            <div className="card shadow-lg" style={{ maxWidth: "600px", width: "100%" }}>
                <div className="card-body p-5">
                    <h2 className="mb-4 text-center">Skapa Event</h2>
                    <form onSubmit={handleSubmit} className="d-flex flex-column gap-3">
                        <div className="form-floating">
                            <input type="text" className="form-control" id="title" placeholder="Titel"
                                value={title} onChange={(e) => setTitle(e.target.value)} required />
                            <label htmlFor="title">Titel</label>
                        </div>

                        <div className="form-floating">
                            <input type="datetime-local" className="form-control" id="startTime"
                                value={startTime} onChange={(e) => setStartTime(e.target.value)} required />
                            <label htmlFor="startTime">Starttid</label>
                        </div>

                        <div className="form-floating">
                            <input type="datetime-local" className="form-control" id="endTime"
                                value={endTime} onChange={(e) => setEndTime(e.target.value)} required />
                            <label htmlFor="endTime">Sluttid</label>
                        </div>

                        <div className="form-floating">
                            <input type="text" className="form-control" id="location" placeholder="Plats"
                                value={location} onChange={(e) => setLocation(e.target.value)} required />
                            <label htmlFor="location">Plats</label>
                        </div>

                        <div className="form-floating">
                            <input type="number" className="form-control" id="ageMin" placeholder="Minålder"
                                value={ageRangeMin} onChange={(e) => setAgeRangeMin(Number(e.target.value))} />
                            <label htmlFor="ageMin">Åldersgräns Min</label>
                        </div>

                        <div className="form-floating">
                            <input type="number" className="form-control" id="ageMax" placeholder="Maxålder"
                                value={ageRangeMax} onChange={(e) => setAgeRangeMax(Number(e.target.value))} />
                            <label htmlFor="ageMax">Åldersgräns Max</label>
                        </div>
                        
                        <div className="form-floating dropdown">
                            <button className="btn btn-secondary dropdown-toggle" 
                            type="button" 
                            onClick={() => setDropdownOpen(!dropdownOpen)}
                            aria-expanded={dropdownOpen}>
                                {interests.length > 0 ? `Valda (${interests.length})` : "Välj intressen"}
                            </button>

                            <ul className={`dropdown-menu${dropdownOpen ? " show" : ""}`} style={{ maxHeight: "200px", overflowY: "auto" }}>
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

                        <button type="submit" className="btn btn-primary mt-3 w-100">Skapa event</button>
                    </form>

                    {error && (
                        <div className="alert alert-danger mt-3" role="alert">
                            {error}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
