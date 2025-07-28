import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

export default function VerifyEmail() {
    const [searchParams] = useSearchParams();
    const [status, setStatus] = useState<"loading" | "success" | "error">("loading");

    useEffect(() => {
        const userId = searchParams.get("userId");
        const token = searchParams.get("token");

        if (!userId || !token) {
            setStatus("error");
            return;
        }

        fetch(`https://localhost:7106/api/auth/confirm-email?userId=${userId}&token=${encodeURIComponent(token)}`, {
            method: "POST"
        })
            .then(res => {
                if (res.ok) setStatus("success");
                else setStatus("error");
            })
            .catch(() => setStatus("error"));
    }, [searchParams]);

    return (
        <div className="d-flex justify-content-center align-items-center vh-100">
            <div className="text-center p-4 rounded shadow bg-white">
                {status === "loading" && <p>Verifierar e-postadress...</p>}
                {status === "success" && <p className="text-success">Din e-postadress har bekräftats! Du kan nu logga in.</p>}
                {status === "error" && <p className="text-danger">Verifikationen misslyckades. Länken kan vara ogiltig eller ha gått ut.</p>}
            </div>
        </div>
    );
}
