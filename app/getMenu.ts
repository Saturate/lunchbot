import { isToday, format } from "date-fns";
import { da } from "date-fns/locale";
import { DayMenu, MenuId } from "../types/menu";

const MEYERS_URL =
  "https://meyers.dk/erhverv/frokostordning/det-velkendte/";

export const menus: Record<MenuId, { name: string }> = {
  "det-velkendte": { name: "Det velkendte" },
  "den-groenne": { name: "Den Grønne" },
};

interface NuxtArray extends Array<NuxtVal> {}
interface NuxtObject extends Record<string, NuxtVal> {}

type NuxtVal = string | number | boolean | null | NuxtArray | NuxtObject;

const REACTIVE_MARKERS = new Set([
  "ShallowReactive",
  "Reactive",
  "ShallowRef",
  "Ref",
]);

function resolveRef(
  arr: unknown[],
  idx: number,
  depth = 0,
  seen = new Set<number>()
): NuxtVal {
  if (depth > 60 || seen.has(idx) || idx >= arr.length) return null;

  const next = new Set(seen);
  next.add(idx);

  const val = arr[idx];

  if (
    val === null ||
    val === undefined ||
    typeof val === "string" ||
    typeof val === "boolean" ||
    typeof val === "number"
  )
    return val ?? null;

  if (Array.isArray(val)) {
    if (
      val.length === 2 &&
      typeof val[0] === "string" &&
      REACTIVE_MARKERS.has(val[0]) &&
      typeof val[1] === "number"
    ) {
      return resolveRef(arr, val[1], depth + 1, next);
    }
    return val.map((el) =>
      typeof el === "number" ? resolveRef(arr, el, depth + 1, next) : el
    );
  }

  if (typeof val === "object") {
    const result: Record<string, NuxtVal> = {};
    for (const [k, v] of Object.entries(val as Record<string, unknown>)) {
      result[k] =
        typeof v === "number"
          ? resolveRef(arr, v, depth + 1, next)
          : (v as NuxtVal);
    }
    return result;
  }

  return null;
}

interface FoodopAllergen {
  containment: string | null;
  names: { da: string };
}

interface FoodopDish {
  names: { da: string };
  allergens: FoodopAllergen[];
}

interface FoodopSection {
  names: { da: string };
  menu_dishes: FoodopDish[];
}

interface FoodopDay {
  date: string;
  menu_sections: FoodopSection[];
  names: { da: string };
}

interface FoodopEntry {
  menus: FoodopDay[];
}

function extractNuxtData(html: string): unknown[] {
  const match = html.match(
    /<script[^>]*id="__NUXT_DATA__"[^>]*>([\s\S]*?)<\/script>/
  );
  if (!match) throw new Error("Could not find __NUXT_DATA__ in page");
  return JSON.parse(match[1]);
}

function extractFoodopMenus(arr: unknown[]): FoodopEntry[] {
  for (const item of arr) {
    if (
      typeof item === "object" &&
      item !== null &&
      !Array.isArray(item) &&
      "foodop-menus" in item
    ) {
      const idx = (item as Record<string, number>)["foodop-menus"];
      return resolveRef(arr, idx) as unknown as FoodopEntry[];
    }
  }
  throw new Error("Could not find foodop-menus in Nuxt data");
}

function parseLocalDate(iso: string): Date {
  const [year, month, day] = iso.split("-").map(Number);
  return new Date(year, month - 1, day);
}

export async function getMenu(menuId: MenuId): Promise<DayMenu[]> {
  const response = await fetch(MEYERS_URL, {
    next: { revalidate: 14400 },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch menu page: ${response.status}`);
  }

  const html = await response.text();
  const nuxtArr = extractNuxtData(html);
  const entries = extractFoodopMenus(nuxtArr);

  if (!entries?.length) {
    throw new Error("No menu entries found");
  }

  const menuName = menus[menuId].name;

  return entries[0].menus
    .filter((day) => day.names?.da === menuName)
    .map((day) => {
      const date = parseLocalDate(day.date);

      return {
        menuId,
        menuName,
        id: day.date,
        dateFormatted: format(date, "EEEE d. MMMM yyyy", { locale: da }),
        date,
        today: isToday(date),
        menuSections: day.menu_sections.map((section) => ({
          title: section.names.da,
          menuItems: section.menu_dishes.map((dish) => ({
            item: dish.names.da,
            allergens: dish.allergens
              .filter((a) => a.containment === "contains")
              .map((a) => a.names.da)
              .join(", "),
          })),
        })),
      };
    })
    .sort((a, b) => a.date.getTime() - b.date.getTime());
}

export async function getMenus() {
  return {
    "det-velkendte": await getMenu("det-velkendte"),
    "den-groenne": await getMenu("den-groenne"),
  };
}
