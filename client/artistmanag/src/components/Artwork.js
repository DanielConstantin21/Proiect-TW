import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import styles from "./Artwork.module.css";
const Artwork = () => {
  const { id } = useParams();

  const [work, setWork] = useState({});
  useEffect(() => {
    const fetchWork = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8080/api/v1/works/${id}`
        );
        setWork(response.data);
        console.log("Raspunsul: " + response);
      } catch (error) {
        console.error("Error fetching works:", error);
      }
    };

    fetchWork();
  }, []);

  console.log(work);

  return (
    <div>
      <h1>{work.title}</h1>
      <div className={styles.artwork} key={work.id}>
        <div className={styles.artwork}>
          <img
            src={`https://www.artic.edu/iiif/2/${work.imageId}/full/843,/0/default.jpg`}
            alt="Artwork"
          />
        </div>
      </div>
    </div>
  );
};

export default Artwork;
