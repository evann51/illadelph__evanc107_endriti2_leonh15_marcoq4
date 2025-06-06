const { GoogleGenAI } = require("@google/genai");

const ai = new GoogleGenAI({ apiKey: "AIzaSyAizreIXJ-IQ7HeczrWTqYYqoh_HpCpknA" });
async function main() {
  const response = await ai.models.generateContent({
    model: "gemini-2.0-flash",
    contents: "Respond to this quote and everything I say as if you were a Twitter user trying to make people mad (do not give any explanations as to what you say. just respond): 'GSP is the GOAT of the UFC'",
  });
  console.log(response.text);
}

main();
