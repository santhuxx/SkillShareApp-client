import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const MessagePage = () => {
  const { userId } = useParams();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editingMessageId, setEditingMessageId] = useState(null);
  const [editContent, setEditContent] = useState("");

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8080/api/chat/messages/${userId}`,
          { withCredentials: true }
        );
        setMessages(response.data);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch messages");
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();
  }, [userId]);

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;

    try {
      const response = await axios.post(
        "http://localhost:8080/api/chat/message",
        null,
        {
          params: {
            receiverId: userId,
            content: newMessage,
          },
          withCredentials: true,
        }
      );

      setMessages([...messages, response.data]);
      setNewMessage("");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to send message");
    }
  };

  const handleEditMessage = async (messageId) => {
    try {
      const response = await axios.put(
        `http://localhost:8080/api/chat/message/${messageId}`,
        null,
        {
          params: {
            newContent: editContent,
          },
          withCredentials: true,
        }
      );

      setMessages(messages.map(msg => 
        msg.id === messageId ? { ...msg, content: editContent, edited: true } : msg
      ));
      setEditingMessageId(null);
      setEditContent("");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update message");
    }
  };

  const handleDeleteMessage = async (messageId) => {
    if (!window.confirm("Are you sure you want to delete this message?")) return;

    try {
      await axios.delete(
        `http://localhost:8080/api/chat/message/${messageId}`,
        { withCredentials: true }
      );

      setMessages(messages.filter(msg => msg.id !== messageId));
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete message");
    }
  };

  const startEditing = (message) => {
    setEditingMessageId(message.id);
    setEditContent(message.content);
  };

  if (loading) {
    return (
      <div style={styles.loadingContainer}>
        <div style={styles.spinner}></div>
        <p style={styles.loadingText}>Loading messages...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={styles.errorContainer}>
        <div style={styles.errorIcon}>⚠️</div>
        <p style={styles.errorText}>{error}</p>
        <button 
          onClick={() => window.location.reload()} 
          style={styles.retryButton}
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h2 style={styles.title}>Chat with {userId}</h2>
      </div>
      
      <div style={styles.messagesContainer}>
        {messages.length === 0 ? (
          <div style={styles.emptyState}>
            <div style={styles.emptyIcon}>💬</div>
            <p style={styles.emptyText}>No messages yet</p>
            <p style={styles.emptySubtext}>Send a message to start the conversation!</p>
          </div>
        ) : (
          messages.map((message) => {
            const isCurrentUser = message.senderId !== userId;

            return (
              <div 
                key={message.id} 
                style={{
                  ...styles.messageWrapper,
                  justifyContent: isCurrentUser ? 'flex-end' : 'flex-start'
                }}
              >
                {editingMessageId === message.id ? (
                  <div style={styles.editContainer}>
                    <textarea
                      value={editContent}
                      onChange={(e) => setEditContent(e.target.value)}
                      style={styles.editTextarea}
                      autoFocus
                    />
                    <div style={styles.editButtons}>
                      <button 
                        onClick={() => setEditingMessageId(null)}
                        style={styles.cancelButton}
                      >
                        Cancel
                      </button>
                      <button 
                        onClick={() => handleEditMessage(message.id)}
                        style={styles.saveButton}
                      >
                        Save Changes
                      </button>
                    </div>
                  </div>
                ) : (
                  <div style={{
                    ...styles.messageBubble,
                    backgroundColor: isCurrentUser ? '#007AFF' : '#F1F1F1',
                    color: isCurrentUser ? 'white' : '#333'
                  }}>
                    <p style={styles.messageContent}>{message.content}</p>
                    <div style={styles.messageMeta}>
                      <span style={styles.messageTime}>
                        {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                      {message.edited && (
                        <span style={styles.editedLabel}>edited</span>
                      )}
                    </div>
                    
                    {isCurrentUser && (
                      <div style={styles.messageActions}>
                        <button 
                          onClick={() => startEditing(message)}
                          style={styles.actionButton}
                        >
                          ✏️
                        </button>
                        <button 
                          onClick={() => handleDeleteMessage(message.id)}
                          style={styles.actionButton}
                        >
                          🗑️
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
      
      <div style={styles.inputContainer}>
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type a message..."
          style={styles.messageInput}
          onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
        />
        <button 
          onClick={handleSendMessage} 
          style={styles.sendButton}
          disabled={!newMessage.trim()}
        >
          <span style={styles.sendButtonText}>Send</span>
          
        </button>
      </div>
    </div>
  );
};

// Styles
const styles = {
  container: {
    maxWidth: "600px",
    margin: "0 auto",
    padding: "20px",
    height: "100vh",
    display: "flex",
    flexDirection: "column",
    backgroundColor: "#f8f9fa",
    fontFamily: "'Segoe UI', Roboto, sans-serif"
  },
  header: {
    padding: "15px 0",
    borderBottom: "1px solid #e0e0e0",
    marginBottom: "15px"
  },
  title: {
    margin: 0,
    color: "#333",
    fontSize: "24px",
    fontWeight: "600"
  },
  messagesContainer: {
    flex: 1,
    overflowY: "auto",
    padding: "15px",
    borderRadius: "12px",
    backgroundColor: "white",
    boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
    marginBottom: "15px"
  },
  messageWrapper: {
    display: "flex",
    marginBottom: "12px"
  },
  messageBubble: {
    maxWidth: "75%",
    padding: "12px 16px",
    borderRadius: "18px",
    position: "relative",
    boxShadow: "0 1px 2px rgba(0,0,0,0.1)"
  },
  messageContent: {
    margin: "0 0 5px 0",
    fontSize: "15px",
    lineHeight: "1.4"
  },
  messageMeta: {
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-end",
    fontSize: "11px",
    opacity: "0.8",
    gap: "5px"
  },
  messageTime: {
    fontStyle: "italic"
  },
  editedLabel: {
    fontSize: "10px",
    padding: "2px 5px",
    borderRadius: "3px",
    backgroundColor: "rgba(0,0,0,0.1)"
  },
  messageActions: {
    position: "absolute",
    top: "-15px",
    right: "0",
    display: "flex",
    gap: "5px",
    backgroundColor: "white",
    padding: "3px",
    borderRadius: "15px",
    boxShadow: "0 1px 3px rgba(0,0,0,0.2)"
  },
  actionButton: {
    background: "none",
    border: "none",
    cursor: "pointer",
    fontSize: "14px",
    padding: "3px 5px",
    borderRadius: "50%",
    width: "25px",
    height: "25px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    transition: "background 0.2s",
    ':hover': {
      backgroundColor: "#f0f0f0"
    }
  },
  inputContainer: {
    display: "flex",
    gap: "10px",
    padding: "10px",
    backgroundColor: "white",
    borderRadius: "25px",
    boxShadow: "0 2px 10px rgba(0,0,0,0.1)"
  },
  messageInput: {
    flex: 1,
    padding: "12px 15px",
    borderRadius: "20px",
    border: "1px solid #e0e0e0",
    outline: "none",
    fontSize: "15px",
    ':focus': {
      borderColor: "#007AFF"
    }
  },
  sendButton: {
    padding: "0 20px",
    backgroundColor: "#007AFF",
    color: "white",
    border: "none",
    borderRadius: "20px",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    gap: "5px",
    transition: "background 0.2s",
    ':disabled': {
      backgroundColor: "#cccccc",
      cursor: "not-allowed"
    },
    ':hover:not(:disabled)': {
      backgroundColor: "#0066CC"
    }
  },
  sendButtonText: {
    fontSize: "14px",
    fontWeight: "500"
  },
  sendIcon: {
    fontSize: "16px"
  },
  editContainer: {
    width: "100%",
    backgroundColor: "#f5f5f5",
    padding: "12px",
    borderRadius: "12px",
    marginBottom: "10px"
  },
  editTextarea: {
    width: "100%",
    padding: "10px",
    borderRadius: "8px",
    border: "1px solid #ddd",
    minHeight: "80px",
    fontSize: "15px",
    resize: "none",
    outline: "none",
    marginBottom: "10px",
    fontFamily: "inherit"
  },
  editButtons: {
    display: "flex",
    justifyContent: "flex-end",
    gap: "10px"
  },
  cancelButton: {
    padding: "8px 15px",
    backgroundColor: "#f0f0f0",
    border: "1px solid #ddd",
    borderRadius: "6px",
    cursor: "pointer",
    transition: "background 0.2s",
    ':hover': {
      backgroundColor: "#e0e0e0"
    }
  },
  saveButton: {
    padding: "8px 15px",
    backgroundColor: "#007AFF",
    color: "white",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    transition: "background 0.2s",
    ':hover': {
      backgroundColor: "#0066CC"
    }
  },
  loadingContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    height: "100vh",
    backgroundColor: "#f8f9fa"
  },
  spinner: {
    border: "4px solid rgba(0, 122, 255, 0.2)",
    borderTop: "4px solid #007AFF",
    borderRadius: "50%",
    width: "40px",
    height: "40px",
    animation: "spin 1s linear infinite",
    marginBottom: "15px"
  },
  loadingText: {
    color: "#666",
    fontSize: "16px"
  },
  errorContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    height: "100vh",
    backgroundColor: "#f8f9fa",
    padding: "20px",
    textAlign: "center"
  },
  errorIcon: {
    fontSize: "48px",
    marginBottom: "15px"
  },
  errorText: {
    color: "#d32f2f",
    fontSize: "18px",
    marginBottom: "20px"
  },
  retryButton: {
    padding: "10px 20px",
    backgroundColor: "#d32f2f",
    color: "white",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    transition: "background 0.2s",
    ':hover': {
      backgroundColor: "#b71c1c"
    }
  },
  emptyState: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    height: "100%",
    color: "#666"
  },
  emptyIcon: {
    fontSize: "48px",
    marginBottom: "10px"
  },
  emptyText: {
    fontSize: "18px",
    fontWeight: "500",
    marginBottom: "5px"
  },
  emptySubtext: {
    fontSize: "14px",
    opacity: "0.7"
  }
};

export default MessagePage;