import { getDay } from "date-fns";
import { getMenu } from "../../getMenu";
import { revalidatePath } from "next/cache";

type SlackPayload = {
  dayTitle: string;
  hotDishTitle: string;
  hotDishDescription: string;
  hotDishAllergens: string;
  deliTitle: string;
  deliDescription: string;
  deliAllergens: string;
  salatTitle: string;
  salatDescription: string;
  salatAllergens: string;
  breadTitle: string;
  breadDescription: string;
  breadAllergens: string;
};

async function sendSlackMessage(webhookUrl: string, payload: SlackPayload) {
  try {
    const response = await fetch(webhookUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.status} ${response.statusText}`);
    }

    console.log("Message sent successfully");
  } catch (error) {
    console.error("Failed to send message:", error);
  }
}

function removeLineBreaks(string: string) {
  return string.replace(/\s+/g, " ").trim();
}

function isWednesday(date: Date): boolean {
  return getDay(date) === 3;
}

function descriptionDisplay(
  menuItems: Awaited<
    ReturnType<typeof getMenu>
  >[0]["menuSections"][0]["menuItems"]
) {
  return menuItems.map((items) => removeLineBreaks(items.item)).join("\n");
}

function allergensDisplay(
  menuItems: Awaited<
    ReturnType<typeof getMenu>
  >[0]["menuSections"][0]["menuItems"]
) {
  return menuItems.map((items) => removeLineBreaks(items.allergens)).join("\n");
}

export async function GET(request: Request) {
  revalidatePath("/");

  const menu = await getMenu("det-velkendte");
  const menuTwo = await getMenu("den-groenne");

  const todaysMenu = isWednesday(new Date())
    ? menuTwo.find((day) => day.today)
    : menu.find((day) => day.today);

  const payload = {
    dayTitle: todaysMenu.dateFormatted,
    menuName: todaysMenu.menuName,
    hotDishTitle: removeLineBreaks(todaysMenu.menuSections[0].title),
    hotDishDescription: descriptionDisplay(
      todaysMenu.menuSections[0].menuItems
    ),
    hotDishAllergens: undefined,

    deliTitle: removeLineBreaks(todaysMenu.menuSections[1].title),
    deliDescription: descriptionDisplay(todaysMenu.menuSections[1].menuItems),
    deliAllergens: undefined,

    salatTitle: removeLineBreaks(todaysMenu.menuSections[2].title),
    salatDescription: descriptionDisplay(todaysMenu.menuSections[2].menuItems),
    salatAllergens: undefined,

    breadTitle: removeLineBreaks(todaysMenu.menuSections[3].title),
    breadDescription: descriptionDisplay(todaysMenu.menuSections[3].menuItems),
    breadAllergens: undefined,
  };

  sendSlackMessage(process.env.SLACK_WEBHOOK, payload);

  return Response.json(payload);
}
