import React from "react";
import "../styles/viewpage.css";
import Navbar from "../components/navbar";
import { useNavigate } from "react-router-dom";

export default function View() {
  const navigate = useNavigate();

  // Example anime data
  const animeList = [
    { mal_id: 21, src: "https://res.cloudinary.com/dyelgucps/image/upload/v1756806371/luffy_oxunjh.webp", title: "Luffy"},
    { mal_id: 20, src: "https://res.cloudinary.com/dyelgucps/image/upload/v1756806394/narutos_qh81mi.jpg", title: "Naruto" },
    { mal_id: 34134, src: "https://res.cloudinary.com/dyelgucps/image/upload/v1756806399/onepuchman_qic5mu.jpg", title: "One Punch Man" },
    { mal_id: 30694, src: "https://res.cloudinary.com/dyelgucps/image/upload/v1756806349/images_tylvkq.jpg", title: "Dragon Ball" },
    { mal_id: 38000, src: "https://res.cloudinary.com/dyelgucps/image/upload/v1743161350/wanderlust_DEV/dq661oubntbqompo8oh5.jpg", title: "Demon Slayer 1" },
    { mal_id:  40456, src: "https://res.cloudinary.com/dyelgucps/image/upload/v1756806382/demonbg4_vmxnwi.jpg", title: "Demon Slayer 2" },
    { mal_id: 527, src: "https://res.cloudinary.com/dyelgucps/image/upload/v1756806414/pokemon_trdvun.jpg", title: "Pokemon" },
    { mal_id: 966, src: "https://res.cloudinary.com/dyelgucps/image/upload/v1756806534/shinchan_pvlzpp.jpg", title: "Shinchan" },
    { mal_id: 21395, src: "https://res.cloudinary.com/dyelgucps/image/upload/v1756806425/shinm_yvzq7a.jpg", title: "Shin Movie" },
    { mal_id: 205, src: "https://res.cloudinary.com/dyelgucps/image/upload/v1756806432/tomandjerry_hwohzg.jpg", title: "Tom and Jerry" },
    { mal_id: 2471, src: "https://res.cloudinary.com/dyelgucps/image/upload/v1756806291/doraemon_xwdept.jpg", title: "Doraemon" },
  
   
    
  ];
  

  // Handle click to navigate
  const handleAnimeClick = (anime) => {
    navigate(`/info`, { state: { id: anime.mal_id } }); // Pass the anime ID via state
  };

  return (
    <>
      <video autoPlay muted>
        <source src="https://res.cloudinary.com/dyelgucps/video/upload/v1756806533/83274-581386222_medium_qjnygo.mp4" />
      </video>
      <Navbar />

      <h1 className="Nhead">NARUTO</h1>

      <div className="Vcard">
        {animeList.map((anime) => (
          <div key={anime.mal_id}>
            <img
              src={anime.src}
              alt={anime.title}
              onClick={() => handleAnimeClick(anime)} // Pass the clicked anime object
              
                className="anime-img"
            />
          </div>
        ))}
      </div>
    </>
  );
}
