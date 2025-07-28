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

    function validateEmail(email: string) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    function validatePassword(password: string) {
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
        return passwordRegex.test(password);
    }

    function validateDateOfBirth(date: string) {
        const today = new Date();
        const birthDate = new Date(date);
        return birthDate <= today;
    }

    async function handleRegister(e: React.FormEvent) {
        e.preventDefault();
        setError("");
        const errors: string[] = [];

        if (!validateEmail(email)) {
            errors.push("Ogiltig e-postadress");
        }

        if (!validatePassword(password)) {
            errors.push("Lösenordet måste vara minst 8 tecken långt och innehålla en stor bokstav, en liten bokstav, en siffra och ett specialtecken");
        }

        if (!validateDateOfBirth(dateOfBirth)) {
            errors.push("Ogiltigt födelsedatum");
        }

        if (password !== confirmPassword) {
            setError("Lösenorden matchar inte");
            return;
        }

        if (errors.length > 0) {
            setError(errors.join(". "));
            return;
        }

        try {
            const res = await fetch("https://localhost:7106/api/auth/register", {
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
                const errorText = await res.text();
                
                if (errorText === "E-postadressen används redan.") {
                    setError("E-postadressen används redan.");
                } else if (errorText === "Användarnamnet är redan taget.") {
                    setError("Användarnamnet är redan taget.");
                } else {
                    setError("Något gick fel. Försök igen.");
                }

                return;
            }
            
            const data = await res.json();
            navigate("/verificationPage", { state: { confirmationLink: data.link, email: email}});
        } catch {
            setError("Något gick fel.")
        }
    }

    return (
        <div className="d-flex justify-content-center align-items-center login-register-wrapper" id="login-register">
            <form onSubmit={handleRegister} className="p-4 rounded shadow bg-white" style={{ width: "300px" }}>
                <h2 className="mb-4 text-center">Registrera dig</h2>

                <div className="mb-3">
                    <label className="form-label">Förnamn</label>
                    <input
                        type="text"
                        className="form-control"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        required
                        maxLength={50}
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
                        maxLength={50}
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
                        maxLength={50}
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