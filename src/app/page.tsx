'use client'
import styles from "./page.module.scss";
import Todo from "../components/todo/Todo";

export default function Home() {
  return (
    <main className={styles.main}>
      <Todo />
    </main>
  );
}
