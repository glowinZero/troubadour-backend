const OpenAI = require("openai");

const openai = new OpenAI({apiKey: "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"}); // Ensure you have your API key configured properly here

async function main() {
  const completion = await openai.chat.completions.create({
    messages: [{ 
      role: "system", 
      content: "Analyze my mood and give a response of only one word: i am happy but also a bit exhausted" }],
    model: "gpt-4",
  });

  console.log(completion.choices[0]);
}

main();
