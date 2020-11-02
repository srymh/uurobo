var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
import { StandardProductList, GuaranteedProductList, BallProductList, } from './Types';
import { ingredientSpecTable, guaranteedProductRecipeTable, ballProductRecipeTable, standardProductTable, } from './tables';
export function extractIngredients(options) {
    var _a, _b, _c, _d, _e;
    var type = null;
    var lessThanScore = null;
    var greaterThanScore = null;
    var specifiedScore = null;
    var specifiedItem = null;
    if (options) {
        type = (_a = options.type) !== null && _a !== void 0 ? _a : null;
        lessThanScore = (_b = options.lessThanScore) !== null && _b !== void 0 ? _b : null;
        greaterThanScore = (_c = options.greaterThanScore) !== null && _c !== void 0 ? _c : null;
        specifiedScore = (_d = options.specifiedScore) !== null && _d !== void 0 ? _d : null;
        specifiedItem = (_e = options.specifiedItem) !== null && _e !== void 0 ? _e : null;
    }
    if (specifiedItem) {
        return ingredientSpecTable.filter(function (x) { return x.name == specifiedItem; });
    }
    else {
        return ingredientSpecTable
            .filter(function (x) {
            if (specifiedScore === null && lessThanScore !== null) {
                return x.score <= lessThanScore;
            }
            else {
                return true;
            }
        })
            .filter(function (x) {
            if (specifiedScore === null && greaterThanScore !== null) {
                return x.score >= greaterThanScore;
            }
            else {
                return true;
            }
        })
            .filter(function (x) {
            if (specifiedScore !== null) {
                return x.score === specifiedScore;
            }
            else {
                return true;
            }
        })
            .filter(function (x) {
            if (type !== null) {
                return x.type === type;
            }
            else {
                return true;
            }
        });
    }
}
export function getProductRecipes(product, options) {
    var onlyMinCost;
    if (options) {
        if (options.onlyMinCost) {
            onlyMinCost = true;
        }
        else {
            onlyMinCost = false;
        }
    }
    else {
        onlyMinCost = true;
    }
    var standard = null;
    var guranteed = null;
    var ball = null;
    if (StandardProductList.includes(product)) {
        standard = getStandardProductRecipes(product, onlyMinCost);
    }
    if (GuaranteedProductList.includes(product)) {
        var spec = guaranteedProductRecipeTable.filter(function (x) { return x.product === product; });
        guranteed = spec ? spec : null;
    }
    if (BallProductList.includes(product)) {
        ball = ballProductRecipeTable.filter(function (x) {
            return x.balls.some(function (x) { return x.name === product; });
        });
    }
    return {
        standard: standard,
        guranteed: guranteed,
        ball: ball,
    };
}
export function getStandardProductRecipes(targetProduct, onlyMinCost) {
    if (onlyMinCost === void 0) { onlyMinCost = true; }
    var specs = [];
    standardProductTable.forEach(function (row) {
        for (var id = 0; id < row.productTableByType.length; id++) {
            var product = row.productTableByType[id];
            if (Array.isArray(product)) {
                for (var i = 0; i < product.length; i++) {
                    if (product[i] === targetProduct) {
                        var requiredScoreMin = id === 0 ? 2 : (id + 1) * 10 + 2;
                        specs.push({
                            type: row.type,
                            scores: __spreadArrays([
                                requiredScoreMin
                            ], (onlyMinCost
                                ? []
                                : __spreadArrays((id === 0
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
                                    ])))),
                        });
                        if (onlyMinCost) {
                            // 同じタイプでもよりコストが高いほうを除外する。
                            break;
                        }
                        else {
                            /* noop */
                        }
                        break;
                    }
                }
            }
            else if (product === targetProduct) {
                var requiredScoreMin = id === 0 ? 2 : (id + 1) * 10 + 2;
                specs.push({
                    type: row.type,
                    scores: __spreadArrays([
                        requiredScoreMin
                    ], (onlyMinCost
                        ? []
                        : __spreadArrays((id === 0
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
                            ])))),
                });
                if (onlyMinCost) {
                    // 同じタイプでもよりコストが高いほうを除外する。
                    break;
                }
                else {
                    /* noop */
                }
            }
            else {
                /* noop */
            }
        }
    });
    return specs;
}
export function getIngredientSpec(item) {
    return ingredientSpecTable.find(function (x) { return x.name === item; });
}
//# sourceMappingURL=tableReader.js.map