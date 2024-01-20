import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
//import ArtistList from "./ArtistList";

const WorkList = () => {
  const [works, setWorks] = useState([]);
  const [pagination, setPagination] = useState({
    total: 0,
    limit: 10,
    page: 1,
    totalPages: 0,
  });
  useEffect(() => {
    const fetchWorks = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8080/api/v1/works?page=${pagination.page}&limit=${pagination.limit}`
        );
        const data = await response.data;
        setWorks(response.data.works);
        setPagination((prevPagination) => ({
          ...prevPagination,
          total: data.totalItems,
          totalPages: data.totalPages,
        }));
      } catch (error) {
        console.error("Error fetching works:", error);
      }
    };

    fetchWorks();
  }, [works, pagination.page, pagination.limit]);

  const handlePageChange = (newPage) => {
    setPagination((prevPagination) => ({ ...prevPagination, page: newPage }));
  };

  const handleDeleteWork = async (artwork) => {
    try {
      const deleteWorkResponse = await fetch(
        `http://localhost:8080/api/v1/works/${artwork.id}`,
        {
          method: "DELETE",
        }
      );
      const response = await deleteWorkResponse.json();
      if (response.success) {
        console.log(response);
        console.log("Work deleted!");
        alert("Artwork was successfully deleted!");
      }
    } catch (error) {
      console.error("Error deleting work:", error);
    }
  };

  return (
    <div>
      <h2>My Favorite Artworks</h2>
      <ul className="card-container">
        {works.map((work) => (
          <li key={work.id}>
            <div className="artwork-card">
              <button onClick={() => handleDeleteWork(work)}>Delete</button>
              <Link to={`details/${work.id}`}>
                <p>{work.title}</p>
                <img
                  src={`https://www.artic.edu/iiif/2/${work.imageId}/full/843,/0/default.jpg`}
                  alt="Artwork"
                />
              </Link>
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

export default WorkList;
