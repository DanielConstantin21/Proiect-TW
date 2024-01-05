import PageNav from "../components/PageNav";
import styles from "./ArtworkPage.module.css";
import Artwork from "../components/Artwork";

export default function ArtworkPage() {
  return (
    <main className={styles.main}>
      <PageNav />

      <section>
        <Artwork />
      </section>
    </main>
  );
}
