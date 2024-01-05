import { Link } from "react-router-dom";
import PageNav from "../components/PageNav";
import styles from "./Homepage.module.css";

export default function Homepage() {
  return (
    <main className={styles.homepage}>
      <PageNav />

      <section>
        <h1>
          You love art
          <br />
          We keep your favorite artworks in one place
        </h1>
        <h2>
          Browse Cicago Art Institute Collection and make your personal
          collection of artists and artworks.
        </h2>
      </section>
    </main>
  );
}
