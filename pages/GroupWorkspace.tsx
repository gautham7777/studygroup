import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { studyGroups, subjects, users, sharedContents } from '../data/mockData';
import { useAuth } from '../contexts/AuthContext';
import { suggestStudyPlan, summarizeText } from '../services/geminiService';
import Whiteboard from '../components/Whiteboard';
import { useGroupChat } from '../hooks/useGroupChat';

type ActiveTab = 'scratchpad' | 'whiteboard';

const GroupWorkspace: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const { user } = useAuth();
    const groupId = parseInt(id || '0', 10);

    const { messages, sendMessage } = useGroupChat(groupId);
    
    const group = studyGroups.find(g => g.id === groupId);
    const subject = subjects.find(s => s.id === group?.subjectId);
    const members = users.filter(u => group?.members.includes(u.id));
    
    const [newMessage, setNewMessage] = useState('');
    const [sharedContent, setSharedContent] = useState(sharedContents.find(sc => sc.groupId === groupId)?.content || '');
    const [aiResponse, setAiResponse] = useState('');
    const [isAiLoading, setIsAiLoading] = useState(false);
    const [activeTab, setActiveTab] = useState<ActiveTab>('scratchpad');
    
    const chatEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);
    
    if (!group || !subject) {
        return <div className="text-center text-red-500">Group not found.</div>;
    }

    const handleSendMessage = (e: React.FormEvent) => {
        e.preventDefault();
        if (newMessage.trim() && user) {
            sendMessage(newMessage);
            setNewMessage('');
        }
    };

    const handleAiAction = async (action: 'plan' | 'summarize') => {
        setIsAiLoading(true);
        setAiResponse('');
        try {
            let response = '';
            if (action === 'plan') {
                response = await suggestStudyPlan(subject, members);
            } else {
                response = await summarizeText(sharedContent);
            }
            setAiResponse(response);
        } catch (error) {
            setAiResponse('An error occurred while communicating with the AI.');
        } finally {
            setIsAiLoading(false);
        }
    };

    const TabButton: React.FC<{tab: ActiveTab, label: string}> = ({ tab, label }) => (
        <button
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 text-sm font-medium rounded-t-md ${activeTab === tab ? 'bg-surface text-primary border-b-2 border-primary' : 'text-gray-500 hover:bg-gray-100'}`}
        >
            {label}
        </button>
    );

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-120px)]">
            {/* Left Column: Shared Workspace */}
            <div className="lg:col-span-2 bg-surface rounded-lg shadow-md flex flex-col">
                <div className="px-4 border-b">
                    <h2 className="text-xl font-bold text-gray-800 pt-4">{group.name}</h2>
                    <h3 className="text-md font-semibold text-primary mb-2">{subject.name}</h3>
                    <div className="flex items-center gap-2">
                        <TabButton tab="scratchpad" label="Shared Scratchpad" />
                        <TabButton tab="whiteboard" label="Collaborative Whiteboard" />
                    </div>
                </div>

                <div className="flex-grow p-4 h-0">
                    {activeTab === 'scratchpad' && (
                         <div className="flex flex-col h-full">
                            <textarea
                                className="flex-grow w-full p-3 border rounded-md resize-none font-mono text-sm"
                                value={sharedContent}
                                onChange={(e) => setSharedContent(e.target.value)}
                                placeholder="Type your collaborative notes here..."
                            ></textarea>
                            <div className="mt-4 flex items-center gap-4">
                                <button onClick={() => handleAiAction('plan')} disabled={isAiLoading} className="bg-secondary text-on-secondary px-4 py-2 rounded-md hover:bg-secondary/90 disabled:opacity-50 font-medium">
                                    ✨ Suggest Study Plan
                                </button>
                                <button onClick={() => handleAiAction('summarize')} disabled={isAiLoading || !sharedContent} className="bg-primary text-on-primary px-4 py-2 rounded-md hover:bg-primary/90 disabled:opacity-50 font-medium">
                                    📝 Summarize Notes
                                </button>
                            </div>
                             {(isAiLoading || aiResponse) && (
                                <div className="mt-4 p-4 bg-gray-50 rounded-lg border max-h-48 overflow-y-auto">
                                    <h4 className="font-bold text-gray-700">AI Assistant</h4>
                                    {isAiLoading ? <p className="text-gray-500 animate-pulse">Thinking...</p> : 
                                    <div className="prose prose-sm max-w-none whitespace-pre-wrap" dangerouslySetInnerHTML={{ __html: aiResponse.replace(/\n/g, '<br />').replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }} />}
                                </div>
                            )}
                        </div>
                    )}
                    {activeTab === 'whiteboard' && (
                        <Whiteboard groupId={groupId} />
                    )}
                </div>
            </div>

            {/* Right Column: Chat & Members */}
            <div className="bg-surface rounded-lg shadow-md flex flex-col p-4 h-full">
                <div className="mb-4">
                    <h3 className="font-bold text-lg">Group Members</h3>
                    <ul className="flex flex-wrap gap-2 mt-2">
                        {members.map(m => <li key={m.id} className="text-sm bg-gray-200 px-2 py-1 rounded">{m.username}</li>)}
                    </ul>
                </div>
                <div className="flex-grow flex flex-col border-t pt-4 h-0">
                    <div className="flex-grow overflow-y-auto pr-2 space-y-4">
                        {messages.map(msg => (
                            <div key={msg.id} className={`flex items-end gap-2 ${msg.senderId === user?.id ? 'justify-end' : ''}`}>
                                {msg.senderId !== user?.id && <div className="w-6 h-6 rounded-full bg-gray-300 flex items-center justify-center text-xs font-bold shrink-0">{msg.senderUsername.charAt(0)}</div>}
                                <div className={`px-4 py-2 rounded-lg max-w-xs ${msg.senderId === user?.id ? 'bg-primary text-on-primary' : 'bg-gray-200 text-gray-800'}`}>
                                    <p className="text-sm">{msg.text}</p>
                                </div>
                            </div>
                        ))}
                        <div ref={chatEndRef} />
                    </div>
                    <form onSubmit={handleSendMessage} className="mt-4 flex gap-2">
                        <input
                            type="text"
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                            placeholder="Type a message..."
                            className="flex-grow rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                        />
                        <button type="submit" className="bg-primary text-white px-4 py-2 rounded-md hover:bg-primary/90 font-medium">Send</button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default GroupWorkspace;
