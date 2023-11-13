import "dotenv/config";
import { FastifyInstance } from "fastify";
import { PDFLoader } from "langchain/document_loaders/fs/pdf";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { redis } from "../lib/redis-store";
import { RedisVectorStore } from "langchain/vectorstores/redis";
import { OpenAIEmbeddings } from "langchain/embeddings/openai";

export async function documentLoader(app: FastifyInstance) {
  app.get('/loader', async () => {
  
    // Carregando arquivos local
    const file = new PDFLoader('./src/tmp/ScrumGuide2020-Português.pdf');
    const doc = await file.load();
  
    // separando o conteudo do arquivo em pequenas partes ( criando os ckuncks )
    const textSplitter = new RecursiveCharacterTextSplitter({
      chunkSize: 1000,
      chunkOverlap: 100,
    });
  
    const splittedDocuments = await textSplitter.splitDocuments(doc);
  
    /* Create instance */
    const embedding = new OpenAIEmbeddings({ openAIApiKey: process.env.OPENAI_API_KEY })
    
    /* Embed queries */
    
    await redis.connect()
    
    console.log(splittedDocuments)

    await RedisVectorStore.fromDocuments(
      splittedDocuments,
      embedding,
      {
        indexName: 'pdf-embeddings',
        redisClient: redis,
        keyPrefix: 'text',
      }
    )
    
    await redis.disconnect()
    
    return;
  })
}