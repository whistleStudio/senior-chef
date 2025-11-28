const express = require('express');
const rt = express.Router();
const { OpenAI } = require("openai");
const { generateFridgePrompt, generateNutritionistPrompt } = require('../utils/prompt-gen');

// qwen3-vl-flash qwen-flash
const openai = new OpenAI(
    {
        // 若没有配置环境变量，请用百炼API Key将下行替换为：apiKey: "sk-xxx",
        apiKey: process.env.DASHSCOPE_API_KEY,
        baseURL: "https://dashscope.aliyuncs.com/compatible-mode/v1"
    }
);

rt.get("/test", (req, res) => {
  res.json({ message: "Menu API is working!" });
});


rt.post("/cook", (req, res) => {
  // Logic to add a menu item
  console.log("original cook req.body: ", req.body);
  ;(async () => {
    try {
      const prompt = generateFridgePrompt(req.body.food || "");
      const aiResponse = await askAi(prompt);
      if (aiResponse) res.json({err: 0, data: aiResponse });
      else res.json({ err: 2, msg: "Response not match rules" });
    } catch (error) {
      console.error("Error /cook:", error);
      res.json({ err: 1, msg: "AI communication error" });
    }
  })()
});

rt.post("/nutritionist-cook", (req, res) => {
  console.log("original nutritionist-cook req.body: ", req.body);
  ;(async () => {
    try {
      const prompt = generateNutritionistPrompt(req.body || {});
      const aiResponse = await askAi(prompt);
      if (aiResponse) res.json({err: 0, data: aiResponse });
      else res.json({ err: 2, msg: "Response not match rules" });
    } catch (error) {
      console.error("Error /nutritionist-cook:", error);
      res.json({ err: 1, msg: "AI communication error" });
    }
  })()
});


// 大模型请求
async function askAi(content) {
  const completion = await openai.chat.completions.create({
      model: "qwen3-vl-flash",  // 模型列表：https://help.aliyun.com/zh/model-studio/getting-started/models
      messages: [
        // { role: "system", content: "You are a helpful assistant." }, // 可选
        { role: "user", content }
      ],
  }); 
  console.log("completion:", completion);
  console.log(completion.choices[0].message.content);
  const completionJson = JSON.parse(completion.choices[0].message.content);
  // console.log(JSON.stringify(completion, null, 4));
  return completionJson;
}

module.exports = rt;





// async function main() {
//     const completion = await openai.chat.completions.create({
//         model: "qwen3-vl-flash",  //此处以qwen-plus为例，可按需更换模型名称。模型列表：https://help.aliyun.com/zh/model-studio/getting-started/models
//         messages: [
//             { role: "system", content: "You are a helpful assistant." },
//             { role: "user", content: "你是谁？" }
//         ],
//     });
//     console.log(JSON.stringify(completion))
// }

// main();