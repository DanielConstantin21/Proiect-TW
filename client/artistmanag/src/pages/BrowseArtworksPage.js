import PageNav from "../components/PageNav";
import styles from "./Homepage.module.css";
import BrowseArtworks from "../components/BrowseArtworks";
export default function BrowseArtworksPage() {
  return (
    <main className={styles.homepage}>
      <PageNav />

      <section>
        <BrowseArtworks />
      </section>
    </main>
  );
}
