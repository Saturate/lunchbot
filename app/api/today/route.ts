import { getMenu } from "../../getMenu";

export async function GET(request: Request) {
  const menu = await getMenu();

  return Response.json(menu.filter((day) => day.today));
}
