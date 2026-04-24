import React, { useState, useEffect, useRef } from 'react';
import { 
  Building2, 
  MessageSquare, 
  Newspaper, 
  Search, 
  Send, 
  Info, 
  ChevronRight, 
  MapPin, 
  Phone, 
  Mail, 
  Globe,
  GraduationCap,
  Users,
  Target,
  Trophy
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface SchoolProfile {
  name: string;
  vision: string;
  mission: string[];
  departments: { id: string; name: string; description: string }[];
  facilities: string[];
  contact: { address: string; phone: string; email: string; website: string };
}

interface NewsItem {
  id: number;
  title: string;
  date: string;
  category: string;
  summary: string;
}

export default function App() {
  const [activeTab, setActiveTab] = useState<'home' | 'profile' | 'news' | 'chat'>('home');
  const [profile, setProfile] = useState<SchoolProfile | null>(null);
  const [news, setNews] = useState<NewsItem[]>([]);
  const [chatInput, setChatInput] = useState('');
  const [chatMessages, setChatMessages] = useState<{ role: 'user' | 'ai'; text: string }[]>([]);
  const [isChatLoading, setIsChatLoading] = useState(false);
  const [newsSearch, setNewsSearch] = useState('');
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch('/api/profile').then(res => res.json()).then(setProfile);
    fetch('/api/news').then(res => res.json()).then(setNews);
  }, []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  const handleSendMessage = async () => {
    if (!chatInput.trim()) return;
    const userMsg = chatInput;
    setChatMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setChatInput('');
    setIsChatLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMsg }),
      });
      const data = await res.json();
      setChatMessages(prev => [...prev, { role: 'ai', text: data.response }]);
    } catch (error) {
      console.error(error);
    } finally {
      setIsChatLoading(false);
    }
  };

  const filteredNews = news.filter(n => 
    n.title.toLowerCase().includes(newsSearch.toLowerCase()) ||
    n.category.toLowerCase().includes(newsSearch.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800">
      {/* Sidebar Navigation */}
      <nav className="fixed left-0 top-0 hidden h-full w-20 flex-col items-center border-r border-slate-200 bg-white py-8 shadow-sm md:flex">
        <div className="mb-12 flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-600 text-white shadow-lg shadow-emerald-100">
          <GraduationCap size={28} />
        </div>
        <div className="flex flex-col gap-8">
          <NavIcon icon={<Building2 />} active={activeTab === 'profile'} onClick={() => setActiveTab('profile')} label="Profil" />
          <NavIcon icon={<Newspaper />} active={activeTab === 'news'} onClick={() => setActiveTab('news')} label="Berita" />
          <NavIcon icon={<MessageSquare />} active={activeTab === 'chat'} onClick={() => setActiveTab('chat')} label="AI Chat" />
        </div>
        <div className="mt-auto">
          <NavIcon icon={<Info />} active={activeTab === 'home'} onClick={() => setActiveTab('home')} label="Bantuan" />
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="md:ml-20">
        {/* Header */}
        <header className="sticky top-0 z-10 border-b border-slate-200 bg-white/80 px-6 py-4 backdrop-blur-md">
          <div className="mx-auto flex max-w-5xl items-center justify-between">
            <h1 className="text-xl font-bold tracking-tight text-slate-900">
              {profile?.name || "SMK MADINATUL QURAN"}
            </h1>
            <div className="flex items-center gap-2 text-sm font-medium text-emerald-600 md:hidden">
               <button onClick={() => setActiveTab('chat')} className="flex items-center gap-1 rounded-full bg-emerald-50 px-3 py-1">
                 <MessageSquare size={16} /> Chat AI
               </button>
            </div>
          </div>
        </header>

        <div className="mx-auto max-w-5xl p-6">
          <AnimatePresence mode="wait">
            {activeTab === 'home' && (
              <motion.section key="home" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
                <div className="grid gap-6 md:grid-cols-2">
                  <div className="rounded-3xl bg-emerald-600 p-8 text-white shadow-xl shadow-emerald-100">
                    <h2 className="mb-4 text-3xl font-bold leading-tight">Selamat Datang di Portal AI SMK MQ</h2>
                    <p className="mb-6 opacity-90">Dapatkan informasi lengkap seputar visi, misi, jurusan, dan berita terbaru sekolah melalui asisten pintar kami.</p>
                    <button 
                      onClick={() => setActiveTab('chat')}
                      className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 font-semibold text-emerald-600 transition-transform hover:scale-105"
                    >
                      Bicara dengan AI <ChevronRight size={20} />
                    </button>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <StatCard icon={<GraduationCap className="text-emerald-500" />} title="Jurusan" value="2 Unggulan" />
                    <StatCard icon={<Users className="text-blue-500" />} title="Santri" value="500+" />
                    <StatCard icon={<Trophy className="text-amber-500" />} title="Prestasi" value="Juara IT" />
                    <StatCard icon={<Target className="text-rose-500" />} title="Fokus" value="Qurani & IT" />
                  </div>
                </div>
                
                <div className="mt-12">
                  <h3 className="mb-6 text-xl font-bold text-slate-900">Berita Terkini</h3>
                  <div className="grid gap-6 md:grid-cols-3">
                    {news.slice(0, 3).map(item => (
                      <div key={item.id} className="group rounded-2xl border border-slate-200 bg-white p-5 transition-all hover:border-emerald-200 hover:shadow-lg">
                        <span className="mb-2 inline-block text-xs font-bold uppercase tracking-widest text-emerald-600">{item.category}</span>
                        <h4 className="mb-3 font-bold group-hover:text-emerald-600">{item.title}</h4>
                        <p className="text-sm text-slate-500 line-clamp-2">{item.summary}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.section>
            )}

            {activeTab === 'profile' && profile && (
              <motion.section key="profile" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-8">
                <div className="rounded-2xl border border-slate-200 bg-white p-8">
                  <h2 className="mb-4 text-2xl font-bold">Visi Kami</h2>
                  <p className="text-lg italic text-slate-600">"{profile.vision}"</p>
                </div>
                
                <div className="grid gap-8 md:grid-cols-2">
                  <div className="rounded-2xl border border-slate-200 bg-white p-8">
                    <h2 className="mb-6 text-xl font-bold flex items-center gap-2"><Target className="text-emerald-500" /> Misi Sekolah</h2>
                    <ul className="space-y-4">
                      {profile.mission.map((m, i) => (
                        <li key={i} className="flex gap-3 text-slate-600">
                          <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-xs font-bold text-emerald-600">{i+1}</span>
                          {m}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="rounded-2xl border border-slate-200 bg-white p-8">
                    <h2 className="mb-6 text-xl font-bold flex items-center gap-2"><Building2 className="text-blue-500" /> Jurusan Kejuruan</h2>
                    <div className="space-y-6">
                      {profile.departments.map(d => (
                        <div key={d.id} className="rounded-xl bg-slate-50 p-4">
                          <h4 className="font-bold text-slate-900">{d.name}</h4>
                          <p className="text-sm text-slate-500 mt-1">{d.description}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white p-8">
                  <div className="grid gap-6 md:grid-cols-4">
                    <ContactItem icon={<MapPin />} label="Alamat" value={profile.contact.address} />
                    <ContactItem icon={<Phone />} label="Telepon" value={profile.contact.phone} />
                    <ContactItem icon={<Mail />} label="Email" value={profile.contact.email} />
                    <ContactItem icon={<Globe />} label="Website" value={profile.contact.website} />
                  </div>
                </div>
              </motion.section>
            )}

            {activeTab === 'news' && (
              <motion.section key="news" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
                <div className="flex items-center gap-4 rounded-2xl border border-slate-200 bg-white px-6 py-4 shadow-sm">
                  <Search className="text-slate-400" />
                  <input 
                    type="text" 
                    placeholder="Cari berita sekolah..." 
                    className="flex-1 bg-transparent outline-none"
                    value={newsSearch}
                    onChange={(e) => setNewsSearch(e.target.value)}
                  />
                </div>
                
                <div className="space-y-4">
                  {filteredNews.map(item => (
                    <div key={item.id} className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-6 md:flex-row md:items-center">
                      <div className="flex-1">
                        <div className="mb-2 flex items-center gap-3">
                          <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-600 uppercase">{item.category}</span>
                          <span className="text-xs text-slate-400">{item.date}</span>
                        </div>
                        <h3 className="text-lg font-bold text-slate-900 mb-2">{item.title}</h3>
                        <p className="text-slate-500">{item.summary}</p>
                      </div>
                      <button className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold hover:bg-slate-50">Baca Selengkapnya</button>
                    </div>
                  ))}
                  {filteredNews.length === 0 && <p className="text-center py-12 text-slate-500">Berita tidak ditemukan.</p>}
                </div>
              </motion.section>
            )}

            {activeTab === 'chat' && (
              <motion.section key="chat" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="flex h-[70vh] flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl">
                <div className="flex items-center gap-3 border-b border-slate-100 px-6 py-4 bg-emerald-600 text-white">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/20">
                    <MessageSquare size={20} />
                  </div>
                  <div>
                    <h3 className="font-bold">Asisten AI Madinatul Quran</h3>
                    <p className="text-xs opacity-80">Online | Siap membantu informasi sekolah</p>
                  </div>
                </div>

                <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-emerald-50/30">
                  {chatMessages.length === 0 && (
                    <div className="text-center py-8">
                       <p className="text-slate-400 text-sm">Belum ada obrolan. Mari mulai bertanya!</p>
                       <div className="mt-4 flex flex-wrap justify-center gap-2">
                         <button onClick={() => setChatInput("Apa visi misi sekolah?")} className="text-xs bg-white border border-emerald-100 px-3 py-2 rounded-full hover:bg-emerald-50 transition-colors">Visi & Misi</button>
                         <button onClick={() => setChatInput("Apa saja jurusan di sini?")} className="text-xs bg-white border border-emerald-100 px-3 py-2 rounded-full hover:bg-emerald-50 transition-colors">Daftar Jurusan</button>
                         <button onClick={() => setChatInput("Bagaimana cara daftar?")} className="text-xs bg-white border border-emerald-100 px-3 py-2 rounded-full hover:bg-emerald-50 transition-colors">Cara Daftar PPDB</button>
                       </div>
                    </div>
                  )}
                  {chatMessages.map((msg, i) => (
                    <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[80%] rounded-2xl px-4 py-3 shadow-sm ${
                        msg.role === 'user' 
                          ? 'bg-emerald-600 text-white rounded-tr-none' 
                          : 'bg-white text-slate-800 rounded-tl-none border border-slate-100'
                      }`}>
                        {msg.text}
                      </div>
                    </div>
                  ))}
                  {isChatLoading && (
                    <div className="flex justify-start">
                      <div className="bg-white rounded-2xl rounded-tl-none border border-slate-100 px-4 py-3 shadow-sm">
                        <div className="flex gap-1">
                          <div className="h-1.5 w-1.5 animate-bounce rounded-full bg-slate-300"></div>
                          <div className="h-1.5 w-1.5 animate-bounce rounded-full bg-slate-300 [animation-delay:0.2s]"></div>
                          <div className="h-1.5 w-1.5 animate-bounce rounded-full bg-slate-300 [animation-delay:0.4s]"></div>
                        </div>
                      </div>
                    </div>
                  )}
                  <div ref={chatEndRef} />
                </div>

                <div className="border-t border-slate-100 p-4 bg-white">
                  <div className="flex gap-2">
                    <input 
                      type="text" 
                      value={chatInput}
                      onChange={(e) => setChatInput(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                      placeholder="Ketik pesan Anda di sini..." 
                      className="flex-1 rounded-xl bg-slate-100 px-4 py-3 outline-none focus:ring-2 focus:ring-emerald-500/20"
                    />
                    <button 
                      onClick={handleSendMessage}
                      disabled={isChatLoading}
                      className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-600 text-white shadow-md transition-transform active:scale-95 disabled:opacity-50"
                    >
                      <Send size={20} />
                    </button>
                  </div>
                </div>
              </motion.section>
            )}
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}

function NavIcon({ icon, active, onClick, label }: { icon: React.ReactNode, active: boolean, onClick: () => void, label: string }) {
  return (
    <button 
      onClick={onClick}
      className={`group relative flex h-12 w-12 items-center justify-center rounded-xl transition-all ${active ? 'bg-emerald-600 text-white shadow-lg' : 'text-slate-400 hover:bg-emerald-50 hover:text-emerald-600'}`}
    >
      {icon}
      <span className="absolute left-20 hidden rounded-md bg-slate-800 px-2 py-1 text-xs text-white group-hover:block whitespace-nowrap z-50">
        {label}
      </span>
    </button>
  );
}

function StatCard({ icon, title, value }: { icon: React.ReactNode, title: string, value: string }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition-all hover:scale-105">
      <div className="mb-2 flex h-8 w-8 items-center justify-center rounded-lg bg-slate-50">{icon}</div>
      <p className="text-xs font-medium text-slate-400">{title}</p>
      <p className="text-lg font-bold text-slate-900">{value}</p>
    </div>
  );
}

function ContactItem({ icon, label, value }: { icon: React.ReactNode, label: string, value: string }) {
  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-center gap-2 text-emerald-600 mb-1">
        {icon}
        <span className="text-xs font-bold uppercase tracking-wider opacity-60">{label}</span>
      </div>
      <p className="text-sm font-medium text-slate-800 leading-relaxed">{value}</p>
    </div>
  );
}
