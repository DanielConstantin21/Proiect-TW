import PageNav from "../components/PageNav";
import styles from "./Homepage.module.css";
import Collection from "../components/WorkList";

export default function CollectionPage() {
  return (
    <main className={styles.homepage}>
      <PageNav />
      <section>
        <Collection />
      </section>
    </main>
  );
}
