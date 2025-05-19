import { parse } from "node-html-parser";
import unencodehtml from "./unencodehtml";
import { parse as parseDate, formatRelative, subDays, isToday } from "date-fns";
import { da } from "date-fns/locale";
import parseDescription from "./utils/parseDescription";

function parseMeyerDate(date) {
  // 23 maj, 2025
  return parseDate(date, "dd LLL, yyyy", new Date(), { locale: da });
}

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
  const menuDays = menuHtml.querySelectorAll(".week-menu-day__days");
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
          const allergens = unencodehtml(
            display.querySelector(
              '.menu-recipe-display__description span[ng-if="showAllergens"]'
            )?.innerText
          );

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
