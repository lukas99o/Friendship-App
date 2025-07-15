import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    async function handleLogin(e: React.FormEvent) {
        e.preventDefault();
        setError("");

        try {
            const res = await fetch("https://friendship-c3cfdgejf5ateyc2.swedencentral-01.azurewebsites.net/api/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password })
            });

            if (!res.ok) {
                setError("Fel användarnamn eller lösenord");
                return;
            }

            const data = await res.json();
            localStorage.setItem("jwtToken", data.token);
            window.dispatchEvent(new Event("storage"));
            navigate("/events");
        } catch {
            setError("Något gick fel.");
        }
    }

    return (
        <div className="d-flex justify-content-center align-items-center login-register-wrapper" id="login-register">
            <form onSubmit={handleLogin} className="p-4 rounded shadow bg-white" style={{ minWidth: "300px" }}>
                <h2 className="mb-4 text-center">Logga in</h2>

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

                <button type="submit" className="btn btn-primary w-100">Logga in</button>

                <div className="text-center mt-3">
                    <span>Har du inget konto? </span>
                    <Link to="/register">Registrera dig</Link>
                </div>
            </form>
        </div>
    );
}
