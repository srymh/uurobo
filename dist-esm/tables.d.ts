import { Type, IngredientSpec, StandardProduct, GuaranteedProductRecipe, BallProductRecipe } from './Types';
export declare const ingredientSpecTable: readonly IngredientSpec[];
export declare const standardProductTable: ReadonlyArray<{
    type: Type;
    productTableByType: ReadonlyArray<StandardProduct | StandardProduct[]>;
}>;
export declare const guaranteedProductRecipeTable: readonly GuaranteedProductRecipe[];
export declare const ballProductRecipeTable: readonly BallProductRecipe[];
//# sourceMappingURL=tables.d.ts.map