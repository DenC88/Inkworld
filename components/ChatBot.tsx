
import React, { useState, useRef, useEffect } from 'react';
import { ChatMessage } from '../types';
import { chatWithBot } from '../services/geminiService';
import { ChatBubbleOvalLeftEllipsisIcon, PaperAirplaneIcon } from './icons';

const ChatBot: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<ChatMessage[]>([
        { role: 'model', content: "Hi! I'm the InkedIn assistant. Ask me about tattoo styles, artists, or anything else!" }
    ]);
    const [userInput, setUserInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(scrollToBottom, [messages]);

    const handleSend = async () => {
        if (!userInput.trim()) return;

        const newMessages: ChatMessage[] = [...messages, { role: 'user', content: userInput }];
        setMessages(newMessages);
        setUserInput('');
        setIsLoading(true);

        try {
            const botResponse = await chatWithBot(userInput);
            setMessages([...newMessages, { role: 'model', content: botResponse }]);
        } catch (error) {
            setMessages([...newMessages, { role: 'model', content: "Sorry, I'm having trouble connecting right now." }]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="fixed bottom-20 right-4 bg-teal-600 text-white p-3 rounded-full shadow-lg hover:bg-teal-500 transition-transform transform hover:scale-110 z-50"
                aria-label="Open Chatbot"
            >
                <ChatBubbleOvalLeftEllipsisIcon className="w-8 h-8" />
            </button>

            {isOpen && (
                <div className="fixed bottom-20 right-4 w-80 h-96 bg-gray-800 border border-gray-700 rounded-lg shadow-2xl flex flex-col z-50 animate-fade-in-up">
                    <header className="bg-gray-900 p-3 text-white font-bold text-center rounded-t-lg">
                        InkedIn Assistant
                    </header>
                    <div className="flex-grow p-3 overflow-y-auto">
                        {messages.map((msg, index) => (
                            <div key={index} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} mb-2`}>
                                <div className={`p-2 rounded-lg max-w-xs text-sm ${msg.role === 'user' ? 'bg-teal-700 text-white' : 'bg-gray-700 text-gray-200'}`}>
                                    {msg.content}
                                </div>
                            </div>
                        ))}
                        {isLoading && (
                            <div className="flex justify-start mb-2">
                               <div className="p-2 rounded-lg bg-gray-700 text-gray-200 text-sm">
                                   <span className="animate-pulse">...</span>
                               </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>
                    <div className="p-2 border-t border-gray-700">
                        <div className="flex items-center bg-gray-700 rounded-lg">
                            <input
                                type="text"
                                value={userInput}
                                onChange={(e) => setUserInput(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && !isLoading && handleSend()}
                                placeholder="Ask something..."
                                className="flex-grow bg-transparent p-2 text-white placeholder-gray-400 focus:outline-none"
                                disabled={isLoading}
                            />
                            <button onClick={handleSend} disabled={isLoading} className="p-2 text-teal-400 hover:text-teal-300 disabled:text-gray-500">
                                <PaperAirplaneIcon className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default ChatBot;
