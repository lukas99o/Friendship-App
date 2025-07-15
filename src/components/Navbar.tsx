import { NavLink, useNavigate } from "react-router-dom";
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

    const logo = "/images/logo.png"; 

    return (
        <nav className="navbar navbar-expand-lg navbar-dark vw-100 fixed-top shadow">
            <div className="container">
                <NavLink className="navbar-brand fs-3 fw-bold" to="/events">
                    <img src={logo} alt="Vänskap" style={{ maxHeight: "50px", mixBlendMode: "multiply" }} />
                </NavLink>
                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
                    <span className="navbar-toggler-icon"></span>
                </button>

                <div className="collapse navbar-collapse" id="navbarNav">
                    <ul className="navbar-nav me-auto mb-2 mb-lg-0 navbar-ul">
                        <li className="nav-item">
                            <NavLink
                                className={({ isActive }) =>
                                    `nav-link ${isActive ? "active-link" : ""}`
                                }
                                to="/events"
                            >
                                Evenemang
                            </NavLink>
                        </li>
                        <li className="nav-item">
                            <NavLink
                                className={({ isActive }) =>
                                    `nav-link ${isActive ? "active-link" : ""}`
                                }
                                to="/create-event"
                            >
                                Skapa Evenemang
                            </NavLink>
                        </li>
                    </ul>
                    <button onClick={handleLogout} className="navbar-logout-btn">
                        Logga ut
                    </button>
                </div>
            </div>
        </nav>
    )
}