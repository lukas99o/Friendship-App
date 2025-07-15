import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "react-datepicker/dist/react-datepicker.css";

export default function Register() {
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [userName , setUserName] = useState("");
    const [dateOfBirth, setDateOfBirth] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    async function handleRegister(e: React.FormEvent) {
        e.preventDefault();
        setError("");

        if (password !== confirmPassword) {
            setError("Lösenorden matchar inte");
            return;
        }

        try {
            const res = await fetch("https://ashy-stone-09b187203.2.azurestaticapps.net/api/auth/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ 
                    email, 
                    password,
                    userName,
                    firstName,
                    lastName,
                    dateOfBirth
                })
            });

            if (!res.ok) {
                setError("Registrering misslyckades");
                return;
            }

            navigate("/");
        } catch {
            setError("Något gick fel.")
        }
    }

    return (
        <div className="d-flex justify-content-center align-items-center login-register-wrapper" id="login-register">
            <form onSubmit={handleRegister} className="p-4 rounded shadow bg-white" style={{ minWidth: "300px" }}>
                <h2 className="mb-4 text-center">Registrera dig</h2>

                <div className="mb-3">
                    <label className="form-label">Förnamn</label>
                    <input
                        type="text"
                        className="form-control"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        required
                    />
                </div>

                <div className="mb-3">
                    <label className="form-label">Efternamn</label>
                    <input
                        type="text"
                        className="form-control"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        required
                    />
                </div>

                <div className="mb-3">
                    <label className="form-label">Användarnamn</label>
                    <input
                        type="text"
                        className="form-control"
                        value={userName}
                        onChange={(e) => setUserName(e.target.value)}
                        required
                    />
                </div>

                <div className="mb-3">
                    <label className="form-label">Födelsedatum</label>
                    <input
                        type="date"
                        className="form-control"
                        value={dateOfBirth}
                        onChange={(e) => setDateOfBirth(e.target.value)}
                        required
                    />
                </div>

                <div className="mb-3">
                    <label className="form-label">Email</label>
                    <input
                        type="email"
                        className="form-control"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>

                <div className="mb-3">
                    <label className="form-label">Lösenord</label>
                    <input
                        type="password"
                        className="form-control"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>

                <div className="mb-3">
                    <label className="form-label">Bekräfta lösenord</label>
                    <input
                        type="password"
                        className="form-control"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                    />
                </div>

                {error && <div className="alert alert-danger py-1">{error}</div>}

                <button type="submit" className="btn btn-success w-100">Registrera</button>

                <div className="text-center mt-3">
                    <span>Har du redan ett konto? </span>
                    <Link to="/">Logga in</Link>
                </div>
            </form>
        </div>
    )
}