"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UuRobo = void 0;
var tableReader_1 = require("./tableReader");
var tables_1 = require("./tables");
var mix_1 = require("./mix");
var create_1 = require("./create");
function getMaxScore() {
    return Math.max.apply(null, tableReader_1.extractIngredients().map(function (x) { return x.score; }));
}
var UuRobo = /** @class */ (function () {
    function UuRobo() {
        this.targetProduct = null;
        this.ingredients = [null, null, null, null];
    }
    UuRobo.mix = function (firstIngredient, secondIngredient, thirdIngredient, fourthIngredient) {
        return mix_1.mix(firstIngredient, secondIngredient, thirdIngredient, fourthIngredient);
    };
    /**
     * 通常レシピのみ対応。固定レシピに該当する組み合わせが含まれているので注意。
     * @param product
     */
    UuRobo.getRequiredIngredients = function (product) {
        var recipes = create_1.create(product);
        // スコアのリストが得られるのでアイテム名に置き換える
        if (recipes.length > 0) {
            var listReplacedToItemName = recipes.map(function (recipe) {
                var type = recipe.type;
                var lists = recipe.lists
                    .filter(function (list) {
                    return tableReader_1.extractIngredients({ specifiedScore: list[0], type: type }).length > 0;
                })
                    .map(function (list) {
                    return list.map(function (score, i) {
                        return i === 0
                            ? tableReader_1.extractIngredients({ specifiedScore: score, type: type })
                            : tableReader_1.extractIngredients({ specifiedScore: score });
                    });
                });
                return lists;
            });
            // flat したい。 Array.prototype.flat がない。
            var result = [];
            return Array.prototype.concat.apply(result, listReplacedToItemName);
        }
        return [];
    };
    UuRobo.prototype.getTarget = function () {
        return this.targetProduct;
    };
    UuRobo.prototype.setTarget = function (product) {
        this.targetProduct = product;
        this.removeIngredientsFrom(1);
    };
    UuRobo.prototype.getIngredient = function (nth) {
        var id = this.id(nth);
        return this.ingredients[id];
    };
    UuRobo.prototype.setIngredient = function (nth, ingredient) {
        var _a;
        var id = this.id(nth);
        if (id === 0 && this.targetProduct === null) {
            throw new Error("1 \u756A\u76EE\u306E\u30A2\u30A4\u30C6\u30E0\u3092\u30BB\u30C3\u30C8\u3059\u308B\u524D\u306B\u76EE\u7684\u306E\u30A2\u30A4\u30C6\u30E0\u3092\u30BB\u30C3\u30C8\u3059\u308B\u5FC5\u8981\u304C\u3042\u308A\u307E\u3059\u3002");
        }
        else if (id === 1 && this.ingredients[0] === null) {
            throw new Error("2 \u756A\u76EE\u306E\u30A2\u30A4\u30C6\u30E0\u3092\u30BB\u30C3\u30C8\u3059\u308B\u524D\u306B 1 \u756A\u76EE\u306E\u30A2\u30A4\u30C6\u30E0\u3092\u30BB\u30C3\u30C8\u3059\u308B\u5FC5\u8981\u304C\u3042\u308A\u307E\u3059\u3002");
        }
        else if (id === 2 && this.ingredients[1] === null) {
            throw new Error("3 \u756A\u76EE\u306E\u30A2\u30A4\u30C6\u30E0\u3092\u30BB\u30C3\u30C8\u3059\u308B\u524D\u306B 2 \u756A\u76EE\u307E\u3067\u306E\u30A2\u30A4\u30C6\u30E0\u3092\u30BB\u30C3\u30C8\u3059\u308B\u5FC5\u8981\u304C\u3042\u308A\u307E\u3059\u3002");
        }
        else if (id === 3 && this.ingredients[2] === null) {
            throw new Error("4 \u756A\u76EE\u306E\u30A2\u30A4\u30C6\u30E0\u3092\u30BB\u30C3\u30C8\u3059\u308B\u524D\u306B 3 \u756A\u76EE\u307E\u3067\u306E\u30A2\u30A4\u30C6\u30E0\u3092\u30BB\u30C3\u30C8\u3059\u308B\u5FC5\u8981\u304C\u3042\u308A\u307E\u3059\u3002");
        }
        var requiredIngredients = (_a = this.getRequiredIngredients(nth)) === null || _a === void 0 ? void 0 : _a.map(function (x) { return x.name; });
        if (!requiredIngredients) {
            throw new Error("\u5FC5\u8981\u306A\u30A2\u30A4\u30C6\u30E0\u3067\u306F\u3042\u308A\u307E\u305B\u3093\u3002");
        }
        else if (!requiredIngredients.includes(ingredient)) {
            throw new Error("\u5FC5\u8981\u306A\u30A2\u30A4\u30C6\u30E0\u3067\u306F\u3042\u308A\u307E\u305B\u3093\u3002" + ingredient);
        }
        for (var i = 3; i >= id; i--) {
            if (i === id) {
                this.ingredients[id] = ingredient;
            }
            else {
                this.ingredients[i] = null;
            }
        }
    };
    UuRobo.prototype.removeIngredientsFrom = function (nth) {
        var id = this.id(nth);
        for (var i = 3; i >= id; i--) {
            this.ingredients[i] = null;
        }
    };
    UuRobo.prototype.mix = function () {
        if (this.ingredients.length === 4 &&
            this.ingredients[0] !== null &&
            this.ingredients[1] !== null &&
            this.ingredients[2] !== null &&
            this.ingredients[3] !== null) {
            // nullかもしれなくてこの書き方ができない
            // mix.apply(null, this.ingredients);
            return mix_1.mix(this.ingredients[0], this.ingredients[1], this.ingredients[2], this.ingredients[3]);
        }
        else {
            return [];
        }
    };
    UuRobo.prototype.getRequiredIngredients = function (nth) {
        var _this = this;
        var id = this.id(nth);
        if (this.targetProduct === null)
            return null;
        if (id > 0 && this.ingredients[0] === null)
            return null;
        if (id > 1 && this.ingredients[1] === null)
            return null;
        if (id > 2 && this.ingredients[2] === null)
            return null;
        var requiredIngredients = [];
        var productRecipes = tableReader_1.getProductRecipes(this.targetProduct, {
            onlyMinCost: false,
        });
        if (productRecipes.standard) {
            productRecipes.standard.forEach(function (recipe) {
                var _a;
                var type = recipe.type;
                // 複数タイプにまたがってかつ合計スコアが複数色々あるときの除外処理
                if (id > 0) {
                    var firstIngredient = _this.ingredients[0];
                    if (firstIngredient) {
                        if (((_a = tableReader_1.getIngredientSpec(firstIngredient)) === null || _a === void 0 ? void 0 : _a.type) !== type)
                            return;
                    }
                }
                recipe.scores.forEach(function (score) {
                    var s = 0;
                    for (var i = 1; i <= id; i++) {
                        var ingredient = _this.ingredients[i - 1];
                        if (ingredient) {
                            var spec = tableReader_1.getIngredientSpec(ingredient);
                            if (spec) {
                                s += spec.score;
                            }
                        }
                    }
                    // 特殊レシピに一致しているかどうかを4つ目のアイテムで判断し、
                    // 一致している場合にはそのアイテムを4つ目のアイテムの候補から除外する。
                    var exceptionalItem = null;
                    if (id === 3) {
                        var firstIngredient_1 = _this.ingredients[0];
                        var thirdIngredient_1 = _this.ingredients[2];
                        if (firstIngredient_1 &&
                            tables_1.guaranteedProductRecipeTable.find(function (x) { return x.triggerIngredient === firstIngredient_1; }) &&
                            thirdIngredient_1 &&
                            tables_1.guaranteedProductRecipeTable.find(function (x) { return x.triggerIngredient === thirdIngredient_1; })) {
                            exceptionalItem = firstIngredient_1;
                        }
                    }
                    var filterOptions = __assign(__assign({}, (id === 0 ? { type: type } : {})), {
                        lessThanScore: score - s,
                        greaterThanScore: score - s - getMaxScore() * (3 - id),
                    });
                    requiredIngredients = __spreadArrays(requiredIngredients, tableReader_1.extractIngredients(filterOptions).filter(function (x) {
                        return exceptionalItem ? x.name !== exceptionalItem : true;
                    }));
                });
            });
        }
        if (productRecipes.guranteed) {
            if (id === 0) {
                requiredIngredients = __spreadArrays(requiredIngredients, tableReader_1.extractIngredients({
                    specifiedItem: productRecipes.guranteed.triggerIngredient,
                }));
            }
            else if (id === 1) {
                var firstIngredient = this.ingredients[0];
                if (firstIngredient &&
                    firstIngredient === productRecipes.guranteed.triggerIngredient) {
                    requiredIngredients = __spreadArrays(tableReader_1.extractIngredients()); // any
                }
            }
            else if (id === 2) {
                var firstIngredient = this.ingredients[0];
                if (firstIngredient &&
                    firstIngredient === productRecipes.guranteed.triggerIngredient) {
                    requiredIngredients = __spreadArrays(tableReader_1.extractIngredients({
                        specifiedItem: productRecipes.guranteed.triggerIngredient,
                    }));
                }
            }
            else if (id === 3) {
                var firstIngredient = this.ingredients[0];
                var thirdIngredient = this.ingredients[2];
                if (firstIngredient &&
                    firstIngredient === productRecipes.guranteed.triggerIngredient &&
                    thirdIngredient &&
                    thirdIngredient === productRecipes.guranteed.triggerIngredient) {
                    requiredIngredients = __spreadArrays(tableReader_1.extractIngredients({
                        specifiedItem: productRecipes.guranteed.triggerIngredient,
                    }));
                }
            }
        }
        if (productRecipes.ball) {
            productRecipes.ball.forEach(function (recipe) {
                requiredIngredients = __spreadArrays(requiredIngredients, tableReader_1.extractIngredients({ specifiedItem: recipe.apricorn }));
            });
        }
        return requiredIngredients
            .filter(function (v, i, s) { return i === s.findIndex(function (x) { return x.name === v.name; }); }) // 重複を削除
            .sort(function (a, b) { return a.score - b.score; }); // スコアでソート
    };
    UuRobo.prototype.id = function (nth) {
        var id = Math.floor(nth) - 1;
        if (id < 0 || id > 3)
            throw new Error("\u6307\u5B9A\u3067\u304D\u308B\u756A\u53F7\u306F 1 \u304B\u3089 4 \u756A\u76EE\u307E\u3067\u3067\u3059\u3002");
        return id;
    };
    return UuRobo;
}());
exports.UuRobo = UuRobo;
//# sourceMappingURL=UuRobo.js.map