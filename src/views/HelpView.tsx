import React, { useState } from 'react';
import { 
  HelpCircle, 
  Search, 
  MessageCircle, 
  Mail, 
  ChevronDown, 
  ChevronUp, 
  Send, 
  Bot, 
  User, 
  X, 
  Clock, 
  CheckCircle2, 
  ShieldCheck 
} from 'lucide-react';
import { INITIAL_FAQS } from '../data/mockData';
import { FAQItem } from '../types';
import { Badge } from '../components/common/Badge';
import { useToast } from '../components/common/Toast';

export const HelpView: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [openFaqId, setOpenFaqId] = useState<string | null>('faq-1');
  const [showLiveChat, setShowLiveChat] = useState(false);
  const [chatMessages, setChatMessages] = useState<Array<{ sender: 'cs' | 'user'; text: string; time: string }>>([
    {
      sender: 'cs',
      text: 'Halo! Selamat datang di Pusat Bantuan Pulsaku. Ada yang bisa kami bantu seputar transaksi Anda?',
      time: 'Baru saja'
    }
  ]);
  const [chatInput, setChatInput] = useState('');
  const { showToast } = useToast();

  const filteredFaqs = INITIAL_FAQS.filter((faq) => {
    if (selectedCategory !== 'all' && faq.category !== selectedCategory) return false;
    if (!searchQuery.trim()) return true;

    const q = searchQuery.toLowerCase();
    return faq.question.toLowerCase().includes(q) || faq.answer.toLowerCase().includes(q);
  });

  const handleSendChat = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const userText = chatInput.trim();
    const newMsg = {
      sender: 'user' as const,
      text: userText,
      time: 'Baru saja'
    };

    setChatMessages((prev) => [...prev, newMsg]);
    setChatInput('');

    // Simulate CS intelligent automated reply
    setTimeout(() => {
      let reply = 'Terima kasih atas pesan Anda. Agen CS Pulsaku sedang memeriksa sistem kami. Transaksi umumnya otomatis sukses dalam 1-3 menit.';
      if (userText.toLowerCase().includes('token') || userText.toLowerCase().includes('pln')) {
        reply = 'Untuk kode token PLN 20 digit, silakan buka menu "Riwayat" di aplikasi dan klik transaksi terkait untuk menyalin kode token Anda.';
      } else if (userText.toLowerCase().includes('gagal') || userText.toLowerCase().includes('batal')) {
        reply = 'Jika transaksi berstatus Gagal, sistem kami otomatis membatalkan pemotongan saldo / pengembalian dana dalam 1x24 jam.';
      } else if (userText.toLowerCase().includes('qris')) {
        reply = 'Pembayaran via QRIS terverifikasi secara otomatis oleh sistem dalam 5-15 detik.';
      }

      setChatMessages((prev) => [
        ...prev,
        {
          sender: 'cs',
          text: reply,
          time: 'Baru saja'
        }
      ]);
    }, 1000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in duration-200" id="help-view">
      {/* Header */}
      <div>
        <h1 className="text-xl sm:text-2xl font-black text-neutral-900">
          Pusat Bantuan & Layanan CS
        </h1>
        <p className="text-xs text-neutral-500 mt-0.5">
          Temukan jawaban pertanyaan Anda atau hubungi layanan pelanggan kami
        </p>
      </div>

      {/* Support Channels Card */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {/* Live Chat Assistant */}
        <div 
          onClick={() => setShowLiveChat(true)}
          className="p-4 rounded-2xl bg-[#0B1220] text-white flex items-center justify-between cursor-pointer hover:bg-neutral-900 transition-all shadow-2xs"
        >
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
              <MessageCircle className="w-5 h-5 text-white stroke-[2.2]" />
            </div>
            <div>
              <h3 className="text-sm font-black tracking-tight">Live CS Assistant</h3>
              <p className="text-xs text-neutral-400 mt-0.5">Respon cepat 24 jam</p>
            </div>
          </div>
          <span className="px-3 py-1.5 rounded-lg bg-white text-neutral-900 text-xs font-bold">
            Chat Sekarang
          </span>
        </div>

        {/* Email Support */}
        <a 
          href="mailto:support@pulsaku.id?subject=Bantuan%20Transaksi%20Pulsaku"
          className="p-4 rounded-2xl bg-white border border-neutral-200/80 flex items-center justify-between hover:border-neutral-900 transition-all shadow-2xs group"
        >
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-neutral-100 flex items-center justify-center text-neutral-800 group-hover:bg-[#0B1220] group-hover:text-white transition-colors">
              <Mail className="w-5 h-5 stroke-[2.2]" />
            </div>
            <div>
              <h3 className="text-sm font-black text-neutral-900">Email Resmi</h3>
              <p className="text-xs text-neutral-500 mt-0.5 font-mono">support@pulsaku.id</p>
            </div>
          </div>
          <span className="px-3 py-1.5 rounded-lg bg-neutral-100 text-neutral-800 text-xs font-bold group-hover:bg-neutral-200 transition-colors">
            Kirim Email
          </span>
        </a>
      </div>

      {/* FAQ Section */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">
            Pertanyaan yang Sering Diajukan (FAQ)
          </h2>
        </div>

        {/* Search FAQ */}
        <div className="relative">
          <Search className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Ketik kata kunci bantuan (contoh: token, qris, refund)..."
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-neutral-200 rounded-xl text-xs sm:text-sm font-medium focus:outline-hidden focus:border-neutral-900"
          />
        </div>

        {/* Category Filter Chips */}
        <div className="flex gap-1.5 overflow-x-auto pb-1 no-scrollbar">
          {[
            { id: 'all', label: 'Semua Kategori' },
            { id: 'transaksi', label: 'Transaksi' },
            { id: 'pembayaran', label: 'Pembayaran & QRIS' },
            { id: 'produk', label: 'Produk Digital' },
            { id: 'umum', label: 'Umum' },
          ].map((c) => (
            <button
              key={c.id}
              onClick={() => setSelectedCategory(c.id)}
              className={`px-3 py-1 rounded-full text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                selectedCategory === c.id
                  ? 'bg-neutral-900 text-white shadow-xs'
                  : 'bg-white text-neutral-600 border border-neutral-200 hover:border-neutral-400'
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>

        {/* FAQ Accordion List */}
        <div className="space-y-2">
          {filteredFaqs.map((faq) => {
            const isOpen = openFaqId === faq.id;
            return (
              <div
                key={faq.id}
                className="rounded-xl bg-white border border-neutral-200/80 overflow-hidden transition-all"
              >
                <button
                  onClick={() => setOpenFaqId(isOpen ? null : faq.id)}
                  className="w-full p-4 text-left flex items-center justify-between gap-3 cursor-pointer focus:outline-hidden"
                >
                  <span className="text-xs sm:text-sm font-bold text-neutral-900">
                    {faq.question}
                  </span>
                  {isOpen ? (
                    <ChevronUp className="w-4 h-4 text-neutral-400 shrink-0" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-neutral-400 shrink-0" />
                  )}
                </button>

                {isOpen && (
                  <div className="px-4 pb-4 pt-1 text-xs text-neutral-600 leading-relaxed border-t border-neutral-100 bg-neutral-50/50">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Live Chat Modal */}
      {showLiveChat && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-neutral-950/70 backdrop-blur-xs p-3 sm:p-4">
          <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl border border-neutral-200 overflow-hidden flex flex-col h-[520px] max-h-[90vh] animate-in zoom-in-95 duration-200">
            {/* Header */}
            <div className="p-4 bg-[#0B1220] text-white flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
                  <Bot className="w-4 h-4 text-white" />
                </div>
                <div>
                  <h3 className="text-xs sm:text-sm font-bold">Layanan Pelanggan Pulsaku</h3>
                  <span className="text-[10px] text-neutral-400 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" /> Online 24 Jam
                  </span>
                </div>
              </div>
              <button
                onClick={() => setShowLiveChat(false)}
                className="p-1 rounded-full text-white/80 hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Chat message thread */}
            <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-neutral-50">
              {chatMessages.map((msg, i) => (
                <div
                  key={i}
                  className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] p-3 rounded-xl text-xs leading-relaxed ${
                      msg.sender === 'user'
                        ? 'bg-[#0B1220] text-white rounded-tr-xs'
                        : 'bg-white text-neutral-800 border border-neutral-200/80 rounded-tl-xs shadow-2xs'
                    }`}
                  >
                    <p>{msg.text}</p>
                    <span
                      className={`text-[9px] block mt-1 ${
                        msg.sender === 'user' ? 'text-neutral-400 text-right' : 'text-neutral-400'
                      }`}
                    >
                      {msg.time}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Chat Input */}
            <form onSubmit={handleSendChat} className="p-3 bg-white border-t border-neutral-200 flex gap-2">
              <input
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                placeholder="Ketik pertanyaan transaksi Anda..."
                className="flex-1 px-3.5 py-2.5 text-xs bg-neutral-100 border border-neutral-200 rounded-xl focus:outline-hidden focus:bg-white focus:border-neutral-900"
              />
              <button
                type="submit"
                className="p-2.5 bg-[#0B1220] hover:bg-neutral-900 text-white rounded-xl transition-colors cursor-pointer"
                aria-label="Kirim"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
