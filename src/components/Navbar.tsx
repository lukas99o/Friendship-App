import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

export default function Navbar() {
    const navigate = useNavigate();
    const [isLoggedIn, setIsLoggedIn] = useState<boolean>(() => !!localStorage.getItem("jwtToken"));

    useEffect(() => {
        const handleStorageChange = () => {
            setIsLoggedIn(!!localStorage.getItem("jwtToken"));
        };

        window.addEventListener("storage", handleStorageChange);
        return () => {
            window.removeEventListener("storage", handleStorageChange);
        }
    }, [])

    const handleLogout = () => {
        localStorage.removeItem("jwtToken");
        window.dispatchEvent(new Event("storage"));
        navigate("/");
    };

    if (!isLoggedIn) return null;

    return (
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
            <div className="container">
                <Link className="navbar-brand" to="/events">Vänskap</Link>
                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
                    <span className="navbar-toggler-icon"></span>
                </button>

                <div className="collapse navbar-collapse" id="navbarNav">
                    <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                        <li className="nav-item">
                            <Link className="nav-link" to="/events">Träffar</Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link" to="/friendevents">Vän Träffar</Link>
                        </li>
                    </ul>
                    <button className="btn btn-outline-light" onClick={handleLogout}>
                        Logga ut
                    </button>
                </div>
            </div>
        </nav>
    )
}