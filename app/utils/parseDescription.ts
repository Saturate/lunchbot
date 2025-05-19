import { HTMLElement } from "node-html-parser";
import unencodehtml from "../unencodehtml";

type MenuItems = { item: string; allergens: string }[] | undefined;

export default function parseDescription(menuNode: HTMLElement): MenuItems {
  const menuItems = [];
  menuNode.childNodes.forEach((innerNode, index, arr) => {
    if (innerNode.nodeType === 3 && innerNode.innerText.trim() !== "") {
      const siblingNodesAfter = menuNode.childNodes.slice(
        index + 1,
        arr.length
      );

      // Find the next allergen node, or break on finding a new menu item node
      let allergens = undefined;
      for (let i = 0; i < siblingNodesAfter.length; i++) {
        if (siblingNodesAfter[i].nodeType === 3) {
          break;
        }
        if (
          siblingNodesAfter[i].innerText.trim() !== "" &&
          siblingNodesAfter[i].nodeType === 1
        ) {
          allergens = siblingNodesAfter[i].innerText.trim();
          break;
        }
      }

      menuItems.push({
        item: unencodehtml(innerNode.innerText.trim()),
        allergens: allergens ? unencodehtml(allergens) : allergens,
      });
    }
  });

  return menuItems;
}
