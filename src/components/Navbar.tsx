import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/authContext";
import { useEffect, useRef } from "react";

export default function Navbar() {
    const { isLoggedIn, logout } = useAuth();
    const navigate = useNavigate();
    const logo = "/images/logo.png";
    const navbarRef = useRef<HTMLElement>(null);

    const closeNavbar = () => {
        const navbarToggler = document.querySelector('.navbar-toggler') as HTMLButtonElement;
        const navbarCollapse = document.querySelector('.navbar-collapse') as HTMLElement;
        
        if (navbarCollapse?.classList.contains('show')) {
            navbarToggler?.click();
        }
    };

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (navbarRef.current && !navbarRef.current.contains(event.target as Node)) {
                closeNavbar();
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
        <nav ref={navbarRef} className="navbar navbar-expand-lg navbar-dark fixed-top shadow">
            <div className="container" style={{ opacity: 1 }}>
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
                                        to="/my-events"
                                        end={false}
                                        onClick={closeNavbar}
                                    >
                                        Mina Evenemang
                                    </NavLink>
                                </li>
                                <li className="nav-item">
                                    <NavLink
                                        className={({ isActive }) =>
                                            `nav-link ${isActive ? "active-link" : ""}`
                                        }
                                        to="/friends"
                                        onClick={closeNavbar}
                                    >
                                        Vänner
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
                                        Registrera dig
                                    </NavLink>
                                </li>
                            </>
                        )}

                    </ul>
                    {isLoggedIn && (
                        <>
                            <div className="d-flex align-items-center justify-content-end gap-2">
                                <button className="navbar-profile-btn"
                                    onClick={() => {
                                        navigate("/profile");
                                        closeNavbar();
                                    }}
                                >
                                    Profil
                                </button>
                                <button onClick={() => {
                                    logout();
                                    navigate("/");
                                    closeNavbar();
                                }} className="navbar-logout-btn">
                                    Logga ut
                                </button>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
}
