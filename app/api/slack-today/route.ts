import { getMenu } from "../../getMenu";

/**
 * 
 *  const payload = {
    text: "Danny Torrence left a 1 star review for your property.",
    blocks: [
      {
        type: "section",
        text: {
          type: "mrkdwn",
          text: "Danny Torrence left the following review for your property:",
        },
      },
      {
        type: "section",
        block_id: "section567",
        text: {
          type: "mrkdwn",
          text: "<https://example.com|Overlook Hotel> \n :star: \n Doors had too many axe holes, guest in room 237 was far too rowdy, whole place felt stuck in the 1920s.",
        },
        accessory: {
          type: "image",
          image_url:
            "https://is5-ssl.mzstatic.com/image/thumb/Purple3/v4/d3/72/5c/d3725c8f-c642-5d69-1904-aa36e4297885/source/256x256bb.jpg",
          alt_text: "Haunted hotel image",
        },
      },
      {
        type: "section",
        block_id: "section789",
        fields: [
          {
            type: "mrkdwn",
            text: "*Average Rating*\n1.0",
          },
        ],
      },
    ],
  };

 */

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

export async function GET(request: Request) {
  const menu = await getMenu();

  const todaysMenu = menu.find((day) => day.today);

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
