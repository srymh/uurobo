import {Type, Ingredient, BallProduct, ProductPossibility} from './Types';
import {
  standardProductTable,
  guaranteedProductRecipeTable,
  ballProductRecipeTable,
} from './tables';

import {extractIngredients} from './tableReader';

export function mix(
  item1: Ingredient,
  item2: Ingredient,
  item3: Ingredient,
  item4: Ingredient
): ProductPossibility[] {
  let productPossibilities = [];

  productPossibilities = mixAccordingToGuranteedRecipe(item1, item3, item4);
  if (productPossibilities.length > 0) {
    return productPossibilities;
  }

  productPossibilities = mixAccordingToBallRecipe(item1, item2, item3, item4);
  if (productPossibilities.length > 0) {
    return productPossibilities;
  }

  return mixAccordingToStandardRecipe(item1, item2, item3, item4);
}

export function mixAccordingToStandardRecipe(
  item1: Ingredient,
  item2: Ingredient,
  item3: Ingredient,
  item4: Ingredient
): ProductPossibility[] {
  const item1spec = extractIngredients({specifiedItem: item1})[0];
  const item2spec = extractIngredients({specifiedItem: item2})[0];
  const item3spec = extractIngredients({specifiedItem: item3})[0];
  const item4spec = extractIngredients({specifiedItem: item4})[0];

  if (!(item1spec && item2spec && item3spec && item4spec)) {
    throw new Error('アイテムが不正です');
  }

  const type = item1spec.type;
  const score =
    item1spec.score + item2spec.score + item3spec.score + item4spec.score;

  return standardRecipe(type, score);
}

export function standardRecipe(
  type: Type,
  score: number
): ProductPossibility[] {
  if (score <= 0) {
    throw new Error('範囲外のscoreです');
  }

  const groupBy = (score: number) => {
    // score は 151 で頭打ち
    let n = Math.min(score, 151);
    // score 21 以上は 10 刻み
    n = n <= 10 ? n : n - 10;
    return Math.floor((n - 1) / 10);
  };

  const name = standardProductTable.find((x) => x.type === type)
    ?.productTableByType[groupBy(score)];

  if (Array.isArray(name)) {
    return name.map((x) => {
      return {
        name: x,
        rate: -1, // アメざいくの確率が不明なので-1をいれておく。
      };
    });
  } else if (name) {
    return [{name, rate: 100}]; // 通常レシピはアメざいく以外100%成功
  } else {
    return [];
  }
}

export function mixAccordingToGuranteedRecipe(
  item1: Ingredient,
  item3: Ingredient,
  item4: Ingredient
): ProductPossibility[] {
  const special = guaranteedProductRecipeTable.find(
    (x) => x.triggerIngredient === item1
  );
  if (special && item1 === item3 && item3 === item4) {
    return [{name: special.product, rate: 100}]; // 固定レシピは100%成功
  } else {
    return [];
  }
}

/**
 * rate は足しても 100 にならない
 * @param item1
 * @param item2
 * @param item3
 * @param item4
 */
export function mixAccordingToBallRecipe(
  item1: Ingredient,
  item2: Ingredient,
  item3: Ingredient,
  item4: Ingredient
): ProductPossibility[] {
  const apricorns: Ingredient[] = [
    'くろぼんぐり',
    'あおぼんぐり',
    'みどぼんぐり',
    'ももぼんぐり',
    'あかぼんぐり',
    'しろぼんぐり',
    'きぼんぐり',
  ];

  if (![item1, item2, item3, item4].every((x) => apricorns.includes(x))) {
    return [];
  }

  const a = ballProductRecipeTable.find((x) => x.apricorn === item1);
  const b = ballProductRecipeTable.find((x) => x.apricorn === item2);
  const c = ballProductRecipeTable.find((x) => x.apricorn === item3);
  const d = ballProductRecipeTable.find((x) => x.apricorn === item4);

  if (!(a && b && c && d)) {
    return [];
  }

  return [a, b, c, d]
    .reduce((ret: Array<{name: BallProduct; rate: number}>, x) => {
      if (ret.length === 0) {
        // 2階層 deep copy してそのまま返す
        return x.balls.map((y) => ({...y}));
      } else {
        for (let i = 0; i < x.balls.length; i++) {
          const ball = x.balls[i];
          const r = ret.find((y) => y.name === ball.name);
          // 一致あり
          if (r) {
            r.rate += ball.rate;
          }
          // 一致なし
          else {
            ret.push(ball);
          }
        }
        return ret;
      }
    }, [])
    .map((x) => ({name: x.name, rate: x.rate}));
}
