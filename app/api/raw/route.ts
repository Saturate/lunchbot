import { getMenus } from "../../getMenu";

export async function GET(request: Request) {
  const menus = await getMenus();

  return Response.json(menus);
}
