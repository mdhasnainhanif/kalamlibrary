import type { ReactNode } from "react";
import styles from "@/app/admin/admin.module.css";

type Props = {
  title: string;
  description?: string;
  action?: ReactNode;
};

export default function AdminPageHeader({ title, description, action }: Props) {
  return (
    <header className={styles.pageHeader}>
      <div>
        <h1 className={styles.pageTitle}>{title}</h1>
        {description ? <p className={styles.pageDesc}>{description}</p> : null}
      </div>
      {action ? <div>{action}</div> : null}
    </header>
  );
}
