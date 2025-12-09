import { parse } from "node-html-parser";
import unencodehtml from "../utils/unencodehtml";
import { isToday } from "date-fns";
import parseDescription from "../utils/parseDescription";
import parseMeyerDate from "../utils/parseMeyerDate";
import { DayMenu, Menus } from "../types/menu";

export const menus: Menus = {
  "det-velkendte": {
    url: "https://meyers.dk/erhverv/frokostordning/det-velkendte/",
    contentTab: "Det velkendte",
  },
  "den-groenne": {
    url: "https://meyers.dk/erhverv/frokostordning/den-groenne/",
    contentTab: "Den Grønne",
  },
};

export async function getMenu(menuId: keyof typeof menus): Promise<DayMenu[]> {
  const response = await fetch(menus[menuId].url, {
    next: { revalidate: 14400 }
  }).then((response) => {
    return response.text();
  });

  const root = parse(response);

  const menuHtml = root?.querySelector(".week-menu");

  if (!menuHtml) {
    throw new Error("Could not find menu HTML on the page");
  }

  const days = menuHtml
    .querySelectorAll(".week-menu-day__header li h5")
    .map((day) => {
      const dayHtml = menuHtml.querySelector(
        '[aria-labelledby="' +
          day.getAttribute("id") +
          '"] [data-tab-content="' +
          menus[menuId].contentTab +
          '"]'
      );

      if (!dayHtml) {
        return null;
      }

      const menuSections = dayHtml
        .querySelectorAll(".menu-recipe-display")
        .map((display) => {
          const titleElement = display.querySelector(".menu-recipe-display__title");
          const description = display.querySelector(
            ".menu-recipe-display__description"
          );

          return {
            title: unencodehtml(titleElement?.innerText || ""),
            menuItems: parseDescription(description),
          };
        });

      const menuDate = parseMeyerDate(day.getAttribute("aria-label"));

      return {
        menuId: menuId,
        menuName: menus[menuId].contentTab,
        id: day.getAttribute("id"),
        dateFormatted: day.getAttribute("aria-label"),
        date: menuDate,
        today: isToday(menuDate),
        menuSections: menuSections,
      };
    })
    .filter((day) => day !== null) as DayMenu[];

  return days;
}

export async function getMenus() {
  return {
    "det-velkendte": await getMenu("det-velkendte"),
    "den-groenne": await getMenu("den-groenne"),
  };
}
