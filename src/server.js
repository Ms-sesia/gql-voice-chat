import { ApolloServer } from "apollo-server-express";
import { ApolloServerPluginDrainHttpServer } from "apollo-server-core";
import expressPlayground from "graphql-playground-middleware-express";
import express from "express";
import schema from "./schema";
import cors from "cors";
import helmet from "helmet";
import csp from "helmet-csp";
import graphqlUploadExpress from "./libs/graphql_fileUpload/graphqlUploadExpress";
// import { upload, uploadController, uploadSet } from "./libs/fileUpload/upload";
import http from "http";
import dotenv from "dotenv";
dotenv.config();
import path from "path";
import socket from "./libs/socket";

const PORT = process.env.SERVER_PORT;

(async () => {
  const app = express();

  const httpServer = http.createServer(app);

  const apolloServer = new ApolloServer({
    schema,
    plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
    // context: ({ req: request }) => ({ request, isAuthenticated }), // isAuthenticated는 유저 인증시 필요
    context: ({ req: request }) => ({ request }),
  });

  await apolloServer.start();

  app.use(express.static(path.join(__dirname, "../", "Images")));

  app.use(graphqlUploadExpress());

  app.use(cors());
  // app.get("/", expressPlayground({ endpoint: "/graphql" }));

  app.set("views", "./src/viewFiles");
  app.set("view engine", "pug");

  app.get("/", (req, res, next) => {
    res.render("index");
  });

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
  // gql 이용시 multer사용하지 않고 gql로 사용
  /*
    app.get("/api/upload", (req, res) => {
      res.render("upload");
    });
    app.post("/api/uploadTest", uploadSet("uploadTest"), upload, uploadController); 
  
    */

  apolloServer.applyMiddleware({ app });

  // const startServer = await new Promise((resolve) => httpServer.listen({ port: PORT }, resolve));
  // console.log(`Server ready at http://localhost:${PORT}`);
  const server = app.listen(PORT, () => {
    console.log(`Server ready at http://localhost:${PORT}`);
  });

  socket(server);
})();
