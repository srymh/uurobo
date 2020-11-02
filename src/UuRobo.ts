import {Ingredient, IngredientSpec, Product} from './Types';
import {
  extractIngredients,
  getProductRecipes,
  getIngredientSpec,
} from './tableReader';
import {guaranteedProductRecipeTable} from './tables';
import {mix} from './mix';
import {create} from './create';

function getMaxScore() {
  return Math.max.apply(
    null,
    extractIngredients().map((x) => x.score)
  );
}

export class UuRobo {
  private targetProduct: Product | null = null;
  private ingredients: Array<Ingredient | null> = [null, null, null, null];

  public static mix(
    firstIngredient: Ingredient,
    secondIngredient: Ingredient,
    thirdIngredient: Ingredient,
    fourthIngredient: Ingredient
  ) {
    return mix(
      firstIngredient,
      secondIngredient,
      thirdIngredient,
      fourthIngredient
    );
  }

  /**
   * 通常レシピのみ対応。固定レシピに該当する組み合わせが含まれているので注意。
   * @param product
   */
  public static getRequiredIngredients(product: Product) {
    const recipes = create(product);
    // スコアのリストが得られるのでアイテム名に置き換える
    if (recipes.length > 0) {
      const listReplacedToItemName = recipes.map((recipe) => {
        const type = recipe.type;
        const lists = recipe.lists
          .filter(
            (list) =>
              extractIngredients({specifiedScore: list[0], type}).length > 0
          )
          .map((list) => {
            return list.map((score, i) => {
              return i === 0
                ? extractIngredients({specifiedScore: score, type})
                : extractIngredients({specifiedScore: score});
            });
          });
        return lists;
      });
      // flat したい。 Array.prototype.flat がない。
      const result: Ingredient[][][] = [];
      return Array.prototype.concat.apply(result, listReplacedToItemName);
    }
    return [];
  }

  public getTarget() {
    return this.targetProduct;
  }

  public setTarget(product: Product) {
    this.targetProduct = product;
    this.removeIngredientsFrom(1);
  }

  public getIngredient(nth: number) {
    const id = this.id(nth);
    return this.ingredients[id];
  }

  public setIngredient(nth: number, ingredient: Ingredient) {
    const id = this.id(nth);
    if (id === 0 && this.targetProduct === null) {
      throw new Error(
        `1 番目のアイテムをセットする前に目的のアイテムをセットする必要があります。`
      );
    } else if (id === 1 && this.ingredients[0] === null) {
      throw new Error(
        `2 番目のアイテムをセットする前に 1 番目のアイテムをセットする必要があります。`
      );
    } else if (id === 2 && this.ingredients[1] === null) {
      throw new Error(
        `3 番目のアイテムをセットする前に 2 番目までのアイテムをセットする必要があります。`
      );
    } else if (id === 3 && this.ingredients[2] === null) {
      throw new Error(
        `4 番目のアイテムをセットする前に 3 番目までのアイテムをセットする必要があります。`
      );
    }

    const requiredIngredients = this.getRequiredIngredients(nth)?.map(
      (x) => x.name
    );
    if (!requiredIngredients) {
      throw new Error(`必要なアイテムではありません。`);
    } else if (!requiredIngredients.includes(ingredient)) {
      throw new Error(`必要なアイテムではありません。${ingredient}`);
    }

    for (let i = 3; i >= id; i--) {
      if (i === id) {
        this.ingredients[id] = ingredient;
      } else {
        this.ingredients[i] = null;
      }
    }
  }

  public removeIngredientsFrom(nth: number) {
    const id = this.id(nth);
    for (let i = 3; i >= id; i--) {
      this.ingredients[i] = null;
    }
  }

  public mix() {
    if (
      this.ingredients.length === 4 &&
      this.ingredients[0] !== null &&
      this.ingredients[1] !== null &&
      this.ingredients[2] !== null &&
      this.ingredients[3] !== null
    ) {
      // nullかもしれなくてこの書き方ができない
      // mix.apply(null, this.ingredients);
      return mix(
        this.ingredients[0],
        this.ingredients[1],
        this.ingredients[2],
        this.ingredients[3]
      );
    } else {
      return [];
    }
  }

