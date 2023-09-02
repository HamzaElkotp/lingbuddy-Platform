import { config } from "dotenv";
config();

import { OpenAIEmbeddings } from "langchain/embeddings/openai";

import { FaissStore } from "langchain/vectorstores/faiss";
import { OpenAI } from "langchain/llms/openai";
import { RetrievalQAChain, loadQAStuffChain } from "langchain/chains";

const embeddings = new OpenAIEmbeddings();
const vectorStore = await FaissStore.load("./langchainmodels/faiss/grammar", embeddings);

const model = new OpenAI({ temperature: 0 });

const chain = new RetrievalQAChain({
  combineDocumentsChain: loadQAStuffChain(model),
  retriever: vectorStore.asRetriever(),
  returnSourceDocuments: true,
});


const grammarsData = [
  {
    shortExplanation: "Modal verbs are auxiliary verbs used to express necessity, possibility, permission, or ability. They combine with the base form of the main verb.",
    examples: [
      "Necessity: 'You must study for the test.'",
      "Possibility: 'She might come to the party.'",
      "Permission: 'Can I borrow your pen?'",
      "Ability: 'He can swim well.'"
    ],
    detailedExplanation: "Modal verbs modify the meaning of the main verb. They don't require an additional auxiliary 'do' in questions and negatives. However, 'have to' is used for obligation.",
    faqs: [
      { question: "Can 'can' express possibility?", answer: "Yes, 'can' can indicate both ability and possibility." },
      { question: "Is 'must' always used for obligation?", answer: "'Must' can also express strong necessity." },
      { question: "What's the difference between 'may' and 'might'?", answer: "'May' suggests higher probability; 'might' implies lower probability." },
      { question: "Is 'shall' used in American English?", answer: "'Shall' is more common in British English, while 'will' is used in American English." },
      { question: "Can modal verbs be used in continuous tenses?", answer: "Modal verbs themselves don't have progressive forms; they're followed by the base verb." }
    ],
  },
  {
    shortExplanation: "The present continuous is used to talk about actions that are happening now or around now. We use the present continuous to talk about temporary situations and actions that are in progress. We also use the present continuous to talk about future arrangements.",
    examples: [
      "I am studying English at the moment.",
      "She is working on a new project.",
      "They are playing football in the park.",
      "He is always complaining about something.",
      "We are having a party next weekend.",
      "She is meeting her friends for lunch tomorrow."
    ],
    detailedExplanation: "The present continuous is used to talk about actions that are happening now or around now. We use the present continuous to talk about temporary situations and actions that are in progress.",
    faqs: [
      { question: "What is the difference between present simple and present continuous?", answer: "The present simple is used to talk about things that are generally true or happen regularly. The present continuous is used to talk about actions that are happening now or around now." },
      { question: "What are some examples of future arrangements using present continuous?", answer: "Here are some examples of future arrangements using present continuous: - We are having a party next weekend. - She is meeting her friends for lunch tomorrow." },
      { question: "What are some examples of verbs of movement used with present continuous?", answer: "Here are some examples of verbs of movement used with present continuous: - I am walking to work today. - She is running in the park." }
    ],
  },
  {
    shortExplanation: "Modal verbs are auxiliary verbs used to express necessity, possibility, permission, or ability. They combine with the base form of the main verb.",
    examples: [
      "Necessity: 'You must study for the test.'",
      "Possibility: 'She might come to the party.'",
      "Permission: 'Can I borrow your pen?'",
      "Ability: 'He can swim well.'"
    ],
    detailedExplanation: "Modal verbs modify the meaning of the main verb. They don't require an additional auxiliary 'do' in questions and negatives. However, 'have to' is used for obligation.",
    faqs: [
      { question: "Can 'can' express possibility?", answer: "Yes, 'can' can indicate both ability and possibility." },
      { question: "Is 'must' always used for obligation?", answer: "'Must' can also express strong necessity." },
      { question: "What's the difference between 'may' and 'might'?", answer: "'May' suggests higher probability; 'might' implies lower probability." },
      { question: "Is 'shall' used in American English?", answer: "'Shall' is more common in British English, while 'will' is used in American English." },
      { question: "Can modal verbs be used in continuous tenses?", answer: "Modal verbs themselves don't have progressive forms; they're followed by the base verb." }
    ],
  },
  {
    shortExplanation: "The present continuous is used to talk about actions that are happening now or around now. We use the present continuous to talk about temporary situations and actions that are in progress. We also use the present continuous to talk about future arrangements.",
    examples: [
      "I am studying English at the moment.",
      "She is working on a new project.",
      "They are playing football in the park.",
      "He is always complaining about something.",
      "We are having a party next weekend.",
      "She is meeting her friends for lunch tomorrow."
    ],
    detailedExplanation: "The present continuous is used to talk about actions that are happening now or around now. We use the present continuous to talk about temporary situations and actions that are in progress.",
    faqs: [
      { question: "What is the difference between present simple and present continuous?", answer: "The present simple is used to talk about things that are generally true or happen regularly. The present continuous is used to talk about actions that are happening now or around now." },
      { question: "What are some examples of future arrangements using present continuous?", answer: "Here are some examples of future arrangements using present continuous: - We are having a party next weekend. - She is meeting her friends for lunch tomorrow." },
      { question: "What are some examples of verbs of movement used with present continuous?", answer: "Here are some examples of verbs of movement used with present continuous: - I am walking to work today. - She is running in the park." }
    ],
  }
]

const pattern = /#Pointer\/(\d+)/;

async function MissGrammared_list(query){
  let newQuery = `return pointer of each grammer: ${query}`
  const res = await chain.call({
    query: newQuery
  });

  let response = await res.text;

  const pattern = /#Pointer\/(\d+)/g;
  let matches = response.match(pattern);

  console.log(matches)

  if(!Array.isArray(matches)){
    matches = [matches]
  }

  const extractedNumbers = matches.map((match) => match.match(/\d+/)[0]);
  
  let arr = [];
  extractedNumbers.forEach((ele)=>{
    arr.push(grammarsData[ele])
  })

  return arr;
}

// get_MissGrammared_list()

export default MissGrammared_list