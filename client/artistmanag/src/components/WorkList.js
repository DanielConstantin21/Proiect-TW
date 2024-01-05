import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
//import ArtistList from "./ArtistList";

const WorkList = () => {
  const [works, setWorks] = useState([]);

  useEffect(() => {
    const fetchWorks = async () => {
      try {
        const response = await axios.get("http://localhost:8080/api/v1/works");
        setWorks(response.data.works);
      } catch (error) {
        console.error("Error fetching works:", error);
      }
    };

    fetchWorks();
  }, [works]);

  return (
    <div>
      <h2>My Favorite Artworks</h2>
      <ul className="card-container">
        {works.map((work) => (
          <li key={work.id}>
            <Link to={`details/${work.id}`}>
              <div className="artwork-card">
                <p>{work.title}</p>
                <img
                  src={`https://www.artic.edu/iiif/2/${work.imageId}/full/843,/0/default.jpg`}
                  alt="Artwork"
                />
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default WorkList;
