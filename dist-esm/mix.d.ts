import { Type, Ingredient, ProductPossibility } from './Types';
export declare function mix(item1: Ingredient, item2: Ingredient, item3: Ingredient, item4: Ingredient): ProductPossibility[];
export declare function mixAccordingToStandardRecipe(item1: Ingredient, item2: Ingredient, item3: Ingredient, item4: Ingredient): ProductPossibility[];
export declare function standardRecipe(type: Type, score: number): ProductPossibility[];
export declare function mixAccordingToGuranteedRecipe(item1: Ingredient, item3: Ingredient, item4: Ingredient): ProductPossibility[];
/**
 * rate は足しても 100 にならない
 * @param item1
 * @param item2
 * @param item3
 * @param item4
 */
export declare function mixAccordingToBallRecipe(item1: Ingredient, item2: Ingredient, item3: Ingredient, item4: Ingredient): ProductPossibility[];
//# sourceMappingURL=mix.d.ts.map