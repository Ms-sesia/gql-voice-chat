// export default {
//   Query: {
//     socket: async (_, args, { request }) => {
//       const io = request.app.get("io");
//       console.log
//       io.on("connection", (socket) => {
//         const userId = socket.id;
//         console.log(userId);
//       });
//     },
//   },
// };

import socketIO from "socket.io";
import genRandomString from "./genRandomString";

export default async (server) => {
  const roomName = genRandomString();
  
  const io = socketIO(server, { path: "/socket.io" });

  io.on("connection", (socket) => {
    // 시리얼이 있으면 발신자. 발신자는 socket.id 사용
    // const userId = serial ? socket.id : receiverId;
    const userId = socket.id;
    console.log(userId);

    socket.emit("getRoomName", (roomName) => {
      console.log(roomName);
    });

    socket.on("join_room", (roomName) => {
      console.log("룸에입장하였습니다.");
      socket.join(roomName);
      socket.to(roomName).emit("welcome");
    });

    // console.log(joinRoom);

    socket.on("offer", (offer, roomName) => {
      socket.to(roomName).emit("offer", offer);
    });
    socket.on("answer", (answer, roomName) => {
      socket.to(roomName).emit("answer", answer);
    });
    socket.on("ice", (ice, roomName) => {
      socket.to(roomName).emit("ice", ice);
    });

    socket.on("sendCall", (roomName) => {
      socket.to(roomName).emit("receiveCall");
    });

    socket.on("received", (roomName) => {
      socket.to(roomName).emit("received");
    });

    socket.on("end", (roomName) => {
      socket.to(roomName).emit("close");
      socket.in(roomName).disconnectSockets(true);
    });
  });
};
