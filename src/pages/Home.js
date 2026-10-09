import { useNavigate } from 'react-router-dom';
import { CLOUDINARY_VIDEO_URL } from '../config';

export default function Home() {
    const navigate = useNavigate();

    const handleExploreClick = () => {
        navigate('/recipes');
    };

    return (
        <div className="home-section">
            <video className="background-video" autoPlay loop muted>
                <source src={CLOUDINARY_VIDEO_URL} type="video/mp4" />
                Your browser does not support the video tag.
            </video>

            <div className="overlay">
                <h1 className="main-title">Welcome to Flavour Vault</h1>
                <p className="subtitle">
                    Discover delicious recipes and elevate your culinary skills.
                </p>
                <button className="explore-btn" onClick={handleExploreClick}>
                    Explore Now
                </button>
            </div>
        </div>
    );
}
