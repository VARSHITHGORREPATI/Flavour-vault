import ChiefCard from "./ChiefCard"

export default function ChiefsSection(){
    const chiefs = [
        {
            name: "Gorrepati Varshith",
            img: "/img/top-chiefs/img_1.jpg",
        },
        {
            name: "Rakesh Kumar",
            img: "/img/top-chiefs/img_2.jpg",
        },
        {
            name: "Hema Swaroop",
            img: "/img/top-chiefs/img_3.jpg",
        },
        {
            name: "Aniketh dilip",
            img: "/img/top-chiefs/img_4.jpg",
        },
        {
            name: "Kuppala Balaji",
            img: "/img/top-chiefs/img_5.jpg",
        }
    ]
    return (
        <div className="section chiefs">
            <h1 className="title">Our Top Chiefs</h1>
            <div className="top-chiefs-container">
                
                { chiefs.map(chief => <ChiefCard key={chief.name} chief={chief} />) }
            </div>
        </div>
    )
}