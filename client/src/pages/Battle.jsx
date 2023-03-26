import React, { useState, useEffect } from "react";
import io from "socket.io-client";
import { v4 as uuidv4 } from "uuid";

const socket = io.connect("http://localhost:3001");

const Battle = () => {
  const [room, setRoom] = useState("");
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [messageReceived, setMessageReceived] = useState("");
  const [inRoom, setInRoom] = useState(false);
  const [roomName, setRoomName] = useState("");
  const [gameId, setGameId] = useState("");
  const [players, setPlayers] = useState([]);
  const [username, setUsername] = useState("");

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const gameIdFromUrl = searchParams.get("gameId");
    setGameId(gameIdFromUrl);

    setUsername(localStorage.getItem("username"));
  }, []);

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      sendMessage();
    }
  };

  useEffect(() => {
    const joinRoom = () => {
      if (gameId !== "") {
        socket.emit("join_room", gameId);
        socket.on("join_room_error", (data) => {
          alert(data.message);
          setInRoom(false);
          setRoom("");
        });
        socket.on("join_room_success", () => {
          setInRoom(true);
          setRoom(gameId);
        });
      }
    };

    joinRoom();
  }, [gameId]);

  const leaveRoom = () => {
    socket.emit("leave_room", { game_id: room });
    setInRoom(false);
    setRoom("");
    location.reload();
  };

  const sendMessage = () => {
    socket.emit("send_message", {
      username: username,
      message,
      room: room,
    });
    setMessage("Sent Message"); // clear the message input field after sending the message
  };

  useEffect(() => {
    socket.on("receive_message", (data) => {
      setMessages((messages) => [...messages, data]); // add the new message to the messages array
    });
    return () => {
      socket.off("receive_message"); // remove the event listener when component unmounts
    };
  }, []);

  return (
    <div>
      <h1>Game Lobby Id: {gameId}</h1>
      <p>CurrentRoom: {roomName}</p>
      {inRoom === true && <p>Players: {players.join(", ")}</p>}
      <div>
        {inRoom === true && <button onClick={leaveRoom}>Leave Room</button>}

        {inRoom === false ? (
          <p>Room Id is empty</p>
        ) : (
          <>
            <br />
            {/* chatbox */}
            <input
              placeholder="Message..."
              onChange={(e) => setMessage(e.target.value)}
              className="text-black"
              onKeyPress={handleKeyPress}
            />
            <button onClick={sendMessage}>Send Message</button>
            <h1>Message:</h1>
            {messages.map((message, index) => (
              <div key={index} className="flex flex-col">
                <div className="flex flex-row justify-center">
                  <strong>{message.username}</strong>: {message.message}
                </div>
              </div>
            ))}
            {/* chatbox */}
          </>
        )}
      </div>
    </div>
  );
};

export default Battle;
