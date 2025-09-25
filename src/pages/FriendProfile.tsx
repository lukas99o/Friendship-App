import { useEffect, useState } from "react";
import { API_BASE_URL } from "../config";
import { GetUser } from "../api/user/getUser";
import type { UserDto } from "../types";

export default function FriendProfile() {
    const [user, setUser] = useState<UserDto | null>(null);

    useEffect(() => {
        GetUser().then(data => setUser(data));
    }, []);

    if (!user) return <div>Laddar...</div>;

    return (
        <div className="container d-flex justify-content-center profile-container pb-5">
            <div className="bg-white rounded-4 shadow p-4 container-header" style={{ maxWidth: 420, width: "100%" }}>
                <div className="d-flex flex-column align-items-center mb-4">
                    <img
                        src={`${API_BASE_URL}${user.profilePicturePath}`}
                        alt="Profilbild"
                        className="rounded-circle border border-3 border-warning mb-3"
                        style={{ width: 120, height: 120, objectFit: "cover" }}
                    />
                    <h2 className="fw-bold text-orange mb-1">{user.userName}</h2>
                    <span className="text-muted">{user.firstName} {user.lastName}, {user.age} år</span>
                </div>
                <div className="mb-3">
                    <h5 className="fw-bold text-orange mb-2">Om mig</h5>
                    <div className="bg-light rounded p-3">
                        <p
                            className="mb-0 border p-2 shadow-sm rounded"
                            style={{
                                wordBreak: "break-word",
                                maxHeight: "30vh",
                                minHeight: 60,
                                overflowY: "auto"
                            }}
                        >
                            {user.about && user.about.trim() !== ""
                                ? user.about
                                : <span className="text-muted">Ingen beskrivning ännu.</span>
                            }
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}