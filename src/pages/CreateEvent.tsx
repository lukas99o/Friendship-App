import React, { useState } from "react";
import CreateEvent from "../api/createEvent";
import { getInterests } from "../api/interests";
import { useNavigate } from "react-router-dom";

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
    const [interests, setInterests] = useState<string[]>([]);
    const [isPublic, setIsPublic] = useState(false);
    const [img, setImg] = useState("");
    const navigate = useNavigate();

    React.useEffect(() => {
        getInterests().then(setInterests).catch(() => setInterests([]));
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        
        try {
            await CreateEvent({
                title,
                startTime: new Date(startTime).toISOString(),
                endTime: new Date(endTime).toISOString(),
                location,
                ageRangeMin: ageRangeMin === "" ? null : ageRangeMin,
                ageRangeMax: ageRangeMax === "" ? null : ageRangeMax,
                interests: selectedInterests,
                isPublic,
                img
            });
            navigate("/my-events");

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
        <div className="d-flex justify-content-center align-items-center">
            <div className="card shadow-sm w-100" style={{ maxWidth: "600px" }}>
                <div className="card-body p-4 p-md-5">
                    <h2 className="mb-4 text-center fw-bold">Skapa Event</h2>
                    <form onSubmit={handleSubmit} className="d-flex flex-column gap-4">

                        <div className="form-floating">
                            <input
                                type="text"
                                className="form-control"
                                id="title"
                                placeholder="Titel"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                required
                            />
                            <label htmlFor="title">Titel</label>
                        </div>

                        <div className="row g-3">
                            <div className="col-md-6">
                                <div className="form-floating">
                                    <input
                                        type="datetime-local"
                                        className="form-control"
                                        id="startTime"
                                        value={startTime}
                                        onChange={(e) => setStartTime(e.target.value)}
                                        required
                                    />
                                    <label htmlFor="startTime">Starttid</label>
                                </div>
                            </div>
                            <div className="col-md-6">
                                <div className="form-floating">
                                    <input
                                        type="datetime-local"
                                        className="form-control"
                                        id="endTime"
                                        value={endTime}
                                        onChange={(e) => setEndTime(e.target.value)}
                                        required
                                    />
                                    <label htmlFor="endTime">Sluttid</label>
                                </div>
                            </div>
                        </div>

                        <div className="form-floating">
                            <input
                                type="text"
                                className="form-control"
                                id="location"
                                placeholder="Plats"
                                value={location}
                                onChange={(e) => setLocation(e.target.value)}
                                required
                            />
                            <label htmlFor="location">Plats</label>
                        </div>

                        <div className="row g-3">
                            <div className="col-md-6">
                                <div className="form-floating">
                                    <input
                                        type="number"
                                        className="form-control"
                                        id="ageMin"
                                        placeholder="Minålder"
                                        value={ageRangeMin}
                                        onChange={(e) => setAgeRangeMin(Number(e.target.value))}
                                    />
                                    <label htmlFor="ageMin">Åldersgräns Min</label>
                                </div>
                            </div>
                            <div className="col-md-6">
                                <div className="form-floating">
                                    <input
                                        type="number"
                                        className="form-control"
                                        id="ageMax"
                                        placeholder="Maxålder"
                                        value={ageRangeMax}
                                        onChange={(e) => setAgeRangeMax(Number(e.target.value))}
                                    />
                                    <label htmlFor="ageMax">Åldersgräns Max</label>
                                </div>
                            </div>
                            <div className="col md-6">
                                <div className="form-floating">
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="img"
                                        placeholder="Bild URL"
                                        value={img}
                                        onChange={(e) => setImg(e.target.value)}
                                    />
                                    <label htmlFor="img">Bild URL</label>
                                </div>
                            </div>
                            <div>
                                <div className="form-check form-switch">
                                    <input
                                        className="form-check-input"
                                        type="checkbox"
                                        id="isPublic"
                                        checked={isPublic}
                                        onChange={(e) => setIsPublic(e.target.checked)}
                                    />
                                    <label className="form-check-label" htmlFor="isPublic">
                                        Offentligt event
                                    </label>
                                </div>
                            </div>
                        </div>

                        <div className="d-flex flex-row gap-3">
                            <div className="dropdown w-50">
                                <button
                                    className="btn btn-outline-secondary dropdown-toggle w-100 text-start"
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
                                                <label
                                                    className="form-check-label"
                                                    htmlFor={`interest-${interest}`}
                                                >
                                                    {interest}
                                                </label>
                                            </div>
                                        </li>
                                    ))}
                                </ul>

                                {selectedInterests.length > 0 && (
                                    <div className="mt-3">
                                        <strong>Valda intressen:</strong>
                                        <ul className="list-inline mt-2">
                                            {selectedInterests.map((interest) => (
                                                <li
                                                    key={interest}
                                                    className="list-inline-item badge bg-primary me-1"
                                                    style={{ fontSize: "0.9rem" }}
                                                >
                                                    {interest}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}

                                
                            </div>
                            <button type="submit" className="btn btn-primary w-50 h-100">
                                Skapa event
                            </button>
                        </div>
                    </form>

                    {error && (
                        <div className="alert alert-danger mt-4" role="alert">
                            {error}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
