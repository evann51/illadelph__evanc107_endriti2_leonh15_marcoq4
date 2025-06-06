const { GoogleGenAI } = require("@google/genai");

const ai = new GoogleGenAI({ apiKey: "AIzaSyAizreIXJ-IQ7HeczrWTqYYqoh_HpCpknA" });
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

//main(0, "GSP is the GOAT of the UFC");
