import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/authContext";

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();
    const { login } = useAuth(); 

    useEffect(() => {
        fetch("https://localhost:7106/ping")
            .then(() => console.log("✅ API wake-up request sent"))
            .catch(err => console.error("❌ API not reachable", err));
    }, []);

    async function handleLogin(e: React.FormEvent, guest = false) {
        e.preventDefault();
        setError("");

        let loginEmail = email;
        let loginPassword = password;

        if (guest) {
            loginEmail = "iamtest@test.com";
            loginPassword = "Test123!";
        }

        console.log(loginEmail, loginPassword, "hit");

        try {
            const res = await fetch("https://localhost:7106/api/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email: loginEmail, password: loginPassword }),
            });

            if (!res.ok) {
                const errorText = await res.text();
                if (errorText === "Du måste bekräfta din e-post först.") {
                    setError("Du måste bekräfta din e-post först.");
                } else {
                    setError("Felaktig e-post eller lösenord.");
                }

                return;
            }

            const data = await res.json();
            login(data.token, data.username, data.userId);
            navigate("/events");
        } catch {
            setError("Något gick fel.");
        }
    }

    return (
        <div className="container d-flex justify-content-center pb-5" style={{ height: "fit-content" }}>
            <form onSubmit={handleLogin} className="p-4 rounded shadow bg-white" style={{ width: "300px" }}>
                <h2 className="mb-4 text-center header">Logga in</h2>
                <p className="fs-6 border p-2 text-center">Den kan ta upp till 1 minut för azure att starta upp API:et för Vänskap när appen varit i standby. Ta en kaffe kom tillbaka sen kan du komma in!</p>
                <div className="mb-3">
                    <label className="form-label">Email</label>
                    <input
                        type="email"
                        className="form-control"
                        placeholder="namn@email.com"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        required
                    />
                </div>

                <div className="mb-3">
                    <label className="form-label">Lösenord</label>
                    <input
                        type="password"
                        className="form-control"
                        placeholder="••••••••"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        required
                    />
                </div>

                {error && <div className="alert alert-danger py-1">{error}</div>}

                <button type="submit" className="btn-orange w-100">Logga in</button>

                <div className="text-center mt-3">
                    <span>Har du inget konto? </span>
                    <Link to="/register">Registrera dig</Link>
                    <p className="fs-6 mb-0">Logga in som <button type="button" className="btn btn-link p-0 align-baseline" onClick={(e) => handleLogin(e, true)}>gäst</button></p>
                </div>
            </form>
        </div>
    );
}