import { parse } from "node-html-parser";
import unencodehtml from "./unencodehtml";

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
        '[aria-labelledby="' + day.getAttribute("id") + '"]'
      );

      const menuSections = dayHtml
        .querySelectorAll(".menu-recipe-display")
        .map((display) => {
          return {
            title: unencodehtml(
              display.querySelector(".menu-recipe-display__title").innerText
            ),
            content: unencodehtml(
              display.querySelector(".menu-recipe-display__description")
                .innerText
            ),
          };
        });

      return {
        id: day.getAttribute("id"),
        date: day.getAttribute("aria-label"),
        menuSections: menuSections,
      };
    });

  console.log(menuDays);

  return days;
}
