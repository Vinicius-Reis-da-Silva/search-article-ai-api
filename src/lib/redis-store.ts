import "dotenv/config";
import { RedisVectorStore } from "langchain/vectorstores/redis"
import { OpenAIEmbeddings } from "langchain/embeddings/openai"
import { createClient } from "redis"

//creado os embedding e armazenado no banco de dados vetorial
export const redis = createClient({
  url: "redis://127.0.0.1:6379",
})

export const redisVectorStore = new RedisVectorStore(
  new OpenAIEmbeddings({ openAIApiKey: process.env.OPENAI_API_KEY }),
  {
    indexName: 'pdf-embeddings',
    redisClient: redis,
    keyPrefix: 'text',
  }
) 