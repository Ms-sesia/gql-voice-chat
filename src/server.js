import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";
import { ApolloServerPluginDrainHttpServer } from "@apollo/server/plugin/drainHttpServer";
import express from "express";
import http from "http";
import cors from "cors";
import { json } from "body-parser";

import schema from "./schema";
import graphqlUploadExpress from "./libs/graphql_fileUpload/graphqlUploadExpress";
import dotenv from "dotenv";
dotenv.config();
import path from "path";

/* subscription modules */
import { WebSocketServer } from "ws";
import { useServer } from "graphql-ws/lib/use/ws";

import voiceServer from "./libs/voiceServer";

const PORT = process.env.SERVER_PORT;

(async () => {
  const app = express();

  const httpServer = http.createServer(app);

  const wsServer = new WebSocketServer({
    server: httpServer,
    path: "/graphql",
  });

  const serverCleanup = useServer({ schema }, wsServer);

  const apolloServer = new ApolloServer({
    schema,
    plugins: [
      ApolloServerPluginDrainHttpServer({ httpServer }),
      {
        async serverWillStart() {
          return {
            async drainServer() {
              await serverCleanup.dispose();
            },
          };
        },
      },
    ],
  });

  await apolloServer.start();

  app.use(
    "/graphql",
    cors(),
    json(),
    expressMiddleware(apolloServer, {
      // context: async ({ request }) => ({ request, isAuthenticated }),
      context: async ({ request }) => ({ request }),
    })
  );

  app.use(express.static(path.join(__dirname, "../", "Images")));
  app.use("/public", express.static(path.join(__dirname, "viewFiles", "public")));

  app.use(graphqlUploadExpress());

  app.set("view engine", "pug");
  app.set("views", "./src/viewFiles");

  /* io 전역 설정 */
  // const io = socketIO(server, { path: "/socket.io" });
  // app.set("io", io);
  // app.get("/server", (req, res, next) => socket(req, res, next));

  // 다른 path redirect
  app.get("/voice", (_, res) => res.render("home"));
  app.get("/*", (_, res) => res.redirect("/voice"));

  await new Promise((resolve) => httpServer.listen({ port: PORT }, resolve));
  console.log(`Server ready at http://localhost:${PORT}`);

  voiceServer(httpServer);
})();
