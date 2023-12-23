import React, { useState, useEffect } from "react";
import axios from "axios";

const WorkList = () => {
  const [works, setWorks] = useState([]);

  useEffect(() => {
    const fetchWorks = async () => {
      try {
        const response = await axios.get("http://localhost:8080/works");
        setWorks(response.data);
      } catch (error) {
        console.error("Error fetching works:", error);
      }
    };

    fetchWorks();
  }, []);

  return (
    <div>
      <h2>Works</h2>
      <ul>
        {works.map((work) => (
          <li key={work.id}>
            <div className="work-card">
              {work.title} -{" "}
              <img
                src={`https://www.artic.edu/iiif/2/${work.imageId}/full/200,/0/default.jpg`}
                alt="Work"
              />
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default WorkList;
