// const socket = io();
let socket = io.connect("https://testvoicesev.platcube.com/", { path: "/socket.io" });

const myFace = document.getElementById("myFace");
const peerFace = document.getElementById("peerFace");
const sendCall = document.getElementById("sendCall");
const callBtn = document.getElementById("sendBtn");
const endBtn = document.getElementById("callEnd");
const receiveBtn = document.getElementById("receiveBtn");
const h3 = document.querySelector("h3");
const h1 = document.querySelector("h1");

endBtn.style.display = "none";
receiveBtn.style.display = "none";

let myStream;
let muted = false;
let cameraOff = false;
// let roomName = "abc";
let myPeerConnection;

/**
 * 접속하면 바로 query 전송 getReceiverInfo => user_id 받음
 */
// 우선 임의로 지정
const user_id = 4;

// roomName생성
const chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz";
const stringLength = 6;
let roomName = "";
for (let i = 0; i < stringLength; i++) {
  const rnum = Math.floor(Math.random() * chars.length);
  roomName += chars.substring(rnum, rnum + 1);
}

initCall();

async function getMedia(deviceId) {
  try {
    myStream = await navigator.mediaDevices.getUserMedia({
      audio: true,
      video: false,
    });
  } catch (e) {
    console.log(e);
  }
}

callBtn.addEventListener("click", handleCallSend);
endBtn.addEventListener("click", handleCallEnd);
receiveBtn.addEventListener("click", handleCallReceive);

async function initCall() {
  await getMedia(); //카메라, 마이크 불러옴
  makeConnection();
  console.log("socket정보:", socket);
  console.log("연결됨");
}

// 전화 수신
async function handleCallSend() {
  callBtn.style.display = "none";
  endBtn.style.display = "flex";

  h3.innerText = "전화 수신 중";
  h1.innerText = "";

  socket.emit("sendCall", { roomName, user_id });
}

// 수신 종료
async function handleCallEnd() {
  endBtn.style.display = "none";
  callBtn.style.display = "flex";

  socket.emit("end", roomName);
}

// 전화 받기
async function handleCallReceive() {
  receiveBtn.style.display = "none";
  endBtn.style.display = "flex";

  socket.emit("received", roomName);
  peerFace.play();
}

// socket code

// 연결
socket.on("welcome", async () => {
  const offer = await myPeerConnection.createOffer();
  myPeerConnection.setLocalDescription(offer);
  console.log("send offer");
  socket.emit("offer", offer, roomName);
});

// 연결
socket.on("offer", async (offer) => {
  myPeerConnection.setRemoteDescription(offer);
  const answer = await myPeerConnection.createAnswer();
  myPeerConnection.setLocalDescription(answer);
  socket.emit("answer", answer, roomName);
});

// 연결
socket.on("answer", (answer) => {
  myPeerConnection.setRemoteDescription(answer);
});

// 연결
socket.on("ice", (ice) => {
  myPeerConnection.addIceCandidate(ice);
});

// 전화가 왔을 때
socket.on("receiveCall", () => {
  h3.innerText = "BMW X5 차주";
  h1.innerText = "";

  receiveBtn.style.display = "flex";
  callBtn.style.display = "none";
});

// 내가 건 전화에 상대방이 받았을 때
socket.on("received", () => {
  peerFace.play();
});

// 전화 끊기
socket.on("close", () => {
  myPeerConnection.close();
  endBtn.style.display = "none";
  callBtn.style.display = "flex";
});

// RTC code

function makeConnection() {
  myPeerConnection = new RTCPeerConnection({
    iceServers: [
      {
        urls: [
          "stun:stun.l.google.com:19302",
          "stun:stun1.l.google.com:19302",
          "stun:stun2.l.google.com:19302",
          "stun:stun3.l.google.com:19302",
          "stun:stun4.l.google.com:19302",
        ],
      },
    ],
  });
  // icecandidate는 Internet Connectivity Establishment(인터넷 연결 생성)이다.
  myPeerConnection.addEventListener("icecandidate", handleIce);

  // // 룸이름 받아오기
  // socket.on("getRoomId", (roomId) => {
  //   roomName = roomId;
  // });

  socket.emit("join_room", roomName);

  myPeerConnection.addEventListener("addstream", handleAddStream);
  myPeerConnection.addEventListener("track", handleTrack);

  myStream.getTracks().forEach((track) => {
    myPeerConnection.addTrack(track, myStream);
  });
}

socket.on("getRoomName", (roomId) => {
  console.log("roomId:", roomId);
  roomName = roomId;
});

function handleIce(data) {
  console.log(data);
  socket.emit("ice", data.candidate, roomName);
}

function handleTrack(data) {
  const peerFace = document.querySelector("#peerFace");
  peerFace.srcObject = data.streams[0];
  peerFace.pause();
}

function handleAddStream(data) {
  peerFace.srcObject = data.stream;
  peerFace.pause();
}
