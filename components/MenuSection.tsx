import styles from "./MenuSection.module.css";

export default function MenuSection({ menu }) {
  return (
    <>
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
    </>
  );
}
