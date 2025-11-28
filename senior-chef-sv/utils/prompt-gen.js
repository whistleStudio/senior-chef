// 有啥吃啥
function generateFridgePrompt(input) {
  return `输入: ${input} 。
  规则：仅保留真实可食用食材；过滤虚构/危险/化学品/物品/人名地名。 若无有效食材 → 返回 {"err":"no valid food"}。 用有效食材生成 2-3 道菜。 每道菜包含： name ingredients（每种食材明确用量） steps（4-7 步） nutrition（计算菜品营养总量：energy_kcal/protein_g/fat_g/carbohydrate_g，若无法估算填 null） nrv（计算菜品总营养素参考值百分比，若无法估算才填 null） 严格返回 JSON，无解释、多余字段或注释。 
  JSON 模板： { "filtered_foods": [], "dishes": [ { "name": "", "ingredients": [ {"name":"", "amount":""} ], "steps": [], "nutrition": { "energy_kcal": 0, "protein_g": 0, "fat_g": 0, "carbohydrate_g": 0 }, "nrv": { "energy": 0, "protein": 0, "fat": 0, "carbohydrate": 0 } } ] }`
}

// 营养专家
function generateNutritionistPrompt({nutri_increase="", nutri_decrease="", food_avoid=""}={}) {
  return `根据以下输入生成菜品 (1~3 道), 并返回 JSON. 输入字段: nutri_increase (需要增加的营养素): ${nutri_increase}, nutri_decrease (需要减少的营养素): ${nutri_decrease} avoid_foods (需要避免的食物): ${food_avoid}
要求: 生成菜名、食材(明确用量)、步骤(4-7步). 不包含 avoid_foods. 仅对输入的营养素返回 nutrients: { "营养素名": { "amount": "", "nrv": "" } }, 计算值基于菜品总量. 输出必须是纯 JSON.
格式: { "recipes": [ { "name": "", "ingredients": [{"name": "", "amount": ""}], "steps": [], "nutrients": { "营养素名": { "amount": "", "nrv": "" } } } ] }`
}


module.exports = {
  generateFridgePrompt,
  generateNutritionistPrompt
};