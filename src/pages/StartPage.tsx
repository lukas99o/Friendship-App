import { useEffect } from "react";

export default function StartPage() {
    useEffect(() => {
        fetch("https://localhost:7106/ping")
            .then(() => console.log("✅ API wake-up request sent"))
            .catch(err => console.error("❌ API not reachable", err));
    }, []);

    return (
        <div
            className="d-flex flex-column align-items-center pb-5 px-3"
            style={{ minHeight: "85vh", fontFamily: "'Nunito', sans-serif" }}
        >
            <h1 className="fancy-title mb-4 text-center">Välkommen till Vänskap!</h1>

            <div
                className="container rounded bg-light p-4 p-md-5 shadow d-flex flex-column flex-md-row align-items-center gap-4"
            >
                <div className="position-relative w-100 w-md-50">
                    <video
                        src="/videos/vänskap-flöde.mp4"
                        autoPlay
                        muted
                        loop
                        style={{ width: "100%", pointerEvents: "none", filter: "brightness(0.85)" }}
                        className="rounded"
                    />
                </div>

                <div className="w-90 w-md-50 text-center">
                    <div className="shadow startpage-text rounded">
                        <h2 className="mb-3" style={{ fontWeight: "bold" }}>Utforska Vänskap</h2>
                        <p>Gå med i vår gemenskap och upptäck nya vänskapsband!</p>
                        <p>Vi erbjuder en plattform för att knyta kontakter och bygga meningsfulla relationer.</p>
                        <p>Oavsett om du letar efter vänner, aktiviteter eller bara vill ha kul, så har vi något för dig!</p>
                        <p>Registrera dig idag och börja din resa mot nya vänskaper!</p>
                        <a className="btn btn-orange mt-2" style={{ color: "white", width: "fit-content", padding: "10px 20px" }}>Registrera dig</a>

                    </div>

                    <img
                        src="/images/friendship.png"
                        alt="Vänskap Logo"
                        className="img-fluid mt-4"
                        style={{ maxWidth: "300px", mixBlendMode: "multiply", transition: "transform 0.25s ease" }}
                        onMouseEnter={e => e.currentTarget.style.transform = "scale(1.05)"}
                        onMouseLeave={e => e.currentTarget.style.transform = "scale(1)"} 
                    />

                </div>
            </div>
        </div>
    );
}
