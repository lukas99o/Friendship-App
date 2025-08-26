export default function StartPage() {
    return (
        <div
            className="d-flex flex-column align-items-center px-3"
            style={{ minHeight: "85vh", fontFamily: "'Nunito', sans-serif" }}
        >
            <h1 className="fancy-title mb-4 text-center">Välkommen till Vänskap!</h1>

            <div
                className="container bg-light p-4 p-md-5 shadow d-flex flex-column flex-md-row align-items-center gap-4"
                style={{ opacity: 0.95, borderRadius: "1rem" }}
            >
                <div className="w-100 w-md-50">
                    <video
                        src="/videos/vänskap-flöde.mp4"
                        autoPlay
                        muted
                        loop
                        style={{ width: "100%", borderRadius: "1rem", pointerEvents: "none" }}
                    />
                </div>

                <div className="w-90 w-md-50 text-center">
                    <div className="shadow p-4 p-md-5" style={{ color: "#888", borderRadius: "1rem" }}>
                        <h2 className="mb-3" style={{ fontWeight: "bold" }}>Utforska Vänskap</h2>
                        <p>Gå med i vår gemenskap och upptäck nya vänskapsband!</p>
                        <p>Vi erbjuder en plattform för att knyta kontakter och bygga meningsfulla relationer.</p>
                        <p>Oavsett om du letar efter vänner, aktiviteter eller bara vill ha kul, så har vi något för dig!</p>
                        <p>Registrera dig idag och börja din resa mot nya vänskaper!</p>
                    </div>

                    <img
                        src="/images/friendship.png"
                        alt="Vänskap Logo"
                        className="img-fluid mt-4"
                        style={{ maxWidth: "300px", mixBlendMode: "multiply" }}
                    />
                </div>
            </div>
        </div>
    );
}
