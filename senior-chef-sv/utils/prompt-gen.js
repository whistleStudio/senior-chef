function generateFridgePrompt(input) {
  return `输入: ${input} 。
  规则：仅保留真实可食用食材；过滤虚构/危险/化学品/物品/人名地名。 若无有效食材 → 返回 {"err":"no valid food"}。 用有效食材生成 2-3 道菜。 每道菜包含： name ingredients（每种食材明确用量） steps（4-7 步） nutrition（计算菜品营养总量：energy_kcal/protein_g/fat_g/carbohydrate_g，若无法估算填 null） nrv（计算菜品总营养素参考值百分比，若无法估算才填 null） 严格返回 JSON，无解释、多余字段或注释。 
  JSON 模板： { "filtered_foods": [], "dishes": [ { "name": "", "ingredients": [ {"name":"", "amount":""} ], "steps": [], "nutrition": { "energy_kcal": 0, "protein_g": 0, "fat_g": 0, "carbohydrate_g": 0 }, "nrv": { "energy": 0, "protein": 0, "fat": 0, "carbohydrate": 0 } } ] }`
}

module.exports = {
  generateFridgePrompt
};