import React, { useState, useEffect, useRef } from 'react';
// import io from 'socket.io-client'; // Import socket.io-client
import '../style/theme-styles/components/Chatstyles.css';
import { useSocket } from './SocketContext'; // Use the context


const ChatUI = ({ publicId, pdfDocumentName }) => {
    const [messages, setMessages] = useState([
        { id: 1, nickName: '', message: 'Hello there!', type: 'me' }
    ]);
    const [inputText, setInputText] = useState('');
    const socket = useSocket();

    const sendMessage = (text, sender = 'Yahya') => {
        if (text.trim()) {
            console.log('Sending message:', text);
            const newMessage = {
                id: messages.length + 1,
                nickName: sender,
                message: text,
                type: sender === 'Yahya' ? 'user' : 'me',
                publicId: publicId,
                pdfDocumentName: pdfDocumentName
            };
            setMessages(prevMessages => [...prevMessages, newMessage]);
            if (sender === 'Yahya' && socket) {
                console.log('Emitting to socket:', text);
                socket.emit('openai-chat', { query: newMessage });
            }
        }
    };

    useEffect(() => {
        if (socket) {
            const handleResponse = (response) => {
                console.log('Received response:', response);
                const newMessage = {
                    id: messages.length + 1,
                    nickName: '',
                    message: response.recommendation,
                    type: 'me'
                };
                setMessages(prevMessages => [...prevMessages, newMessage]);
            };

            socket.on('openai-query-response', handleResponse);

            return () => {
                socket.off('openai-query-response', handleResponse);
            };
        }
    }, [socket]);

    const handleSend = () => {
        sendMessage(inputText);
        setInputText(''); // Clear the input after sending the message
    };

    return (
        <div id="chat" className="--dark-theme">
            <div className="chat__conversation-board">
                {messages.map((msg, index) => (
                    <div key={index} className={`chat__conversation-board__message-container ${msg.type === 'me' ? 'me' : 'user'}`}>
                        <div className="chat__conversation-board__message__person">
                            {msg.type === 'me' &&
                                <img src="/static/media/scaletransm2.5eb52ef8.png" alt={msg.nickName} style={{ width: '35px', height: '35px', borderRadius: '50%' }} />
                            }
                            <span className="chat__conversation-board__message__person__nickname">{msg.nickName}</span>
                        </div>
                        <div className="chat__conversation-board__message__context">
                            <p className={`chat__conversation-board__message__bubble ${msg.type === 'user' ? 'user-message' : ''}`}>{msg.message}</p>
                        </div>
                    </div>
                ))}
            </div>
            <div className="chat__conversation-panel">
                <input
                    className="chat__conversation-panel__input"
                    placeholder="Ask Casebook AI a question about this document..."
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                            handleSend();
                        }
                    }}
                />
                <button className="chat__conversation-panel__button" onClick={handleSend}>
                    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M2 21l21-9L2 3v7l15 2-15 2v7z" fill="currentColor"/>
                    </svg>
                </button>
            </div>
        </div>
    );
};

export default ChatUI;
