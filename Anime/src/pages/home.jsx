import React, { useState, useRef } from 'react';
import '../styles/home.css';
import Navbar from '../components/navbar';
import Api from "../components/api";
import { useNavigate } from "react-router-dom";

const App = () => {
  const navigate = useNavigate();
  const [sliderItems, setSliderItems] = useState([
    {mal_id: 30694, src: 'https://res.cloudinary.com/dyelgucps/image/upload/v1756806414/goku_uwdedv.jpg', title: 'ANIME', type: 'DRAGON BALL', description: ' Seven years after the defeat of Majin Buu, Earth is at peace, and its people live free from any dangers lurking in the universe.' },
    { mal_id: 38000, src: 'https://res.cloudinary.com/dyelgucps/image/upload/v1756806312/demonbg_nmxq20.jpg', title: 'ANIME', type: 'DEMON SLAYER', description: " Ever since the death of his father, the burden of supporting the family has fallen upon Tanjirou Kamado's shoulders. Though living impoverished on a remote mountain. " },
    { mal_id: 21, src: 'https://res.cloudinary.com/dyelgucps/image/upload/v1756806384/luffybg_amjrdh.jpg', title: 'ANIME', type: 'ONE PIECE', description: 'Barely surviving in a barrel after passing through a terrible whirlpool at sea, carefree Monkey D. Luffy ends up aboard a ship under attack by fearsome pirates. ' },
    { mal_id: 20, src: 'https://res.cloudinary.com/dyelgucps/image/upload/v1756806393/narutobg_t924ib.jpg', title: 'ANIME', type: 'NARUTO', description: ' It has been two and a half years since Naruto Uzumaki left Konohagakure, the Hidden Leaf Village, for intense training following events which fueled his desire to be stronger. ' }
  ]);

  const [currentBackground, setCurrentBackground] = useState(sliderItems[0]);
  const sliderRef = useRef(null);

  const moveSlider = (direction) => {
    setSliderItems((prev) => {
      let updatedItems;
      if (direction === 'next') {
        updatedItems = [...prev.slice(1), prev[0]];
      } else {
        updatedItems = [prev[prev.length - 1], ...prev.slice(0, prev.length - 1)];
      }
      setCurrentBackground(updatedItems[0]); // Update background based on the new first item
      return updatedItems;
    });

    sliderRef.current.classList.add(direction);
    sliderRef.current.addEventListener(
      'animationend',
      () => {
        sliderRef.current.classList.remove(direction);
      },
      { once: true }
    );
  };

  const handleThumbnailClick = (item) => {
    const index = sliderItems.findIndex((slide) => slide.id === item.mal_id);
    const reorderedItems = [...sliderItems.slice(index), ...sliderItems.slice(0, index)];
    setSliderItems(reorderedItems);
    setCurrentBackground(item);
  };
 
  const handleAnimeClick = (anime) => {
    navigate(`/info`, { state: { id: anime.mal_id } }); // Pass the anime ID via state
  };

  return (
    <>
    <div
      style={{
        backgroundImage: `url(${currentBackground.src})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        marginTop:"5rem"
      }}
    >
    <Navbar/>

    <div className="slider" ref={sliderRef}>
  <div className="list">
    {sliderItems.map((item, index) => (
      <div className="item" key={item.mal_id}>
        <img src={item.src} alt="" />
        <div className="content">
          <div className="title">{item.title}</div>
          <div className="type">{item.type}</div>
          <div className="description">{item.description}</div>
          <div className="button" onClick={() => handleAnimeClick(item)}>
            <button>SEE MORE</button>
          </div>
        </div>
      </div>
          ))}
        </div>
      
        <div className="thumbnail">
  {sliderItems
    .filter((item) => item.mal_id !== currentBackground.mal_id) // Exclude the current background
    .map((item) => (
      <div
        key={item.mal_id}
        className="item"
        onClick={() => handleThumbnailClick(item)}
      >
        <img src={item.src} alt={`Thumbnail ${item.mal_id}`} />
      </div>
    ))}
</div>
        <div className="nextPrevArrows">
          <button className="prev" onClick={() => moveSlider('prev')}>&lt;</button>
          <button className="next" onClick={() => moveSlider('next')}>&gt;</button>
        </div>
      </div>
      
    </div>
    
    <Api/>
    </>
  );
};

export default App;


