const { GoogleGenAI } = require("@google/genai");
const fs = require('fs');
const api_key = fs.readFileSync("keys/Gemini_key.txt", "utf8")
const ai = new GoogleGenAI({ apiKey: api_key});

async function main(character, text) {
  let desc = "";
  if (character == 0){
    desc = "Twitter user trying to make people mad";
  }
  const response = await ai.models.generateContent({
    model: "gemini-2.0-flash",
    contents: `Respond to this quote and everything I say as if you were a ${desc} (do not give any explanations as to what you say. just respond): '${text}'`,
  });
  console.log(response.text);
  return(response.text)
}

//main(0, "");
