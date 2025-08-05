export default function StartPage() {
    return (
        <div className="d-flex flex-column align-items-center" style={{ opacity: 0.95, height: "85vh", fontFamily: "'Nunito', sans-serif" }}>  
            <h1 className="fancy-title mb-5">Välkommen till Vänskap!</h1>
            <div className="container bg-light p-5 shadow bg-light d-flex flex-row gap-5" style={{ opacity: 0.95, minWidth: "50%", borderRadius: "1rem" }}>
                <div className="" style={{ width: "100%" }}>
                    <video 
                        src="/videos/vänskap-flöde.mp4" 
                        autoPlay 
                        muted 
                        loop 
                        style={{ width: "100%", borderRadius: "1rem", pointerEvents: "none" }}
                    />
                </div>
                <div className="" style={{ width: "50%"}}>
                    <div className="text-center shadow p-5" style={{ color: "#888", borderRadius: "1rem" }}>
                        <h2 className="mb-4" style={{ fontWeight: "bold" }}>Utforska Vänskap</h2>
                        <p>Gå med i vår gemenskap och upptäck nya vänskapsband!</p>
                        <p>Vi erbjuder en plattform för att knyta kontakter och bygga meningsfulla relationer.</p>
                        <p>Oavsett om du letar efter vänner, aktiviteter eller bara vill ha kul, så har vi något för dig!</p>
                        <p>Registrera dig idag och börja din resa mot nya vänskaper!</p>
                        
                    </div>
                    <img src="/images/friendship.png" alt="Vänskap Logo" style={{ maxWidth: "100%", marginTop: "100px", mixBlendMode: "multiply", marginLeft: "auto", marginRight: "auto", display: "block" }} />
                </div>
            </div>
        </div>
    );
}

