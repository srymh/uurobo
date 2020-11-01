import {
  Type,
  Ingredient,
  StandardProduct,
  StandardProductList,
  GuaranteedProductList,
  BallProductList,
  Product,
  BallProductRecipe,
  GuaranteedProductRecipe,
  StandardProductRecipe,
} from './Types';

import {
  ingredientSpecTable,
  guaranteedProductRecipeTable,
  ballProductRecipeTable,
  standardProductTable,
} from './tables';

export type extractIngredientsOptions = {
  type?: Type;
  lessThanScore?: number;
  greaterThanScore?: number;
  specifiedScore?: number;
  specifiedItem?: Ingredient;
};

export function extractIngredients(options?: extractIngredientsOptions) {
  let type: Type | null = null;
  let lessThanScore: number | null = null;
  let greaterThanScore: number | null = null;
  let specifiedScore: number | null = null;
  let specifiedItem: Ingredient | null = null;
  if (options) {
    type = options.type ?? null;
    lessThanScore = options.lessThanScore ?? null;
    greaterThanScore = options.greaterThanScore ?? null;
    specifiedScore = options.specifiedScore ?? null;
    specifiedItem = options.specifiedItem ?? null;
  }

  if (specifiedItem) {
    return ingredientSpecTable.filter((x) => x.name == specifiedItem);
  } else {
    return ingredientSpecTable
      .filter((x) => {
        if (specifiedScore === null && lessThanScore !== null) {
          return x.score <= lessThanScore;
        } else {
          return true;
        }
      })
      .filter((x) => {
        if (specifiedScore === null && greaterThanScore !== null) {
          return x.score >= greaterThanScore;
        } else {
          return true;
        }
      })
      .filter((x) => {
        if (specifiedScore !== null) {
          return x.score === specifiedScore;
        } else {
          return true;
        }
      })
      .filter((x) => {
        if (type !== null) {
          return x.type === type;
        } else {
          return true;
        }
      });
  }
}

export type getProductRecipesOptions = {
  onlyMinCost: boolean;
};

export function getProductRecipes(
  product: Product,
  options?: getProductRecipesOptions
): {
  standard: StandardProductRecipe[] | null;
  guranteed: GuaranteedProductRecipe | null;
  ball: BallProductRecipe[] | null;
} {
  let onlyMinCost: boolean;
  if (options) {
    if (options.onlyMinCost) {
      onlyMinCost = true;
    } else {
      onlyMinCost = false;
    }
  } else {
    onlyMinCost = true;
  }

  let standard: StandardProductRecipe[] | null = null;
  let special: GuaranteedProductRecipe | null = null;
  let ball: BallProductRecipe[] | null = null;

  if ((StandardProductList as ReadonlyArray<string>).includes(product)) {
    standard = getStandardProductRecipes(
      product as StandardProduct,
      onlyMinCost
    );
  }

  if ((GuaranteedProductList as ReadonlyArray<string>).includes(product)) {
    const spec = guaranteedProductRecipeTable.find(
      (x) => x.product === product
    );
    special = spec ? spec : null;
  }

  if ((BallProductList as ReadonlyArray<string>).includes(product)) {
    ball = ballProductRecipeTable.filter((x) =>
      x.balls.some((x) => x.name === product)
    );
  }

  return {
    standard: standard,
    guranteed: special,
    ball: ball,
  };
}

export function getStandardProductRecipes(
  targetProduct: StandardProduct,
  onlyMinCost: boolean = true
) {
  const specs: StandardProductRecipe[] = [];
  standardProductTable.forEach((row) => {
    for (let id = 0; id < row.productTableByType.length; id++) {
      const product = row.productTableByType[id];
      if (Array.isArray(product)) {
        for (let i = 0; i < product.length; i++) {
          if (product[i] === targetProduct) {
            const requiredScoreMin = id === 0 ? 2 : (id + 1) * 10 + 2;
            specs.push({
              type: row.type,
              scores: [
                requiredScoreMin,
                ...(onlyMinCost
                  ? []
                  : [
                      ...(id === 0
                        ? [
                            requiredScoreMin + 2,
                            requiredScoreMin + 4,
                            requiredScoreMin + 6,
                            requiredScoreMin + 8,
                            requiredScoreMin + 10,
                            requiredScoreMin + 12,
                            requiredScoreMin + 14,
                            requiredScoreMin + 16,
                            requiredScoreMin + 18,
                          ]
                        : [
                            requiredScoreMin + 2,
                            requiredScoreMin + 4,
                            requiredScoreMin + 6,
                            requiredScoreMin + 8,
                          ]),
                    ]),
              ],
            });

            if (onlyMinCost) {
              // 同じタイプでもよりコストが高いほうを除外する。
              break;
            } else {
              /* noop */
            }

            break;
          }
        }
      } else if (product === targetProduct) {
        const requiredScoreMin = id === 0 ? 2 : (id + 1) * 10 + 2;
        specs.push({
          type: row.type,
          scores: [
            requiredScoreMin,
            ...(onlyMinCost
              ? []
              : [
                  ...(id === 0
                    ? [
                        requiredScoreMin + 2,
                        requiredScoreMin + 4,
                        requiredScoreMin + 6,
                        requiredScoreMin + 8,
                        requiredScoreMin + 10,
                        requiredScoreMin + 12,
                        requiredScoreMin + 14,
                        requiredScoreMin + 16,
                        requiredScoreMin + 18,
                      ]
                    : [
                        requiredScoreMin + 2,
                        requiredScoreMin + 4,
                        requiredScoreMin + 6,
                        requiredScoreMin + 8,
                      ]),
                ]),
          ],
        });

        if (onlyMinCost) {
          // 同じタイプでもよりコストが高いほうを除外する。
          break;
        } else {
          /* noop */
        }
      } else {
        /* noop */
      }
    }
  });
  return specs;
}

export function getIngredientSpec(item: Ingredient) {
  return ingredientSpecTable.find((x) => x.name === item);
}
