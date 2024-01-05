import { NavLink } from "react-router-dom";
import styles from "./PageNav.module.css";

function PageNav() {
  return (
    <nav className={styles.nav}>
      <ul>
        <li>
          <NavLink to="/">Home</NavLink>
        </li>
        <li>
          <NavLink to="/browse">Browse Artworks</NavLink>
        </li>
        <li>
          <NavLink to="/artists">My Artists</NavLink>
        </li>
        <li>
          <NavLink to="/collection">My Collection</NavLink>
        </li>
      </ul>
    </nav>
  );
}

export default PageNav;
