import { useNavigate } from 'react-router-dom';

export default function Home() {
    const navigate = useNavigate(); // Hook to navigate programmatically

    const handleExploreClick = () => {
        navigate('/recipes'); // Navigate to the Recipes page
    };

    return (
        <div className="home-section">
            <video className="background-video" autoPlay loop muted>
                <source src="/img/gallery/foodvideo.mp4" type="video/mp4" />
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
