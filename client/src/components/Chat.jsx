import { useState, useEffect, useRef } from "react";
import io from "socket.io-client";

const socket = io.connect("http://localhost:3001");

const Chat = ({ room }) => {
  const [messages, setMessages] = useState([]);
  const [messageReceived, setMessageReceived] = useState("");
  const [username, setUsername] = useState("");
  //   const [messages, setMessages] = useState([
  //     { id: 1, text: "Hey man", sender: "user" },
  //     { id: 2, text: "Goodluck in the game", sender: "other" },
  //   ]);

  const [inputValue, setInputValue] = useState("");
  const [isChatHidden, setIsChatHidden] = useState(false);
  const messagesEndRef = useRef(null);
  const [canSendMessage, setCanSendMessage] = useState(true);
  const [errorMessages, setErrorMessages] = useState("");

  //   const sendMessage = () => {
  //     if (inputValue.trim() === "") {
  //       return;
  //     }

  //     setMessages([
  //       ...messages,
  //       { id: messages.length + 1, text: inputValue, sender: "user" },
  //     ]);
  //     setInputValue("");
  //   };

  useEffect(() => {
    setUsername(localStorage.getItem("username"));
  }, []);

  const sendMessage = () => {
    if (!canSendMessage) {
      setErrorMessages("You can only send a message every 3 seconds");
      return;
    }
    setCanSendMessage(false);
    setTimeout(() => setCanSendMessage(true), 3000);

    socket.emit("send_message", {
      sender: username,
      message: inputValue,
      room: room,
    });
    setInputValue("");
  };

  useEffect(() => {
    socket.on("receive_message", (data) => {
      setMessages((messages) => [...messages, data]);
    });
    return () => {
      socket.off("receive_message");
    };
  }, []);

  const handleInputKeyDown = (event) => {
    if (event.key === "Enter") {
      sendMessage();
    }
  };

  const toggleChat = () => {
    setIsChatHidden(!isChatHidden);
  };

  useEffect(() => {
    messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
  }, [messages, isChatHidden]);

  return (
    <>
      <div
        className={`fixed bottom-0 right-0 m-6 font-rajdhani ${
          isChatHidden ? "hidden" : "block"
        }`}
      >
        <div className="max-w-md w-full mx-auto">
          <div className="bg-gray-900 rounded-lg shadow-lg">
            <div className="px-4 py-4 sm:px-6">
              <h2 className="text-2xl font-medium text-gray-100">Chat</h2>
            </div>
            <div className="min-w-[350px] max-w-[350px] min-h-[300px] max-h-[300px] overflow-y-auto">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`${
                    message.sender === username ? "flex-row-reverse" : ""
                  } flex px-4 py-2 max-w-1/2`}
                >
                  <div
                    className={`${
                      message.sender === username
                        ? "bg-[#00a7ff] text-gray-900"
                        : "bg-[#d94747] text-gray-100"
                    } rounded-lg p-2`}
                  >
                    {message.message}
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
            <div className="px-4 py-4 sm:px-6">
              <div className="flex space-x-3">
                <input
                  type="text"
                  value={inputValue}
                  onChange={(event) => setInputValue(event.target.value)}
                  onKeyDown={handleInputKeyDown}
                  className="flex-1 appearance-none border rounded py-2 px-3 text-black leading-tight focus:outline-none focus:shadow-outline"
                  placeholder="Type your message here..."
                />
                <button
                  type="button"
                  onClick={sendMessage}
                  className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-gray-900 bg-red-500 hover:bg-red-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500"
                >
                  Send
                </button>
              </div>
            </div>
            <button
              type="button"
              onClick={toggleChat}
              className="absolute top-0 right-0 mr-2 mt-2 text-gray-200 hover:text-gray-100 focus:outline-none focus:text-gray-100"
            >
              {isChatHidden ? "Show Chat" : "Hide Chat"}
            </button>
          </div>
        </div>
      </div>
      {isChatHidden && (
        <div className="fixed bottom-4 right-4">
          <div
            className="bg-blue-500 rounded-full w-20 h-20 flex justify-center items-center cursor-pointer hover:bg-blue-600"
            onClick={toggleChat}
          >
            <img
              src="https://uxwing.com/wp-content/themes/uxwing/download/communication-chat-call/chat-icon.png"
              alt="chat icon"
              className="h-12"
            />
          </div>
        </div>
      )}
    </>
  );
};

export default Chat;
