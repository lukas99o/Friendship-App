import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/authContext";

export default function Navbar() {
    const { isLoggedIn, logout } = useAuth();
    const navigate = useNavigate();
    const logo = "/images/logo.png"; 

    const closeNavbar = () => {
        const navbarToggler = document.querySelector('.navbar-toggler') as HTMLButtonElement;
        const navbarCollapse = document.querySelector('.navbar-collapse') as HTMLElement;
        
        if (navbarCollapse?.classList.contains('show')) {
            navbarToggler?.click();
        }
    };

    return (
        <nav className="navbar navbar-expand-lg navbar-dark vw-100 fixed-top shadow">
            <div className="container">
                <NavLink className="navbar-brand fs-3 fw-bold" to="/events" onClick={closeNavbar}>
                    <img src={logo} alt="Vänskap" style={{ maxHeight: "50px", mixBlendMode: "multiply" }} />
                </NavLink>
                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
                    <span className="navbar-toggler-icon"></span>
                </button>

                <div className="collapse navbar-collapse" id="navbarNav">
                    <ul className="navbar-nav me-auto mb-2 mb-lg-0 navbar-ul">
                        {isLoggedIn && (
                            <>
                                <li className="nav-item">
                                    <NavLink
                                        className={({ isActive }) =>
                                            `nav-link ${isActive ? "active-link" : ""}`
                                        }
                                        to="/events"
                                        onClick={closeNavbar}
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
                                        onClick={closeNavbar}
                                    >
                                        Skapa Evenemang
                                    </NavLink>
                                </li>
                                <li className="nav-item">
                                    <NavLink
                                        className={({ isActive }) =>
                                            `nav-link ${isActive ? "active-link" : ""}`
                                        }
                                        to="/my-events"
                                        onClick={closeNavbar}
                                    >
                                        Mina Evenemang
                                    </NavLink>
                                </li>
                            </>
                        )}
                        {!isLoggedIn && (
                            <>
                                <li className="nav-item">
                                    <NavLink
                                        className={({ isActive }) =>
                                            `nav-link ${isActive ? "active-link" : ""}`
                                        }
                                        to="/"
                                        onClick={closeNavbar}
                                    >
                                        Startsida
                                    </NavLink>
                                </li>
                                <li className="nav-item">
                                    <NavLink
                                        className={({ isActive }) =>
                                            `nav-link ${isActive ? "active-link" : ""}`
                                        }
                                        to="/login"
                                        onClick={closeNavbar}
                                    >
                                        Logga in
                                    </NavLink>
                                </li>
                                <li className="nav-item">
                                    <NavLink
                                        className={({ isActive }) =>
                                            `nav-link ${isActive ? "active-link" : ""}`
                                        }
                                        to="/register"
                                        onClick={closeNavbar}
                                    >
                                        Registrera
                                    </NavLink>
                                </li>
                            </>
                        )}

                    </ul>
                    {isLoggedIn && (
                        <>
                            <button onClick={() => {
                                logout();
                                navigate("/");
                                closeNavbar();
                            }} className="navbar-logout-btn">
                                Logga ut
                            </button>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
}
