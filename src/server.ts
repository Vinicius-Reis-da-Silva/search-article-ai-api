import fastify from "fastify";
import { documentLoader } from "./routes/document-loader";
import { search } from "./routes/search";

const app = fastify()

app.register(documentLoader)
app.register(search);

app.listen({
  port: 3333,
}).then(() => {
  console.log("HTTP Server Running...")
})