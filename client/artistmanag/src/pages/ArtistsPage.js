import PageNav from "../components/PageNav";
import styles from "./Homepage.module.css";
import ArtistList from "../components/ArtistList";

export default function ArtistsPage() {
  return (
    <main className={styles.homepage}>
      <PageNav />

      <section>
        <ArtistList />
      </section>
    </main>
  );
}
