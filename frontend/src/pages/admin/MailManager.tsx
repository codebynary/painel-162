import { useState } from 'react';
import { motion } from 'framer-motion';
import { Send, User, Package, Gift, Loader2, AlertCircle, CheckCircle2, Mail } from 'lucide-react';
import axios from 'axios';

const MailManager = () => {
    const [targetId, setTargetId] = useState('');
    const [title, setTitle] = useState('');
    const [message, setMessage] = useState('');
    const [gold, setGold] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const [status, setStatus] = useState<{ type: 'success' | 'error', msg: string } | null>(null);

    const handleSendMail = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setStatus(null);

        try {
            const token = localStorage.getItem('token');
            await axios.post('http://localhost:3000/api/admin/mail', {
                receiverId: Number(targetId),
                title,
                context: message,
                money: Number(gold)
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });

            setStatus({ type: 'success', msg: 'Item/Gold enviado com sucesso para o correio!' });
            setTargetId('');
            setTitle('');
            setMessage('');
            setGold(0);
        } catch (error: any) {
            setStatus({ type: 'error', msg: error.response?.data?.message || 'Erro ao enviar mail' });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="space-y-10 font-inter selection:bg-brand-red/30 relative">
            {/* Grainy Overlay */}
            <div className="absolute inset-0 grainy-bg z-50"></div>

            <header className="border-b border-white/5 pb-8">
                <h1 className="text-3xl font-black text-white tracking-tighter uppercase leading-none">SISTEMA DE <span className="text-brand-red font-outline">CORREIO</span></h1>
                <p className="text-[10px] text-white/30 font-bold tracking-[0.2em] uppercase mt-2">Envio de pacotes e Gold para jogadores (Mail de Sistema)</p>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                <div className="lg:col-span-12">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="glass-card rounded-[32px] p-10 border-white/5 relative overflow-hidden"
                    >
                        <div className="absolute top-0 right-0 w-64 h-64 bg-brand-red/5 blur-[100px] rounded-full -mr-32 -mt-32"></div>

                        <form onSubmit={handleSendMail} className="space-y-8 relative z-10 max-w-2xl">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div>
                                    <label className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em] mb-3 block">ID do Destinatário (RoleID)</label>
                                    <div className="relative">
                                        <User className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
                                        <input
                                            type="number"
                                            value={targetId}
                                            onChange={(e) => setTargetId(e.target.value)}
                                            required
                                            className="w-full bg-white/5 border border-white/10 rounded-2xl pl-12 pr-6 py-4 text-white focus:border-brand-red/50 transition-all outline-none font-bold placeholder:text-white/10"
                                            placeholder="Ex: 1024"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em] mb-3 block">Quantidade de Gold (CASH)</label>
                                    <div className="relative">
                                        <Gift className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
                                        <input
                                            type="number"
                                            value={gold}
                                            onChange={(e) => setGold(Number(e.target.value))}
                                            className="w-full bg-white/5 border border-white/10 rounded-2xl pl-12 pr-6 py-4 text-white focus:border-brand-red/50 transition-all outline-none font-bold"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div>
                                <label className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em] mb-3 block">Título da Mensagem</label>
                                <input
                                    type="text"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    required
                                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white focus:border-brand-red/50 transition-all outline-none font-bold"
                                    placeholder="Ex: Premiação de Evento"
                                />
                            </div>

                            <div>
                                <label className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em] mb-3 block">Corpo da Mensagem</label>
                                <textarea
                                    value={message}
                                    onChange={(e) => setMessage(e.target.value)}
                                    required
                                    rows={4}
                                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white focus:border-brand-red/50 transition-all outline-none font-bold resize-none"
                                    placeholder="Escreva a mensagem que aparecerá no correio do jogo..."
                                />
                            </div>

                            {status && (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className={`p-4 rounded-2xl border flex items-center gap-4 ${status.type === 'success' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-500' : 'bg-red-500/10 border-red-500/20 text-red-500'}`}
                                >
                                    {status.type === 'success' ? <CheckCircle2 className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
                                    <p className="text-sm font-bold">{status.msg}</p>
                                </motion.div>
                            )}

                            <motion.button
                                whileHover={{ scale: 1.02, backgroundColor: '#cc0000' }}
                                whileTap={{ scale: 0.98 }}
                                disabled={isLoading}
                                className="bg-brand-red text-white font-black px-10 py-5 rounded-2xl text-xs tracking-widest flex items-center justify-center shadow-[0_0_20px_rgba(204,0,0,0.2)] transition-all uppercase"
                            >
                                {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : (
                                    <>
                                        <Send className="w-4 h-4 mr-3" />
                                        ENVIAR PACOTE
                                    </>
                                )}
                            </motion.button>
                        </form>
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

export default MailManager;
