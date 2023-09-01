import { config } from "dotenv";
config();

import { OpenAI } from "langchain/llms/openai";
import { PromptTemplate } from "langchain/prompts";
import { StructuredOutputParser } from "langchain/output_parsers";

const parser = StructuredOutputParser.fromNamesAndDescriptions({
  GrammarMistakes: [
    {"name":"name of first grammar tense", "number":"number of mistakes in first grammar tense"},
    {"name":"name of second grammar tense", "number":"number of mistakes in second grammar tense"},
    {"name":"name of third grammar tense...", "number":"number of mistakes in third grammar tense..."}
  ]
});
const formatInstructions = parser.getFormatInstructions();

const prompt = new PromptTemplate({
  template:
    "Find the grammar tense names of any grammaticaltense mistake in this User Writing with the number of mistakes in each grammar tense \n{format_instructions}\n UserWritings: {writes}",
  inputVariables: ["writes"],
  partialVariables: { format_instructions: formatInstructions },
});

const model = new OpenAI({ temperature: 0 });

// const input = await prompt.format({
//   writes: "In the recent era, travel to another country and living there became easier than in the past. Living in a different country where you have to speak a foreign language maybe cause personal and social problems. In this essay, this problem will be clarified.\n\nIn conclusion, foreign languages problems do not occur to all, and it depends on the person himself like his level in that language, how much he lived their beside his character."
// });
// // console.log(input);

// const response = await model.call(input);
// console.log(response)


// console.log(await parser.parse(response));


async function find_MissGrammared_list(reportWritings) {
  try {
    const input = await prompt.format({
      writes: reportWritings,
    });
    const response = await model.call(input);
    let jsonStartIndex = response.indexOf('{');
    let parsed = response.substring(jsonStartIndex);
    parsed = await JSON.parse(parsed);
    parsed = parsed["GrammarMistakes"] || parsed["properties"]["GrammarMistakes"]["description"]

    // console.log(response);
    // console.log(jsonStartIndex);
    // console.log(parsed);
    // console.log("#################");
    return parsed
  } catch (e) {
    console.log("error")
    return "error occured"
  }
}

// find_MissGrammared_list("In the recent era, travel to another country and living there became easier than in the past. Living in a different country where you have to speak a foreign language maybe cause personal and social problems. In this essay, this problem will be clarified.\n\nIn conclusion, foreign languages problems do not occur to all, and it depends on the person himself like his level in that language, how much he lived their beside his character.")

export default find_MissGrammared_list