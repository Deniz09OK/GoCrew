import { useNavigate } from "react-router-dom";

export default function HomePublic() {
    const navigate = useNavigate();
    return (
        <div className="HomePublic">
            <h1>Bienvenue sur GoCrew !</h1>
            <p>Votre application de gestion d’équipage et de voyage.</p>
            <button onClick={() => navigate("/login")}
                style={{ marginTop: 24, padding: "12px 32px", fontSize: 18, borderRadius: 8, border: "none", background: "#FFA325", color: "white", cursor: "pointer" }}>
                Se connecter
            </button>
        </div>
    );
}
