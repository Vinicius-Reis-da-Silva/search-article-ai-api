import { FastifyInstance } from "fastify"
import { redis, redisVectorStore } from "../lib/redis-store"

export async function search(app: FastifyInstance) {
  app.get('/search', async () => {
    await redis.connect()

    const response = await redisVectorStore.similaritySearchWithScore(
      'Qual é a função do scrum master dentro a metodologia scrum?',
      5
    )
  
    console.log(response)
  
    await redis.disconnect()
  })
}