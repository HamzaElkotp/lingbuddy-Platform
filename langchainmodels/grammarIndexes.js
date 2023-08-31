import { config } from "dotenv";
// import { config as dotenvConfig } from 'dotenv';
config();

import { TextLoader } from "langchain/document_loaders/fs/text";
import { CharacterTextSplitter } from "langchain/text_splitter";
import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import { FaissStore } from "langchain/vectorstores/faiss";

const loader = new TextLoader("./langchainmodels/texts/grammars.txt");

const docs = await loader.load();

const splitter = new CharacterTextSplitter({
  separator: "\n\n",
  chunkSize: 100,
  chunkOverlap: 50,
});

const documents = await splitter.splitDocuments(docs);
console.log(documents);

const embeddings = new OpenAIEmbeddings();

const vectorstore = await FaissStore.fromDocuments(documents, embeddings);
await vectorstore.save("./langchainmodels/faiss/grammar");
