import io from "socket.io";

export default async (server) => {
  const socket = io(server, { path: "/socket.io" });

  let dataTest = "";

  socket.on("connection", (socket) => {
    const req = socket.request;
    const ip = req.headers["x-forwarded-for"] || req.connection.remoteAddres;
    console.log(req);
    console.log("새로들어온 클라이언트 접속!", ip, socket.id, req.ip);
    socket.on("disconnect", () => {
      console.log("클라이언트 접속 해제", ip, socket.id);
      clearInterval(socket.interval);
    });
    socket.on("error", (error) => {
      console.log("에러:", error);
    });
    socket.on("reply", (data) => {
      console.log("reply 데이터:", data);
      dataTest = "새로 데이터를 만들었습니다.";
      console.log("새로 생성한 dataTest:", dataTest);
    });
    socket.emit("news", "Hello socket.io");
    // socket.interval = setInterval(() => {
    // }, 3000);
  });
};
