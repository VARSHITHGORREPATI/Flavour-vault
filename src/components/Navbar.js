import { Link, useLocation } from "react-router-dom";
import { faHome, faList, faCog } from "@fortawesome/free-solid-svg-icons";
import "../styles/Recipes.css";

export default function Navbar() {
    const location = useLocation();
    const links = [
        {
            name: "Home",
            path: "/",
            icon: faHome,
        },
        {
            name: "Recipes",
            path: "/recipes",
            icon: faList,
        },
        {
            name: "Settings and Review",
            path: "/settings",
            icon: faCog,
        },
    ];

    return (
        <div className="navbar container">
            <Link to="/" className="logo">
                <img src="/img/gallery/logo1.jpg" alt="Logo" className="logo-img" />
            </Link>
            <div className="nav-links">
                {links.map((link) => (
                    <Link
                        className={location.pathname === link.path ? "active" : ""}
                        to={link.path}
                        key={link.name}
                    >
                        {link.name}
                    </Link>
                ))}
            </div>
        </div>
    );
}
