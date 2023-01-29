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
import pubsub from "./pubsub";

export default async (server) => {
  const io = socketIO(server, { path: "/socket.io" });

  io.on("connection", (socket) => {
    // 시리얼이 있으면 발신자. 발신자는 socket.id 사용
    // const userId = serial ? socket.id : receiverId;

    const userId = socket.id;
    // console.log(userId);

    socket.on("join_room", (roomName) => {
      console.log("룸에입장하였습니다. roomName:", roomName);
      socket.join(roomName);
      socket.to(roomName).emit("welcome");
    });

    // call 할 때 noti 전송
    // const url = `${process.env.VOICE_URL}${roomName}`;
    // pubsub.publish("sendCall", { sendCallNoti: url });

    
    // socket.on("join_room", (roomName) => {
    //   // room이 생성되지 않은 경우
    //   // room 생성
    //   const createRoomId = genRandomString();
    //   // 생성한 룸에 join
    //   socket.join(createRoomId);
    //   // 접속자(보통 발신자)에게 roomName 전달
    //   console.log("접속Id:", userId);
    //   socket.to(createRoomId).emit("getRoomName", createRoomId);
    //   console.log("룸에입장하였습니다. roomName:", createRoomId);
    // });

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

    // //* 연결 종료 시
    // socket.on("disconnect", () => {
    //   console.log("클라이언트 접속 해제", ip, socket.id);
    //   clearInterval(socket.interval);
    // });

    // //* 클라이언트로 메세지 보내기
    // socket.interval = setInterval(() => {
    //   // 3초마다 클라이언트로 메시지 전송
    //   socket.emit("news", "Hello Socket.IO");
    // }, 3000);
  });
};

/**
 *  socket.request => 요청 객체에 접근
 *  socket.request.res => 응답객체에 접근
 */
