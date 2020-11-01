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
Object.defineProperty(exports, "__esModule", { value: true });
exports.mixAccordingToBallRecipe = exports.mixAccordingToGuranteedRecipe = exports.standardRecipe = exports.mixAccordingToStandardRecipe = exports.mix = void 0;
var tables_1 = require("./tables");
var tableReader_1 = require("./tableReader");
function mix(item1, item2, item3, item4) {
    var productPossibilities = [];
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
exports.mix = mix;
function mixAccordingToStandardRecipe(item1, item2, item3, item4) {
    var item1spec = tableReader_1.extractIngredients({ specifiedItem: item1 })[0];
    var item2spec = tableReader_1.extractIngredients({ specifiedItem: item2 })[0];
    var item3spec = tableReader_1.extractIngredients({ specifiedItem: item3 })[0];
    var item4spec = tableReader_1.extractIngredients({ specifiedItem: item4 })[0];
    if (!(item1spec && item2spec && item3spec && item4spec)) {
        throw new Error('アイテムが不正です');
    }
    var type = item1spec.type;
    var score = item1spec.score + item2spec.score + item3spec.score + item4spec.score;
    return standardRecipe(type, score);
}
exports.mixAccordingToStandardRecipe = mixAccordingToStandardRecipe;
function standardRecipe(type, score) {
    var _a;
    if (score <= 0) {
        throw new Error('範囲外のscoreです');
    }
    var groupBy = function (score) {
        // score は 151 で頭打ち
        var n = Math.min(score, 151);
        // score 21 以上は 10 刻み
        n = n <= 10 ? n : n - 10;
        return Math.floor((n - 1) / 10);
    };
    var name = (_a = tables_1.standardProductTable.find(function (x) { return x.type === type; })) === null || _a === void 0 ? void 0 : _a.productTableByType[groupBy(score)];
    if (Array.isArray(name)) {
        return name.map(function (x) {
            return {
                name: x,
                rate: -1,
            };
        });
    }
    else if (name) {
        return [{ name: name, rate: 100 }]; // 通常レシピはアメざいく以外100%成功
    }
    else {
        return [];
    }
}
exports.standardRecipe = standardRecipe;
function mixAccordingToGuranteedRecipe(item1, item3, item4) {
    var special = tables_1.guaranteedProductRecipeTable.find(function (x) { return x.triggerIngredient === item1; });
    if (special && item1 === item3 && item3 === item4) {
        return [{ name: special.product, rate: 100 }]; // 固定レシピは100%成功
    }
    else {
        return [];
    }
}
exports.mixAccordingToGuranteedRecipe = mixAccordingToGuranteedRecipe;
/**
 * rate は足しても 100 にならない
 * @param item1
 * @param item2
 * @param item3
 * @param item4
 */
function mixAccordingToBallRecipe(item1, item2, item3, item4) {
    var apricorns = [
        'くろぼんぐり',
        'あおぼんぐり',
        'みどぼんぐり',
        'ももぼんぐり',
        'あかぼんぐり',
        'しろぼんぐり',
        'きぼんぐり',
    ];
    if (![item1, item2, item3, item4].every(function (x) { return apricorns.includes(x); })) {
        return [];
    }
    var a = tables_1.ballProductRecipeTable.find(function (x) { return x.apricorn === item1; });
    var b = tables_1.ballProductRecipeTable.find(function (x) { return x.apricorn === item2; });
    var c = tables_1.ballProductRecipeTable.find(function (x) { return x.apricorn === item3; });
    var d = tables_1.ballProductRecipeTable.find(function (x) { return x.apricorn === item4; });
    if (!(a && b && c && d)) {
        return [];
    }
    return [a, b, c, d]
        .reduce(function (ret, x) {
        if (ret.length === 0) {
            // 2階層 deep copy してそのまま返す
            return x.balls.map(function (y) { return (__assign({}, y)); });
        }
        else {
            var _loop_1 = function (i) {
                var ball = x.balls[i];
                var r = ret.find(function (y) { return y.name === ball.name; });
                // 一致あり
                if (r) {
                    r.rate += ball.rate;
                }
                // 一致なし
                else {
                    ret.push(ball);
                }
            };
            for (var i = 0; i < x.balls.length; i++) {
                _loop_1(i);
            }
            return ret;
        }
    }, [])
        .map(function (x) { return ({ name: x.name, rate: x.rate }); });
}
exports.mixAccordingToBallRecipe = mixAccordingToBallRecipe;
//# sourceMappingURL=mix.js.map