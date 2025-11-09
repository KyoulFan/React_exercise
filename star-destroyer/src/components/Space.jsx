import { useState, useEffect } from "react";
import Star from "./Star";
import styles from "./Space.module.css";

function Space() {
  const STAR_SIZE = 100;
  const [stars, setStars] = useState([]);

  useEffect(() => {
    const intervalId = setInterval(() => {
      const newStar = {
        //id: create random id by every second
        id: `${Date.now()}-${Math.floor(Math.random() * 1000)}`,
        x: Math.random() * (window.innerWidth - STAR_SIZE),
        y: Math.random() * (window.innerHeight - STAR_SIZE),
      };
      setStars((prevStars) => [...prevStars, newStar]);
    }, 2500);
    return () => clearInterval(intervalId);
  }, []);

  function destroyStar(id) {
    setStars(stars.filter((star) => star.id !== id));
  }

  return (
    <div className={styles.space}>
      {stars.map((star) => (
        <Star
          key={star.id}
          id={star.id}
          position={{ x: star.x, y: star.y }}
          destroyStar={destroyStar}
        />
      ))}
    </div>
  );
}
export default Space;
