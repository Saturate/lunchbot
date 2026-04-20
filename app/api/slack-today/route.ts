import { getDay } from "date-fns";
import { revalidatePath } from "next/cache";
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

function descriptionDisplay(
  menuItems: Awaited<
    ReturnType<typeof getMenu>
  >[0]["menuSections"][0]["menuItems"],
) {
  return menuItems.map((items) => removeLineBreaks(items.item)).join("\n");
}

export async function GET(_request: Request) {
  try {
    revalidatePath("/");

    const menu = await getMenu("det-velkendte");
    const todaysMenu = menu.find((day) => day.today);

    if (!todaysMenu) {
      return Response.json(
        { error: "No menu found for today" },
        { status: 404 },
      );
    }

    // Validate menu structure before accessing
    if (!todaysMenu.menuSections || todaysMenu.menuSections.length < 4) {
      return Response.json(
        { error: "Menu structure is incomplete" },
        { status: 500 },
      );
    }

    const payload = {
      dayTitle:
        todaysMenu.dateFormatted +
        (isWednesday(new Date()) ? " (Vegetarisk menu)" : ""),
      menuName: todaysMenu.menuName,
      hotDishTitle: removeLineBreaks(todaysMenu.menuSections[0].title),
      hotDishDescription: descriptionDisplay(
        todaysMenu.menuSections[0].menuItems,
      ),
      hotDishAllergens: "",

      deliTitle: removeLineBreaks(todaysMenu.menuSections[1].title),
      deliDescription: descriptionDisplay(todaysMenu.menuSections[1].menuItems),
      deliAllergens: "",

      salatTitle: removeLineBreaks(todaysMenu.menuSections[2].title),
      salatDescription: descriptionDisplay(
        todaysMenu.menuSections[2].menuItems,
      ),
      salatAllergens: "",

      breadTitle: removeLineBreaks(todaysMenu.menuSections[3].title),
      breadDescription: descriptionDisplay(
        todaysMenu.menuSections[3].menuItems,
      ),
      breadAllergens: "",
    };

    if (process.env.SLACK_WEBHOOK) {
      await sendSlackMessage(process.env.SLACK_WEBHOOK, payload);
    } else {
      console.warn("SLACK_WEBHOOK not configured, skipping Slack notification");
    }

    return Response.json(payload, {
      headers: {
        "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=1800",
      },
    });
  } catch (error) {
    console.error("Error in slack-today route:", error);
    return Response.json(
      {
        error: "Failed to process menu",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}
