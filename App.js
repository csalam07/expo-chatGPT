import React, { useState, useCallback, useEffect } from 'react';
import { Text, View } from 'react-native';
import { GiftedChat } from 'react-native-gifted-chat';

const baseUrl = 'https://ask-me-anything-ehws.onrender.com/';
export default function App() {
  const [messages, setMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);

  const onSend = useCallback(async (messages = []) => {
    const text = messages[0].text;
    if (text.toUpperCase() === 'CLEAR') {
      return setMessages([]);
    }

    setMessages((previousMessages) =>
      GiftedChat.append(previousMessages, messages),
    );
    setIsTyping(true);

    try {
      const response = await fetch(baseUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ promtData: text }),
      });

      if (response.status === 200) {
        const data = await response.json();
        const parsedData = data?.bot;
        const updatedData = parsedData.substring(parsedData.indexOf('\n') + 1);
        console.log(updatedData);

        const newMessage = {
          _id: data?._id,
          text: updatedData,
          createdAt: new Date(),
          user: {
            _id: 2,
            name: 'gpt',
            avatar:
              'https://images.indianexpress.com/2023/01/chatgpt-extension.jpg',
          },
        };
        setMessages((previousMessages) =>
          GiftedChat.append(previousMessages, newMessage),
        );
      }
      setIsTyping(false);
    } catch (error) {
      alert(error);
      console.log(error);
    }
  }, []);

  return (
    <GiftedChat
      messages={messages}
      onSend={(messages) => onSend(messages)}
      isTyping={isTyping}
      placeholder="Ask me anything"
      scrollToBottom
      user={{
        _id: 1,
      }}
    />
  );
}
