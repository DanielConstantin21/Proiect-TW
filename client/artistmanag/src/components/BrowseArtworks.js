import React, { useEffect, useState } from "react";
//import axios from "axios";

const BrowseArtworks = () => {
  const [artworks, setArtworks] = useState([]);
  const [pagination, setPagination] = useState({
    total: 0,
    limit: 10, // Set your desired limit
    page: 1,
    totalPages: 0,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `https://api.artic.edu/api/v1/artworks?page=${pagination.page}&limit=${pagination.limit}&fields=id,title,image_id,artist_id`
        );
        const data = await response.json();
        const artworksWithArtistInfo = await Promise.all(
          data.data.map(async (artwork) => {
            // Fetch artist details for each artwork
            const artistResponse = await fetch(
              `https://api.artic.edu/api/v1/artists/${artwork.artist_id}`
            );
            const artistData = await artistResponse.json();
            const artistTitle = artistData.data.title; // Assuming the artist title is available in the API response

            return { ...artwork, artistTitle };
          })
        );
        setArtworks(artworksWithArtistInfo);
        setPagination((prevPagination) => ({
          ...prevPagination,
          total: data.pagination.total,
          totalPages: data.pagination.total_pages,
        }));
      } catch (error) {
        console.error("Error fetching artworks:", error);
      }
    };

    fetchData();
  }, [pagination.page, pagination.limit]);

  const handlePageChange = (newPage) => {
    setPagination((prevPagination) => ({ ...prevPagination, page: newPage }));
  };

  const handleAddToWorks = async (artwork) => {
    try {
      console.log("Adding artwork to works:", artwork);

      // Check if the artist is already in the artists table
      const artistResponse = await fetch(
        `http://localhost:8080/artists/${artwork.artist_id}`
      );
      const artistData = await artistResponse.json();

      if (!artistData.error) {
        // Artist exists, proceed to add artwork to works table
        const response = await fetch("http:://localhost:8080/works", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            id: artwork.id,
            title: artwork.title,
            imageId: artwork.image_id,
            artistId: artistData.data.id, // Send artist data along with the artwork
          }),
        });

        const responseData = await response.json();
        console.log("Artwork added to works:", responseData);
      } else {
        // Artist does not exist, add artist to artists table first
        const addArtistResponse = await fetch("http://localhost:8080/artists", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            id: artistData.data.artist_id,
            title: artistData.data.title,
            birth_date: artistData.data.birth_date,
          }),
        });

        const addedArtistData = await addArtistResponse.json();
        console.log(addedArtistData);
        // Proceed to add artwork to works table with the newly added artist
        const response = await fetch("http://localhost:8080/works", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            artwork,
            artist: addedArtistData.data, // Send added artist data along with the artwork
          }),
        });
        console.log(
          JSON.stringify({
            artwork,
            artist: addedArtistData.data, // Send added artist data along with the artwork
          })
        );
        const responseData = await response.json();
        console.log("Artwork added to works:", responseData);
      }
    } catch (error) {
      console.error("Error adding artwork to works:", error);
    }
  };

  return (
    <div>
      <h2>Artworks</h2>
      <ul>
        {artworks.map((artwork) => (
          <li key={artwork.id}>
            <div className="artwork-card">
              <img
                src={`https://www.artic.edu/iiif/2/${artwork.image_id}/full/200,/0/default.jpg`}
                alt={artwork.title}
              />
            </div>
            <div>
              <p>{artwork.title}</p>
              <p>Artist: {artwork.artistTitle}</p>
              <button onClick={() => handleAddToWorks(artwork)}>
                Add to Works
              </button>
            </div>
          </li>
        ))}
      </ul>
      <div>
        <button
          disabled={pagination.page === 1}
          onClick={() => handlePageChange(pagination.page - 1)}
        >
          Previous Page
        </button>
        <span>
          {" "}
          Page {pagination.page} of {pagination.totalPages}{" "}
        </span>
        <button
          disabled={pagination.page === pagination.totalPages}
          onClick={() => handlePageChange(pagination.page + 1)}
        >
          Next Page
        </button>
      </div>
    </div>
  );
};

export default BrowseArtworks;
