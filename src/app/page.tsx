import type { Metadata } from "next";
import Image from "next/image";
import styles from "./maintenance.module.css";

export const metadata: Metadata = {
  title: "Website Maintenance",
  description:
    "Gholzad.com is being updated. For business enquiries, please get in touch by email.",
  alternates: { canonical: "/" },
  openGraph: {
    title: "Website Maintenance | Ajmal Gholzad",
    description: "Gholzad.com is being updated. We'll be back soon.",
    url: "https://www.gholzad.com",
  },
};

export default function Home() {
  return (
    <main className={styles.page}>
      <div className={styles.glow} aria-hidden="true" />

      <div className={styles.frame}>
        <header className={styles.header}>
          <div className={styles.brand} aria-label="Gholzad">
            <Image src="/images/logo/gholzad-logo.svg" alt="" width={42} height={42} priority />
            <span>GHOLZAD</span>
          </div>
          <span className={styles.status}><span aria-hidden="true" />Site update in progress</span>
        </header>

        <div className={styles.content}>
          <p className={styles.eyebrow}>A new chapter is coming</p>
          <h1>We&apos;re building<br /><span>what&apos;s next.</span></h1>
          <p className={styles.description}>
            Our website is undergoing maintenance while we prepare a new experience.
            We&apos;ll be back soon. For business enquiries, we&apos;re still here to talk.
          </p>
          <a className={styles.contact} href="mailto:ajmal@gholzad.com">
            Get in touch <span aria-hidden="true">↗</span>
          </a>
        </div>

        <footer className={styles.footer}>
          <span>Gholzad Management Group</span>
          <span>Building across borders</span>
        </footer>
      </div>
    </main>
  );
}
