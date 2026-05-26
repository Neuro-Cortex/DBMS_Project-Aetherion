



import { Card } from 'src/ui/Card';
import { Button } from 'src/ui/Button';
import { Badge } from 'src/ui/Badge';
import { Avatar } from 'src/ui/Avatar';
import { Input } from 'src/ui/Input';
import { useState } from 'react';
import { MessageCircle, Phone, Search, Send, Video } from 'lucide-react';
import { motion } from 'framer-motion';





interface ChatPreview {
  id: string; name: string; avatar: string; lastMessage: string;
  time: string; unread: number; online: boolean; role: string;
}

const chats: ChatPreview[] = [
  { id: '1', name: 'Rahima Khatun', avatar: 'RK', lastMessage: 'Thank you doctor, my BP is better now', time: '10:30 AM', unread: 2, online: true, role: 'Patient' },
  { id: '2', name: 'Kamal Hossain', avatar: 'KH', lastMessage: 'Should I increase the insulin dose?', time: '9:15 AM', unread: 0, online: false, role: 'Patient' },
  { id: '3', name: 'Nasrin Sultana', avatar: 'NS', lastMessage: 'My next checkup is on June 10th', time: 'Yesterday', unread: 1, online: true, role: 'Patient' },
  { id: '4', name: 'Dr. Fatema Akter', avatar: 'FA', lastMessage: 'Can you review this case?', time: 'Yesterday', unread: 0, online: true, role: 'Doctor' },
];

const Messages: React.FC = () => {
  const [selectedChat, setSelectedChat] = useState<ChatPreview | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const filtered = chats.filter(c => c.name.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <div className="min-h-screen bg-[#030508]">
      <div className="max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-3xl font-black text-white flex items-center gap-3"><MessageCircle className="w-8 h-8 text-indigo-400" /> Messages</h1>
          <p className="text-slate-400 text-sm mt-1">{chats.length} conversations</p>
        </motion.div>

        <div className="grid grid-cols-3 gap-6">
          <div className="col-span-1 space-y-4">
            <Input placeholder="Search conversations..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} leftIcon={Search} />
            <div className="space-y-2">
              {filtered.map((chat) => (
                <Card key={chat.id} className={`p-4 cursor-pointer transition-all ${selectedChat?.id === chat.id ? 'border-indigo-500/30 bg-indigo-500/5' : 'hover:border-white/[0.08]'}`}
                  onClick={() => setSelectedChat(chat)}>
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <Avatar name={chat.avatar} size="md" />
                      {chat.online && <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-400 rounded-full border-2 border-[#030508]" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h4 className="text-white font-bold text-sm">{chat.name}</h4>
                        <span className="text-xs text-slate-500">{chat.time}</span>
                      </div>
                      <p className="text-xs text-slate-400 truncate">{chat.lastMessage}</p>
                    </div>
                    {chat.unread > 0 && <Badge variant="danger" className="text-[10px]">{chat.unread}</Badge>}
                  </div>
                </Card>
              ))}
            </div>
          </div>

          <div className="col-span-2">
            {selectedChat ? (
              <Card className="h-[600px] flex flex-col">
                <div className="p-4 border-b border-white/[0.06] flex items-center gap-3">
                  <Avatar name={selectedChat.avatar} size="md" />
                  <div className="flex-1">
                    <h3 className="text-white font-bold">{selectedChat.name}</h3>
                    <p className="text-xs text-slate-400">{selectedChat.role}</p>
                  </div>
                  <Button variant="ghost" size="xs"><Phone className="w-4 h-4" /></Button>
                  <Button variant="ghost" size="xs"><Video className="w-4 h-4" /></Button>
                </div>
                <div className="flex-1 p-4 overflow-y-auto">
                  <div className="text-center text-slate-500 text-sm py-12">
                    <MessageCircle className="w-12 h-12 mx-auto mb-3 text-slate-600" />
                    <p>Start conversation with {selectedChat.name}</p>
                  </div>
                </div>
                <div className="p-4 border-t border-white/[0.06] flex gap-3">
                  <input type="text" placeholder="Type your message..." className="flex-1 p-3 rounded-2xl bg-white/[0.03] border border-white/[0.08] text-white text-sm" />
                  <Button variant="primary" className="bg-indigo-500"><Send className="w-4 h-4" /></Button>
                </div>
              </Card>
            ) : (
              <Card className="h-[600px] flex items-center justify-center">
                <div className="text-center text-slate-500">
                  <MessageCircle className="w-16 h-16 mx-auto mb-4 text-slate-600" />
                  <p className="text-lg">Select a conversation to start messaging</p>
                </div>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Messages;