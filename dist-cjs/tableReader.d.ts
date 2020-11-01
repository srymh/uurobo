import { Type, Ingredient, StandardProduct, Product, BallProductRecipe, GuaranteedProductRecipe, StandardProductRecipe } from './Types';
export declare type extractIngredientsOptions = {
    type?: Type;
    lessThanScore?: number;
    greaterThanScore?: number;
    specifiedScore?: number;
    specifiedItem?: Ingredient;
};
export declare function extractIngredients(options?: extractIngredientsOptions): import("./Types").IngredientSpec[];
export declare type getProductRecipesOptions = {
    onlyMinCost: boolean;
};
export declare function getProductRecipes(product: Product, options?: getProductRecipesOptions): {
    standard: StandardProductRecipe[] | null;
    guranteed: GuaranteedProductRecipe | null;
    ball: BallProductRecipe[] | null;
};
export declare function getStandardProductRecipes(targetProduct: StandardProduct, onlyMinCost?: boolean): StandardProductRecipe[];
export declare function getIngredientSpec(item: Ingredient): import("./Types").IngredientSpec | undefined;
//# sourceMappingURL=tableReader.d.ts.map