import { ApolloServer } from "apollo-server-express";
import { ApolloServerPluginDrainHttpServer } from "apollo-server-core";
import expressPlayground from "graphql-playground-middleware-express";
import express from "express";
import schema from "./schema";
import cors from "cors";
import helmet from "helmet";
import csp from "helmet-csp";
import { upload, uploadController, uploadSet } from "./libs/fileUpload/upload";
import http from "http";
import dotenv from "dotenv";
dotenv.config();
import path from "path";

const PORT = process.env.SERVER_PORT;

(async () => {
  const app = express();

  const httpServer = http.createServer(app);

  const server = new ApolloServer({
    schema,
    plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
    // context: ({ req: request }) => ({ request, isAuthenticated }),
    context: ({ req: request }) => ({ request }),
  });

  await server.start();

  app.use(express.static(path.join(__dirname, "../", "Images")));

  app.use(cors());
  
  app.get("/api/upload", (req, res) => {
    res.render("upload");
  });
  app.post("/api/uploadTest", uploadSet("uploadTest"), upload, uploadController); // 이벤트, 쿠폰 등 기타이미지
  
  app.use(helmet());
  app.use(
    csp({
      useDefaults: true,
      directives: {
        defaultSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        styleSrcElem: ["'self'", "fonts.googleapis.com", "cdn.jsdelivr.net", "'unsafe-inline'"],
        imgSrc: ["'self'", "cdn.jsdelivr.net"],
        scriptSrcElem: ["'self'", "cdn.jsdelivr.net", "'unsafe-inline'"],
        fontSrc: ["'self'", "'unsafe-inline'", "fonts.gstatic.com"],
      },
    })
  );

  app.get("/", expressPlayground({ endpoint: "/graphql" }));

  app.set("views", "./src/viewFiles");
  app.set("view engine", "pug");

  // app.get("/", (req, res) => {
  //   res.send("Hello Express.");
  // });

  server.applyMiddleware({ app });

  await new Promise((resolve) => httpServer.listen({ port: PORT }, resolve));
  console.log(`Server ready at http://localhost:${PORT}`);
})();
