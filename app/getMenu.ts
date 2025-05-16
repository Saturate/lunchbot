import { parse } from "node-html-parser";
import unencodehtml from "./unencodehtml";
import { parse as parseDate, formatRelative, subDays, isToday } from "date-fns";
import { da } from "date-fns/locale";

function parseMeyerDate(date) {
  // 23 maj, 2025
  return parseDate(date, "dd LLL, yyyy", new Date(), { locale: da });
}

export async function getMenu() {
  const response = await fetch(
    "https://meyers.dk/erhverv/frokostordning/det-velkendte/"
  ).then((response) => {
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
          '"] [data-tab-content="Det velkendte"]'
      );

      const menuSections = dayHtml
        .querySelectorAll(".menu-recipe-display")
        .map((display) => {
          const allergens = unencodehtml(
            display.querySelector(
              '.menu-recipe-display__description span[ng-if="showAllergens"]'
            )?.innerText
          );

          // Remove allergens elements from HTML
          display
            .querySelectorAll('[ng-if="showAllergens"]')
            .forEach((x) => x.remove());

          return {
            title: unencodehtml(
              display.querySelector(".menu-recipe-display__title").innerText
            ),
            content: unencodehtml(
              display.querySelector(".menu-recipe-display__description")
                .innerText
            ),
            allergens: allergens,
          };
        });

      const menuDate = parseMeyerDate(day.getAttribute("aria-label"));

      return {
        id: day.getAttribute("id"),
        dateFormatted: day.getAttribute("aria-label"),
        date: menuDate,
        today: isToday(menuDate),
        menuSections: menuSections,
      };
    });

  console.log(menuDays);

  return days;
}
