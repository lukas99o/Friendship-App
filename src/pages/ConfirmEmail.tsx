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

        fetch(`https://friendship-c3cfdgejf5ateyc2.swedencentral-01.azurewebsites.net/api/auth/confirm-email?userId=${userId}&token=${encodeURIComponent(token)}`, {
            method: "POST"
        })
            .then(res => {
                if (res.ok) setStatus("success");
                else setStatus("error");
            })
            .catch(() => setStatus("error"));
    }, [searchParams]);

    return (
        <div className="d-flex justify-content-center container">
            <div className="text-center p-4 rounded shadow bg-white">
                {status === "loading" && <p>Verifierar e-postadress...</p>}
                {status === "success" && <p className="text-success">Din e-postadress har bekräftats! Du kan nu logga in.</p>}
                {status === "success" && <a href="/login" className="btn btn-primary mt-3">Logga in</a>}
                {status === "error" && <p className="text-danger">Verifikationen misslyckades. Länken kan vara ogiltig eller ha gått ut.</p>}
            </div>
        </div>
    );
}
