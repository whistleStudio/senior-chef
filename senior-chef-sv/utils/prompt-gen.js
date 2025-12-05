// 有啥吃啥
function generateFridgePrompt(input) {
  return `输入: ${input} 。
  要求：仅保留真实可食用食材；过滤虚构/危险/化学品/物品/人名地名;若无有效食材 → 返回 {"err":"no valid food"}; 用有效食材生成 2-3 道菜, 菜品需明确食材用量(单位中文), 步骤(4-7步); 针对营养素——能量(kcal)、蛋白质(g)、脂肪(g)和碳水(g)返回nutrients: { "营养素名": { "amount": "", "nrv": "" } }, 计算值基于菜品总量, 单位小写英文缩写; 输出必须是纯JSON。 
  格式： { "filtered_foods": [], "recipes": [ { "name": "", "ingredients": [ {"name":"", "amount":""} ], "steps": [], "nutrients": { "营养素名（中文）": { "amount": "", "nrv": "" } } } ] }`
}

// 营养专家
function generateNutritionistPrompt({nutri_increase="", nutri_decrease="", food_avoid=""}={}) {
  let prompt_part1 = nutri_increase ? `增加${nutri_increase}摄入，` : "";
  let prompt_part2 = nutri_decrease ? `减少${nutri_decrease}摄入，` : "";
  let prompt_part3 = food_avoid ? `避免包含${food_avoid}。` : "";
  let prompt_part1_3 = prompt_part1 + prompt_part2 + prompt_part3;
  return `输入: nutri_increase: ${nutri_increase}, nutri_decrease: ${nutri_decrease} avoid_foods: ${food_avoid}.
要求: 生成菜品 (2道)、菜品都需${prompt_part1_3} 食材明确用量(单位中文). 步骤(4-7步). 仅对输入的营养素返回 nutrients: { "营养素名": { "amount": "", "nrv": "" } }, 计算值基于菜品总量, 单位小写英文缩写. 输出必须是纯 JSON.
格式: { "recipes": [ { "name": "", "ingredients": [{"name": "", "amount": ""}], "steps": [], "nutrients": { "营养素名": { "amount": "", "nrv": "" } } } ] }`
}

// 占卜大师
function generateTarotPrompt({question="", tarotCards=["", "", ""]}={}) {
  return `输入: question: ${question}, tarotCards: ${tarotCards}.
要求: 根据question和tarotCards进行占卜分析, 生成菜品(2道, name符合真实菜名), 菜品需明确食材用量(单位中文), 步骤(4-7步); 占卜采取塔罗78张牌的三角阵牌型(仅正位), 过去、现在、未来分别对应tarotCards数组的三张牌; 对占卜结果进行分析analysis(<150字); 对菜品能够解决或缓解问题的原因功效进行阐述effect(<100字); 输出必须是纯JSON.
格式: { "analysis": "", "recipes": [ { "name": "", "ingredients": [{"name": "", "amount": ""}], "effect":"", "steps": [] } ] }`
}


module.exports = {
  generateFridgePrompt,
  generateNutritionistPrompt,
  generateTarotPrompt
};