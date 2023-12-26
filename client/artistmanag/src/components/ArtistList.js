import React, { useState, useEffect } from "react";
import axios from "axios";

const ArtistList = () => {
  const [artists, setArtists] = useState([]);

  useEffect(() => {
    const fetchArtists = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8080/api/v1/artists"
        );
        setArtists(response.data.artists);
      } catch (error) {
        console.error("Error fetching artists:", error);
      }
    };

    fetchArtists();
  }, [artists, setArtists]);

  return (
    <div>
      <h2>My Favorite Artists</h2>
      <ul>
        {artists.map((artist) => (
          <li key={artist.id}>{artist.title}</li>
        ))}
      </ul>
    </div>
  );
};

export default ArtistList;
