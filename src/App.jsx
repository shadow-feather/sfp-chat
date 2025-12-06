import React, { useState, useEffect, useRef } from "react";
import io from "socket.io-client";
const socket = io("http://localhost:3001");

const colors = [
  "#4287f5", "#f54291", "#2dd6b6", "#fd7e14", "#6f42c1",
  "#17a2b8", "#ffc107", "#28a745"
];

function getColor(name) {
  // ユーザー名ごとの色分け
  const hash = name.split("").reduce((acc, c) => acc + c.charCodeAt(0), 0);
  return colors[hash % colors.length];
}

export default function App() {
  const [username, setUsername] = useState("");
  const [isJoined, setIsJoined] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef(null);

  useEffect(() => {
    socket.on("chat message", (msg) => {
      setMessages((msgs) => [...msgs, msg]);
    });
    return () => socket.off("chat message");
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleJoin = () => {
    if (username.trim() !== "") setIsJoined(true);
  };

  const handleSend = (e) => {
    e.preventDefault();
    if (input.trim() === "") return;
    socket.emit("chat message", { user: username, text: input });
    setInput("");
  };

  if (!isJoined) {
    return (
      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #f5f7fa, #c3cfe2)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <div style={{
          background: '#fff',
          padding: '32px 28px',
          borderRadius: 16,
          boxShadow: '0 4px 24px rgba(0,0,0,0.08)'
        }}>
          <h2 style={{ color: '#4287f5', marginBottom: 12 }}>表示名でチャット入室</h2>
          <input
            value={username}
            onChange={e => setUsername(e.target.value)}
            placeholder="表示名を入力"
            style={{
              padding: '10px 14px',
              fontSize: 16,
              border: '1px solid #bbb',
              borderRadius: 8,
              width: '180px',
              outline: 'none'
            }}
            autoFocus
          />
          <button
            onClick={handleJoin}
            style={{
              marginLeft: 12,
              padding: '10px 24px',
              background: '#4287f5',
              color: 'white',
              fontWeight: 'bold',
              border: 'none',
              borderRadius: 8,
              fontSize: 16,
              cursor: 'pointer'
            }}>
              入室
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #e2eafc 60%, #fff 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      <div style={{
        background: '#fff',
        width: 380,
        borderRadius: 16,
        boxShadow: '0 4px 24px rgba(0,0,0,0.07)',
        display: 'flex',
        flexDirection: 'column',
        padding: 24
      }}>
        <h2 style={{ textAlign: 'center', color: '#4287f5', marginBottom: 20 }}>
          チャットルーム
        </h2>
        <div style={{
          flex: '1 1 auto',
          border: '1px solid #cdd2d7',
          borderRadius: 8,
          height: 320,
          overflowY: 'auto',
          padding: 12,
          background: '#f5f7fa',
          marginBottom: 18
        }}>
          {messages.map((msg, idx) => (
            <div key={idx} style={{ marginBottom: 9 }}>
              <span style={{
                fontWeight: 'bold',
                color: getColor(msg.user),
                background: "#e2eafc",
                borderRadius: 7,
                padding: "2px 7px",
                marginRight: 6,
                fontSize: 15,
              }}>{msg.user}</span>
              <span style={{ fontSize: 15 }}>{msg.text}</span>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
        <form onSubmit={handleSend} style={{ display: 'flex' }}>
          <input
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder="メッセージを入力"
            style={{
              flex: 1,
              padding: '10px 14px',
              fontSize: 16,
              border: '1px solid #bbb',
              borderRadius: 8,
              marginRight: 12,
              outline: 'none'
            }}
          />
          <button
            type="submit"
            style={{
              padding: '10px 20px',
              background: '#4287f5',
              color: 'white',
              fontWeight: 'bold',
              border: 'none',
              borderRadius: 8,
              fontSize: 16,
              cursor: 'pointer'
            }}>
            送信
          </button>
        </form>
        <div style={{textAlign: 'right', fontSize: 12, color: '#999', marginTop: 7}}>
          あなた: <b>{username}</b>
        </div>
      </div>
    </div>
  );
}