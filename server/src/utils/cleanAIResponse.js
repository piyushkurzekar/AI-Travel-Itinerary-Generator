const cleanAIResponse = (text) => {
  if (!text) return "";
  // Remove markdown code blocks (```json ... ``` or ``` ... ```)
  let cleaned = text.replace(/```(?:json)?\s*/gi, "").replace(/```/g, "");
  // Remove leading/trailing whitespace
  cleaned = cleaned.trim();
  return cleaned;
};

const parseAIJson = (text) => {
  const cleaned = cleanAIResponse(text);
  try {
    return JSON.parse(cleaned);
  } catch {
    // Try extracting JSON object from the text
    const match = cleaned.match(/\{[\s\S]*\}/);
    if (match) {
      return JSON.parse(match[0]);
    }
    throw new Error("Failed to parse AI JSON response");
  }
};

module.exports = { cleanAIResponse, parseAIJson };
