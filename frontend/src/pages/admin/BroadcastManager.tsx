import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Megaphone, Send, History, Loader2, CheckCircle2, AlertCircle, Type, Layers } from 'lucide-react';
import axios from 'axios';

interface BroadcastLog {
    id: number;
    message: string;
    channel: string;
    time: string;
}

const BroadcastManager = () => {
    const [message, setMessage] = useState('');
    const [channel, setChannel] = useState('9'); // Default World Channel
    const [isLoading, setIsLoading] = useState(false);
    const [status, setStatus] = useState<{ type: 'success' | 'error', msg: string } | null>(null);
    const [history, setHistory] = useState<BroadcastLog[]>([]);

    const channels = [
        { id: '1', name: 'Geral' },
        { id: '9', name: 'Mundo (Global)' },
        { id: '0', name: 'Sistema (GM)' },
        { id: '2', name: 'Trade / Comércio' }
    ];

    const handleSend = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!message.trim()) return;

        setIsLoading(true);
        setStatus(null);

        try {
            const token = localStorage.getItem('token');
            await axios.post('http://localhost:3000/api/admin/broadcast', {
                message,
                channel: Number(channel)
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });

            setStatus({ type: 'success', msg: 'Anúncio enviado para o servidor!' });

            // Add to local history
            const newLog: BroadcastLog = {
                id: Date.now(),
                message,
                channel: channels.find(c => c.id === channel)?.name || 'Desconhecido',
                time: new Date().toLocaleTimeString()
            };
            setHistory([newLog, ...history.slice(0, 4)]);
            setMessage('');
        } catch (error: any) {
            setStatus({ type: 'error', msg: error.response?.data?.message || 'Erro ao enviar broadcast' });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="space-y-10 font-inter selection:bg-brand-red/30 relative">
            {/* Grainy Overlay */}
            <div className="absolute inset-0 grainy-bg z-50"></div>

            <header className="border-b border-white/5 pb-8 relative z-10">
                <h1 className="text-3xl font-black text-white tracking-tighter uppercase leading-none">BROADCAST <span className="text-brand-red font-outline">SISTEMA</span></h1>
                <p className="text-[10px] text-white/30 font-bold tracking-[0.2em] uppercase mt-2">Mensagens em tempo real para todos os jogadores online</p>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                {/* Send Form */}
                <div className="lg:col-span-7">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="glass-card rounded-[32px] p-10 border-white/5 relative overflow-hidden h-full"
                    >
                        <div className="absolute top-0 right-0 w-64 h-64 bg-brand-red/5 blur-[100px] rounded-full -mr-32 -mt-32"></div>

                        <form onSubmit={handleSend} className="space-y-8 relative z-10">
                            <div>
                                <label className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em] mb-4 block flex items-center">
                                    <Layers className="w-3 h-3 mr-2 text-brand-red" />
                                    Canal de Transmissão
                                </label>
                                <div className="grid grid-cols-2 gap-4">
                                    {channels.map((c) => (
                                        <button
                                            key={c.id}
                                            type="button"
                                            onClick={() => setChannel(c.id)}
                                            className={`px-6 py-4 rounded-2xl text-[10px] font-black tracking-widest uppercase transition-all border ${channel === c.id ? 'bg-brand-red border-brand-red text-white shadow-[0_0_15px_rgba(204,0,0,0.3)]' : 'bg-white/5 border-white/10 text-white/40 hover:border-white/20'}`}
                                        >
                                            {c.name}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <label className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em] mb-4 block flex items-center">
                                    <Type className="w-3 h-3 mr-2 text-brand-red" />
                                    Mensagem do Anúncio
                                </label>
                                <textarea
                                    value={message}
                                    onChange={(e) => setMessage(e.target.value)}
                                    placeholder="Digite o que deseja anunciar..."
                                    rows={5}
                                    className="w-full bg-white/5 border border-white/10 rounded-[24px] px-8 py-6 text-white focus:border-brand-red/50 transition-all outline-none font-bold resize-none text-lg"
                                />
                            </div>

                            <AnimatePresence>
                                {status && (
                                    <motion.div
                                        initial={{ opacity: 0, scale: 0.9, y: 10 }}
                                        animate={{ opacity: 1, scale: 1, y: 0 }}
                                        exit={{ opacity: 0, scale: 0.9, y: 10 }}
                                        className={`p-5 rounded-2xl border flex items-center gap-4 ${status.type === 'success' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-500' : 'bg-red-500/10 border-red-500/20 text-red-500'}`}
                                    >
                                        {status.type === 'success' ? <CheckCircle2 className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
                                        <p className="text-xs font-black uppercase tracking-wider">{status.msg}</p>
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            <motion.button
                                whileHover={{ scale: 1.02, backgroundColor: '#cc0000' }}
                                whileTap={{ scale: 0.98 }}
                                disabled={isLoading || !message.trim()}
                                className="w-full bg-brand-red text-white font-black py-6 rounded-[24px] text-xs tracking-[0.3em] flex items-center justify-center shadow-[0_0_30px_rgba(204,0,0,0.2)] transition-all uppercase disabled:opacity-30"
                            >
                                {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : (
                                    <>
                                        <Megaphone className="w-4 h-4 mr-4" />
                                        ENVIAR AGORA
                                    </>
                                )}
                            </motion.button>
                        </form>
                    </motion.div>
                </div>

                {/* History Sidebar */}
                <div className="lg:col-span-5">
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="glass-card rounded-[32px] p-8 border-white/5 h-full relative overflow-hidden"
                    >
                        <h3 className="text-[10px] font-black text-white/20 tracking-[0.2em] mb-8 uppercase flex items-center">
                            <History className="w-4 h-4 mr-3" />
                            Anúncios Recentes
                        </h3>

                        <div className="space-y-6">
                            {history.length > 0 ? history.map((log) => (
                                <motion.div
                                    key={log.id}
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    className="p-6 bg-white/5 border border-white/10 rounded-2xl relative group hover:border-brand-red/30 transition-all"
                                >
                                    <div className="flex justify-between items-start mb-3">
                                        <span className="text-[9px] font-black text-brand-red bg-brand-red/10 px-2 py-1 rounded-lg border border-brand-red/20 uppercase">
                                            {log.channel}
                                        </span>
                                        <span className="text-[9px] font-bold text-white/20">{log.time}</span>
                                    </div>
                                    <p className="text-sm font-bold text-white/80 leading-relaxed italic">"{log.message}"</p>
                                </motion.div>
                            )) : (
                                <div className="text-center py-20">
                                    <p className="text-[10px] font-black text-white/10 uppercase tracking-widest leading-loose">Nenhuma transmissão<br />realizada na sessão atual</p>
                                </div>
                            )}
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

export default BroadcastManager;
