import socketIO from "socket.io";
import pubsub from "./pubsub";

export default async (server) => {
  const io = socketIO(server, { path: "/socket.io", cors: { origin: "*" } });

  io.on("connection", (socket) => {
    socket.on("join_room", (roomName) => {
      console.log("============== 룸에 입장하였습니다. roomName:", roomName);
      socket.join(roomName);
      socket.to(roomName).emit("welcome");
    });

    socket.on("offer", (offer, roomName) => {
      socket.to(roomName).emit("offer", offer);
    });
    socket.on("answer", (answer, roomName) => {
      socket.to(roomName).emit("answer", answer);
    });
    socket.on("ice", (ice, roomName) => {
      socket.to(roomName).emit("ice", ice);
    });

    socket.on("sendCall", ({ roomName, user_id, qr_id }) => {
      // prisma 통해서 user_id와 qr_id로 QR카드이름 불러오기
      const receiverCardName = "G80 1158";
      // call 할 때 noti 전송
      // const url = `${process.env.VOICE_URL}${roomName}`;
      pubsub.publish("sendCall", {
        sendCallNoti: {
          receiverId: user_id,
          receiveUrl: process.env.VOICE_URL,
          roomName,
          // db통해서 등록한 카드명 불러오기
          msg: `'${receiverCardName}'에서 걸려오는 전화입니다`,
        },
      });
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
