import styles from "./MenuSection.module.css";
import { MenuSection as MenuSectionType } from "../types/menu";

interface MenuSectionProps {
  menu: MenuSectionType;
}

export default function MenuSection({ menu }: MenuSectionProps) {
  return (
    <div className={styles.section}>
      <h4 className={styles.header}>{menu.title}</h4>
      {menu.menuItems.map(({ item, allergens }) => {
        return (
          <p key={item}>
            {item}
            {allergens ? (
              <span className={styles.allergens}>{allergens}</span>
            ) : null}
          </p>
        );
      })}
    </div>
  );
}
