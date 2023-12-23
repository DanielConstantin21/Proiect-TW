import React, { useState, useEffect } from "react";
import axios from "axios";

const ArtistList = () => {
  const [artists, setArtists] = useState([]);

  useEffect(() => {
    const fetchArtists = async () => {
      try {
        const response = await axios.get("http://localhost:8080/artists");
        setArtists(response.data);
      } catch (error) {
        console.error("Error fetching artists:", error);
      }
    };

    fetchArtists();
  }, []);

  return (
    <div>
      <h2>Artists</h2>
      <ul>
        {artists.map((artist) => (
          <li key={artist.id}>{artist.title}</li>
        ))}
      </ul>
    </div>
  );
};

export default ArtistList;
