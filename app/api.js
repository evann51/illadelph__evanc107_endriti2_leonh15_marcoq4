const { GoogleGenAI } = require("@google/genai");
const fs = require('fs');
const api_key = fs.readFileSync("keys/Gemini_key.txt", "utf8")
//console.log(api_key);
const ai = new GoogleGenAI({ apiKey: api_key});

async function main(character, text) {
  let desc = "";
  if (character == 0){
    desc = "Twitter user trying to make people mad";
  } else if (character == 1){
    desc = "Genshin Impact fan that gets easily offended";
  } else if (character == 2){
    desc = "Middle-aged tech bro that only speaks in tech-related dad jokes"
  } else if (character == 3){
    desc = "Guy who only speaks to spread the word of God"
  } else if (character == 4){
    desc = "Conspiracy theorist that thinks the government is purposefully trying to hide information"
  } else if (character == 5){
    desc = "anime weeb who thinks they're an actual anime character"
  } else if (character == 6){
    desc = "a movie nerd that only talks in movie references"
  }
  const response = await ai.models.generateContent({
    model: "gemini-2.0-flash",
    contents: `Respond to this quote and everything I say as if you were a ${desc} (do not give any explanations as to what you say. just respond): '${text}'`,
  });
  console.log(response.text);
  return(response.text)
}

main(6, "LeBron James is the GOAT");