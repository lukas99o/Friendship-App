import { GetFriendEvents } from "../api/friendEvents";
import { useState } from "react";

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

export default function FriendEvents() {
    const [friendEvents, setFriendEvents] = useState<EventDto[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchFriendEvents = async () => {
        GetFriendEvents().then((res) => {
            setFriendEvents(res);
            setLoading(false);
        })
    }

    fetchFriendEvents();

    const formatDate = (dateStr: string) => {
        const options: Intl.DateTimeFormatOptions = {
            year: "numeric",
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit"
        }

        const date = new Date(dateStr);
        return date.toLocaleDateString(undefined, options);
    }

    return (
        <div className="min-vw-100 min-vh-100 d-flex align-items-center flex-column pt-5">
            <div className="container my-4 d-flex flex-column">
                <h1 className="text-center mb-4">Vän Träffar</h1>

                {loading && <p>Laddar...</p>}
                {!loading && friendEvents.length === 0 && <p>Inga evenemang hittades.</p>}
            </div>

            <div className="container d-flex flex-column align-items-center">
                {friendEvents.map((e) => (
                    <div
                        key={e.eventId}
                        className="border rounded p-3 mb-3 bg-light shadow-sm w-50"
                        style={{ maxWidth: "600px"}}
                    >

                        <h2>{e.title}</h2>
                        <p>
                            {formatDate(e.startTime)} - {formatDate(e.endTime)}
                        </p>

                        {e.location && <p>Plats: {e.location}</p>}
                        {(e.ageRangeMin || e.ageRangeMax) && (
                            <p>
                                Åldersgräns: {e.ageRangeMin} - {e.ageRangeMax}
                            </p>
                        )}

                        {e.interests && e.interests.length > 0 && (
                            <p>Intressen: {e.interests.join(", ")}</p>
                        )}
                    </div>
                ))}
            </div>
        </div>
    )
}