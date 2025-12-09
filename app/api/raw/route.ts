import { getMenus } from "../../getMenu";

export async function GET(_request: Request) {
  const menus = await getMenus();

  return Response.json(menus, {
    headers: {
      "Cache-Control": "public, s-maxage=14400, stale-while-revalidate=3600",
    },
  });
}
