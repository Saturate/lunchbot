import parse from "node-html-parser";
import parseDescription from "./parseDescription";
import { expect, test } from "vitest";

test("Parses common bread section ", () => {
  const root = parse(`   
        <p class="menu-recipe-display__description allan">
Økologisk rugbrød                                                                        <!-- ngIf: showAllergens --><br ng-if="showAllergens" class="ng-scope"><!-- end ngIf: showAllergens --><!-- ngIf: showAllergens --><span ng-if="showAllergens" style="color: gray; font-size: 10px;" class="ng-scope">(hvede (glutenholdigt korn))</span><!-- end ngIf: showAllergens -->
                                                                    <br>
Økologisk gulerodsbrød                                                                        <!-- ngIf: showAllergens --><br ng-if="showAllergens" class="ng-scope"><!-- end ngIf: showAllergens --><!-- ngIf: showAllergens --><span ng-if="showAllergens" style="color: gray; font-size: 10px;" class="ng-scope">(hvede (glutenholdigt korn))</span><!-- end ngIf: showAllergens -->
                                                                    <br>
                                                            </p>`);

  const parsed = parseDescription(
    root.querySelector(".menu-recipe-display__description")
  );
  expect(parsed).toMatchObject([
    {
      item: "Økologisk rugbrød",
      allergens: "(hvede (glutenholdigt korn))",
    },
    {
      item: "Økologisk gulerodsbrød",
      allergens: "(hvede (glutenholdigt korn))",
    },
  ]);
});

test("Parses common salat section ", () => {
  const root = parse(`<p class="menu-recipe-display__description">
Bagte kålrabi med agurker, grønne æbler, rødløg, bønnespirer, ananas og tamarind. Toppet med ristet sort sesam                                                                    <br>
Gule nudler med gulerødder, pack choi, hvidkål og forårsløg vendt med chili og soja                                                                        <!-- ngIf: showAllergens --><br ng-if="showAllergens" class="ng-scope"><!-- end ngIf: showAllergens --><!-- ngIf: showAllergens --><span ng-if="showAllergens" style="color: gray; font-size: 10px;" class="ng-scope">(hvede (glutenholdigt korn))</span><!-- end ngIf: showAllergens -->
                                                                    <br>
Lynsyltet gulerødder med knuste peanuts og karse                                                                        <!-- ngIf: showAllergens --><br ng-if="showAllergens" class="ng-scope"><!-- end ngIf: showAllergens --><!-- ngIf: showAllergens --><span ng-if="showAllergens" style="color: gray; font-size: 10px;" class="ng-scope">(nødder)</span><!-- end ngIf: showAllergens -->
                                                                    <br>
                                                            </p>`);

  const parsed = parseDescription(
    root.querySelector(".menu-recipe-display__description")
  );
  expect(parsed).toMatchObject([
    {
      item: "Bagte kålrabi med agurker, grønne æbler, rødløg, bønnespirer, ananas og tamarind. Toppet med ristet sort sesam",
      allergens: "",
    },
    {
      item: "Gule nudler med gulerødder, pack choi, hvidkål og forårsløg vendt med chili og soja",
      allergens: "(hvede (glutenholdigt korn))",
    },
    {
      item: "Lynsyltet gulerødder med knuste peanuts og karse",
      allergens: "(nødder)",
    },
  ]);
});
