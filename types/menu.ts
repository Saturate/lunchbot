export interface MenuItem {
  item: string;
  allergens: string;
}

export interface MenuSection {
  title: string;
  menuItems: MenuItem[];
}

export interface DayMenu {
  menuId: MenuId;
  menuName: string;
  id: string | null | undefined;
  dateFormatted: string | null | undefined;
  date: Date;
  today: boolean;
  menuSections: MenuSection[];
}

export type MenuId = "det-velkendte" | "den-groenne";
