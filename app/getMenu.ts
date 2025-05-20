import { parse } from "node-html-parser";
import unencodehtml from "../utils/unencodehtml";
import { isToday } from "date-fns";
import parseDescription from "../utils/parseDescription";
import parseMeyerDate from "../utils/parseMeyerDate";

export const menus = {
  "det-velkendte": {
    url: "https://meyers.dk/erhverv/frokostordning/det-velkendte/",
    contentTab: "Det velkendte",
  },
  "den-groenne": {
    url: "https://meyers.dk/erhverv/frokostordning/den-groenne/",
    contentTab: "Den Grønne",
  },
};

export async function getMenu(menuId: keyof typeof menus) {
  const response = await fetch(menus[menuId].url).then((response) => {
    return response.text();
  });

  const root = parse(response);

  const menuHtml = root?.querySelector(".week-menu");
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

      const menuSections = dayHtml
        .querySelectorAll(".menu-recipe-display")
        .map((display) => {
          const description = display.querySelector(
            ".menu-recipe-display__description"
          );

          return {
            title: unencodehtml(
              display.querySelector(".menu-recipe-display__title").innerText
            ),
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
    });

  return days;
}

export async function getMenus() {
  return {
    "det-velkendte": await getMenu("det-velkendte"),
    "den-groenne": await getMenu("den-groenne"),
  };
}