  public getRequiredIngredients(nth: number): IngredientSpec[] | null {
    const id = this.id(nth);
    if (this.targetProduct === null) return null;
    if (id > 0 && this.ingredients[0] === null) return null;
    if (id > 1 && this.ingredients[1] === null) return null;
    if (id > 2 && this.ingredients[2] === null) return null;

    let requiredIngredients: IngredientSpec[] = [];
    const productRecipes = getProductRecipes(this.targetProduct, {
      onlyMinCost: false,
    });

    if (productRecipes.standard) {
      productRecipes.standard.forEach((recipe) => {
        const type = recipe.type;

        // 複数タイプにまたがってかつ合計スコアが複数色々あるときの除外処理
        if (id > 0) {
          const firstIngredient = this.ingredients[0];
          if (firstIngredient) {
            if (getIngredientSpec(firstIngredient)?.type !== type) return;
          }
        }

        recipe.scores.forEach((score) => {
          let s = 0;

          for (let i = 1; i <= id; i++) {
            const ingredient = this.ingredients[i - 1];
            if (ingredient) {
              const spec = getIngredientSpec(ingredient);
              if (spec) {
                s += spec.score;
              }
            }
          }

          // 特殊レシピに一致しているかどうかを4つ目のアイテムで判断し、
          // 一致している場合にはそのアイテムを4つ目のアイテムの候補から除外する。
          let exceptionalItem: Ingredient | null = null;
          if (id === 3) {
            const firstIngredient = this.ingredients[0];
            const thirdIngredient = this.ingredients[2];
            if (
              firstIngredient &&
              guaranteedProductRecipeTable.find(
                (x) => x.triggerIngredient === firstIngredient
              ) &&
              thirdIngredient &&
              guaranteedProductRecipeTable.find(
                (x) => x.triggerIngredient === thirdIngredient
              ) &&
              // 一つ目と三つ目が同じかチェック（ポイントアップはダイこうせきorヨロイこうせきなので）
              firstIngredient === thirdIngredient
            ) {
              exceptionalItem = firstIngredient;
            }
          }

          const filterOptions = {
            ...(id === 0 ? {type: type} : {}),
            ...{
              lessThanScore: score - s,
              greaterThanScore: score - s - getMaxScore() * (3 - id),
            },
          };

          requiredIngredients = [
            ...requiredIngredients,
            ...extractIngredients(filterOptions).filter((x) =>
              exceptionalItem ? x.name !== exceptionalItem : true
            ),
          ];
        });
      });
    }

    if (productRecipes.guranteed) {
      if (id === 0) {
        requiredIngredients = [
          ...requiredIngredients,
          ...productRecipes.guranteed.map((x) => {
            return extractIngredients({specifiedItem: x.triggerIngredient})[0];
          }),
        ];
      } else if (id === 1) {
        const firstIngredient = this.ingredients[0];
        if (
          firstIngredient &&
          productRecipes.guranteed.findIndex(
            (x) => x.triggerIngredient === firstIngredient
          ) >= 0
        ) {
          requiredIngredients = [...extractIngredients()]; // any
        }
      } else if (id === 2) {
        const firstIngredient = this.ingredients[0];
        if (
          firstIngredient &&
          productRecipes.guranteed.findIndex(
            (x) => x.triggerIngredient === firstIngredient
          ) >= 0
        ) {
          requiredIngredients = [
            ...extractIngredients({specifiedItem: firstIngredient}),
          ];
        }
      } else if (id === 3) {
        const firstIngredient = this.ingredients[0];
        const thirdIngredient = this.ingredients[2];
        if (
          firstIngredient &&
          productRecipes.guranteed.findIndex(
            (x) => x.triggerIngredient === firstIngredient
          ) >= 0 &&
          thirdIngredient &&
          productRecipes.guranteed.findIndex(
            (x) => x.triggerIngredient === thirdIngredient
          ) >= 0
        ) {
          requiredIngredients = [
            ...extractIngredients({specifiedItem: firstIngredient}),
          ];
        }
      }
    }

    if (productRecipes.ball) {
      productRecipes.ball.forEach((recipe) => {
        requiredIngredients = [
          ...requiredIngredients,
          ...extractIngredients({specifiedItem: recipe.apricorn}),
        ];
      });
    }

    return requiredIngredients
      .filter((v, i, s) => i === s.findIndex((x) => x.name === v.name)) // 重複を削除
      .sort((a, b) => a.score - b.score); // スコアでソート
  }

  private id(nth: number) {
    const id = Math.floor(nth) - 1;
    if (id < 0 || id > 3)
      throw new Error(`指定できる番号は 1 から 4 番目までです。`);
    return id;
  }
}
