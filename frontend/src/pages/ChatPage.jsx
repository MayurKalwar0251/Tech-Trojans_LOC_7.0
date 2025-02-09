import React, { useState, useEffect, useContext, useRef } from "react";
import { UserContext } from "../context/userContext";
import { useSocket } from "../context/SocketContext";
import axios from "../api";
import { FiPlus, FiX, FiSend } from "react-icons/fi";

const ChatPage = () => {
  const { user } = useContext(UserContext);
  const socket = useSocket();
  const [chats, setChats] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [showSearchPopup, setShowSearchPopup] = useState(false);
  const [loading, setLoading] = useState(false);

  // Add ref for auto-scrolling
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Auto-scroll when messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const canSendMessage = () => {
    if (!user || !selectedChat) return false;
    const recipient = selectedChat.users.find((u) => u._id !== user._id);
    if (user.role === "inspector") return true;
    if (user.role === "inspector") return false;
    return false;
  };

  useEffect(() => {
    const fetchChats = async () => {
      try {
        const response = await axios.get("http://localhost:3000/api/v1/chat/");
        setChats(response.data.chats);
      } catch (error) {
        console.error("Error fetching chats", error);
      }
    };
    fetchChats();
  }, [socket, selectedChat]);

  useEffect(() => {
    if (socket && user) {
      socket.on("receive_message", (data) => {
        console.log("Received message:", data);
        if (selectedChat && data.chatBW._id === selectedChat._id) {
          fetchMessages(selectedChat._id);
        }
      });
      return () => {
        socket.off("receive_message");
      };
    }
  }, [socket, user, selectedChat]);

  const fetchMessages = async (chatId) => {
    setLoading(true);
    try {
      const response = await axios.get(
        `http://localhost:3000/api/v1/message/${chatId}`
      );
      setMessages(response.data.messages);
    } catch (error) {
      console.error("Error fetching messages:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectChat = async (chat) => {
    setSelectedChat(chat);
    await fetchMessages(chat._id);
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedChat || !socket || !canSendMessage()) {
      return;
    }

    const messageData = {
      content: newMessage,
      sender: user,
      chatId: selectedChat._id,
      receiver: [selectedChat.users.find((u) => u._id !== user._id)],
      chatBW: selectedChat._id,
    };

    try {
      const response = await axios.post(
        "http://localhost:3000/api/v1/message/",
        messageData
      );

      const sentMessage = response.data.messageSend;
      setMessages((prevMessages) => [...prevMessages, sentMessage]);
      socket.emit("send_message", sentMessage);
      setNewMessage("");
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  const handleSearch = async (query) => {
    if (user.role !== "INSPECTOR") return;

    try {
      const response = await axios.post(
        `http://localhost:3000/api/v1/police-member/search`,
        { email: query }
      );
      setSearchResults(response.data.members.filter((u) => u._id !== user._id));
    } catch (error) {
      console.error("Error searching users", error);
    }
  };

  const handleCreateChat = async (userId) => {
    if (user.role !== "INSPECTOR") return;

    try {
      const response = await axios.post("http://localhost:3000/api/v1/chat/", {
        userId: userId,
      });
      setChats((prevChats) => [...prevChats, response.data.chat]);
      socket.emit("new_chat", response.data.chat);
      setShowSearchPopup(false);
      setSearchQuery("");
      setSearchResults([]);
    } catch (error) {
      console.error("Error creating chat", error);
    }
  };

  return (
    <div className="flex h-screen bg-gray-100 p-6">
      {/* Sidebar */}
      <div className="w-1/4 bg-white rounded-l-xl shadow-lg flex flex-col">
        <div className="p-4 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-800">Chats</h2>
        </div>

        <div className="flex-1 overflow-y-auto">
          <ul className="p-2 space-y-2">
            {chats.map((chat) => {
              const oppositeUser = chat.users.find((u) => u._id !== user._id);
              return (
                <li
                  key={chat._id}
                  onClick={() => handleSelectChat(chat)}
                  className={`p-4 rounded-lg transition-all duration-200 cursor-pointer ${
                    selectedChat?._id === chat._id
                      ? "bg-blue-500 text-white shadow-md"
                      : "hover:bg-gray-50"
                  }`}
                >
                  <div className="flex justify-between items-center">
                    <span className="font-medium">{oppositeUser?.name}</span>
                    <span
                      className={`text-sm ${
                        selectedChat?._id === chat._id
                          ? "text-blue-100"
                          : "text-gray-500"
                      }`}
                    >
                      {oppositeUser?.role}
                    </span>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>

        {user.role === "INSPECTOR" && (
          <div className="p-4">
            <button
              onClick={() => setShowSearchPopup(true)}
              className="w-full py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg shadow-md transition-colors duration-200 flex items-center justify-center space-x-2"
            >
              <FiPlus className="w-5 h-5" />
              <span>New Chat</span>
            </button>
          </div>
        )}
      </div>

      {/* Main Chat Area */}
      <div className="w-3/4 bg-white rounded-r-xl shadow-lg flex flex-col">
        {selectedChat ? (
          <>
            <div className="p-4 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-800">
                Chat with{" "}
                {selectedChat.users.find((u) => u._id !== user._id)?.name}
              </h2>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {loading ? (
                <div className="flex items-center justify-center h-full">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                </div>
              ) : (
                <>
                  {messages.map((msg, index) => (
                    <div
                      key={index}
                      className={`flex ${
                        msg.sender === user._id
                          ? "justify-end"
                          : "justify-start"
                      }`}
                    >
                      <div
                        className={`max-w-[70%] p-3 rounded-2xl ${
                          msg.sender === user._id
                            ? "bg-blue-500 text-white rounded-br-none"
                            : "bg-gray-100 text-gray-800 rounded-bl-none"
                        }`}
                      >
                        <p className="break-words">{msg.content}</p>
                      </div>
                    </div>
                  ))}
                  <div ref={messagesEndRef} />
                </>
              )}
            </div>

            <div className="p-4 border-t border-gray-200">
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === "Enter") {
                      handleSendMessage();
                    }
                  }}
                  placeholder={
                    canSendMessage()
                      ? "Type a message..."
                      : "You don't have permission to send messages"
                  }
                  disabled={!canSendMessage()}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <button
                  onClick={handleSendMessage}
                  disabled={!canSendMessage()}
                  className={`px-6 py-2 rounded-lg flex items-center space-x-2 ${
                    canSendMessage()
                      ? "bg-blue-500 hover:bg-blue-600 text-white"
                      : "bg-gray-200 text-gray-400 cursor-not-allowed"
                  }`}
                >
                  <span>Send</span>
                  <FiSend className="w-4 h-4" />
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <p className="text-gray-500 text-lg">
              Select a chat to start messaging
            </p>
          </div>
        )}
      </div>

      {/* Search Popup */}
      {showSearchPopup && user.role === "INSPECTOR" && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-96 max-w-[90%] shadow-2xl">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold text-gray-800">
                Search Users
              </h3>
              <button
                onClick={() => {
                  setShowSearchPopup(false);
                  setSearchQuery("");
                  setSearchResults([]);
                }}
                className="text-gray-500 hover:text-gray-700 transition-colors duration-200"
              >
                <FiX className="w-6 h-6" />
              </button>
            </div>

            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                handleSearch(e.target.value);
              }}
              placeholder="Search by email..."
              className="w-full p-3 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />

            <div className="max-h-60 overflow-y-auto">
              <ul className="space-y-2">
                {searchResults.map((user) => (
                  <li
                    key={user._id}
                    onClick={() => handleCreateChat(user._id)}
                    className="p-3 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors duration-200"
                  >
                    <div className="flex justify-between items-center">
                      <span className="font-medium">{user.name}</span>
                      <span className="text-sm text-gray-500">{user.role}</span>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatPage;
