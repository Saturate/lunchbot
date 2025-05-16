import { getDay } from "date-fns";
import { getMenu } from "../../getMenu";

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

export async function GET(request: Request) {
  const menu = await getMenu("det-velkendte");
  const menuTwo = await getMenu("den-groenne");

  const todaysMenu = isWednesday(new Date())
    ? menuTwo.find((day) => day.today)
    : menu.find((day) => day.today);

  const payload = {
    dayTitle: todaysMenu.dateFormatted,

    hotDishTitle: removeLineBreaks(todaysMenu.menuSections[0].title),
    hotDishDescription: removeLineBreaks(todaysMenu.menuSections[0].content),
    hotDishAllergens: removeLineBreaks(todaysMenu.menuSections[0].allergens),

    deliTitle: removeLineBreaks(todaysMenu.menuSections[1].title),
    deliDescription: removeLineBreaks(todaysMenu.menuSections[1].content),
    deliAllergens: removeLineBreaks(todaysMenu.menuSections[1].allergens),

    salatTitle: removeLineBreaks(todaysMenu.menuSections[2].title),
    salatDescription: removeLineBreaks(todaysMenu.menuSections[2].content),
    salatAllergens: removeLineBreaks(todaysMenu.menuSections[2].allergens),

    breadTitle: removeLineBreaks(todaysMenu.menuSections[3].title),
    breadDescription: removeLineBreaks(todaysMenu.menuSections[3].content),
    breadAllergens: removeLineBreaks(todaysMenu.menuSections[3].allergens),
  };

  sendSlackMessage(
    "https://hooks.slack.com/triggers/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",
    payload
  );

  return Response.json(payload);
}
