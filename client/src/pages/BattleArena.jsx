import React, { useContext, useEffect, useState } from "react";
import { UserContext } from "../context/UserProvider";
import io from "socket.io-client";

const socket = io.connect("http://localhost:3001");

const BattleArena = () => {
  const { walletAddress } = useContext(UserContext);
  const [message, setMessage] = useState("");
  const [messageReceived, setMessageReceived] = useState("");
  const [room, setRoom] = useState("");
  const [inRoom, setInRoom] = useState(false);
  const [roomName, setRoomName] = useState("");

  const createRoom = () => {
    if (roomName !== "") {
      socket.emit("create_room", roomName);
      socket.on("create_room_error", (data) => {
        alert(data.message);
        setInRoom(false);
        setRoom("");
      });
      socket.on("create_room_success", () => {
        setInRoom(true);
        setRoom(roomName);
      });
    }
  };

  const joinRoom = () => {
    if (room !== "") {
      socket.emit("join_room", room);
      socket.on("join_room_error", (data) => {
        alert(data.message);
        setInRoom(false);
        setRoom("");
      });
      socket.on("join_room_success", () => {
        setInRoom(true);
      });
    }
  };

  const leaveRoom = () => {
    socket.emit("leave_room", room);
    setInRoom(false);
    setRoom("");
    location.reload();
  };

  const sendMessage = () => {
    socket.emit("send_message", { message, room });
  };

  useEffect(() => {
    socket.on("receive_message", (data) => {
      setMessageReceived(data.message);
    });
  }, [socket]);

  return (
    <div>
      <p>My wallet address: {walletAddress}</p>

      <div>
        {inRoom === true ? (
          <button onClick={leaveRoom}>Leave Room</button>
        ) : (
          <>
            <>
              <input
                placeholder="Room Name"
                onChange={(e) => setRoomName(e.target.value)}
                className="text-black"
              />
              <button onClick={createRoom}>Create Room</button>
            </>
            <br />
            <>
              <input
                placeholder="Room Id"
                onChange={(e) => setRoom(e.target.value)}
                className="text-black"
              />
              <button onClick={joinRoom}>Join Room</button>
              <br />
            </>
          </>
        )}

        {inRoom === false ? (
          <p>Room Id is empty</p>
        ) : (
          <>
            <br />
            <input
              placeholder="Message..."
              onChange={(e) => setMessage(e.target.value)}
              className="text-black"
            />
            <button onClick={sendMessage}>Send Message</button>
            <h1>Message:</h1>
            <p>{messageReceived}</p>
          </>
        )}
      </div>
    </div>
  );
};

export default BattleArena;
