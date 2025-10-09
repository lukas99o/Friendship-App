import { API_BASE_URL } from "../../config";

export async function uploadProfilePicture(file: File): Promise<string | null> {
    const token = localStorage.getItem("jwtToken");
    if (!token) return null;

    const formData = new FormData();
    formData.append("profilePicture", file); 

    try {
        const res = await fetch(`${API_BASE_URL}/api/user/upload-profile-picture`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`
            },
            body: formData 
        });

        if (!res.ok) {  
            console.error("Upload failed:", res.statusText);
            return null;
        }

        const data = await res.json();
        if (data.profilePicturePath) {
            return data.profilePicturePath;
        }

        return null;
    } catch (error) {
        console.error("Network or server error:", error);
        return null;
    }
}
