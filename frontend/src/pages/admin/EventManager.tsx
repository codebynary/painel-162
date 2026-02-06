import { useState } from 'react';
import { motion } from 'framer-motion';
import { Zap, TrendingUp, Gift, Sparkles, Loader2, Save, History, Plus, Ticket } from 'lucide-react';
import axios from 'axios';

const EventManager = () => {
    const [expRate, setExpRate] = useState(1);
    const [dropRate, setDropRate] = useState(1);
    const [moneyRate, setMoneyRate] = useState(1);
    const [isSavingRates, setIsSavingRates] = useState(false);

    const [promoCode, setPromoCode] = useState('');
    const [promoGold, setPromoGold] = useState(0);
    const [isGeneratingPromo, setIsGeneratingPromo] = useState(false);

    const handleSaveRates = async () => {
        setIsSavingRates(true);
        try {
            const token = localStorage.getItem('token');
            await axios.post('http://localhost:3000/api/admin/server/rates', {
                exp: expRate,
                drop: dropRate,
                money: moneyRate
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            alert('Taxas do servidor atualizadas!');
        } catch (error) {
            alert('Erro ao atualizar taxas');
        } finally {
            setIsSavingRates(false);
        }
    };

    const handleGeneratePromo = async () => {
        if (!promoCode) return;
        setIsGeneratingPromo(true);
        try {
            const token = localStorage.getItem('token');
            await axios.post('http://localhost:3000/api/admin/promo-codes', {
                code: promoCode,
                gold: promoGold
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            alert('Cupom gerado com sucesso!');
            setPromoCode('');
            setPromoGold(0);
        } catch (error) {
            alert('Erro ao gerar cupom');
        } finally {
            setIsGeneratingPromo(false);
        }
    };

    return (
        <div className="space-y-10 font-inter selection:bg-brand-red/30 relative">
            <div className="absolute inset-0 grainy-bg z-50"></div>

            <header className="border-b border-white/5 pb-8 relative z-10">
                <h1 className="text-3xl font-black text-white tracking-tighter uppercase leading-none">EVENTOS & <span className="text-brand-red font-outline">DINÂMICA</span></h1>
                <p className="text-[10px] text-white/30 font-bold tracking-[0.2em] uppercase mt-2">Controle de taxas globais e engajamento de jogadores</p>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 relative z-10">
                {/* Server Rates Control */}
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="glass-card rounded-[32px] p-10 border-white/5 relative overflow-hidden"
                >
                    <div className="absolute top-0 right-0 w-64 h-64 bg-brand-red/5 blur-[100px] rounded-full -mr-32 -mt-32"></div>

                    <div className="flex items-center gap-4 mb-8">
                        <div className="p-3 bg-brand-red/10 rounded-2xl border border-brand-red/20">
                            <Zap className="w-5 h-5 text-brand-red shadow-glow" />
                        </div>
                        <div>
                            <h3 className="text-xs font-black text-white uppercase tracking-widest">Taxas do Servidor</h3>
                            <p className="text-[9px] text-white/30 uppercase tracking-widest font-bold">Multiplicadores em tempo real</p>
                        </div>
                    </div>

                    <div className="space-y-8">
                        {[
                            { label: 'Experiência (EXP)', value: expRate, setter: setExpRate, icon: <TrendingUp className="w-4 h-4" /> },
                            { label: 'Taxa de Drop', value: dropRate, setter: setDropRate, icon: <Sparkles className="w-4 h-4" /> },
                            { label: 'Moeda (Money)', value: moneyRate, setter: setMoneyRate, icon: <TrendingUp className="w-4 h-4" /> }
                        ].map((rate, i) => (
                            <div key={i} className="space-y-4">
                                <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest">
                                    <span className="text-white/40 flex items-center gap-2">{rate.icon} {rate.label}</span>
                                    <span className="text-brand-red">{rate.value}x</span>
                                </div>
                                <input
                                    type="range"
                                    min="1"
                                    max="100"
                                    value={rate.value}
                                    onChange={(e) => rate.setter(Number(e.target.value))}
                                    className="w-full bg-white/5 h-1 rounded-full accent-brand-red cursor-pointer"
                                />
                            </div>
                        ))}

                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={handleSaveRates}
                            disabled={isSavingRates}
                            className="w-full bg-brand-red text-white font-black py-5 rounded-2xl text-[10px] tracking-[0.2em] flex items-center justify-center gap-3 shadow-[0_0_30px_rgba(204,0,0,0.1)] transition-all uppercase disabled:opacity-50"
                        >
                            {isSavingRates ? <Loader2 className="w-4 h-4 animate-spin" /> : (
                                <>
                                    <Save className="w-4 h-4" />
                                    Aplicar Mudanças
                                </>
                            )}
                        </motion.button>
                    </div>
                </motion.div>

                {/* Promo Codes Manager */}
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="glass-card rounded-[32px] p-10 border-white/5 relative overflow-hidden"
                >
                    <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 blur-[100px] rounded-full -mr-32 -mt-32"></div>

                    <div className="flex items-center gap-4 mb-8">
                        <div className="p-3 bg-emerald-500/10 rounded-2xl border border-emerald-500/20">
                            <Ticket className="w-5 h-5 text-emerald-500 shadow-glow" />
                        </div>
                        <div>
                            <h3 className="text-xs font-black text-white uppercase tracking-widest">Promo Codes</h3>
                            <p className="text-[9px] text-white/30 uppercase tracking-widest font-bold">Cupons de resgate e brindes</p>
                        </div>
                    </div>

                    <div className="space-y-6">
                        <div>
                            <label className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em] mb-3 block">Código do Cupom</label>
                            <input
                                type="text"
                                placeholder="EX: VELORIANHYPE"
                                value={promoCode}
                                onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-4 text-sm font-bold text-white outline-none focus:border-emerald-500/50 transition-all font-mono uppercase"
                            />
                        </div>

                        <div>
                            <label className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em] mb-3 block">Recompensa (Gold)</label>
                            <input
                                type="number"
                                value={promoGold}
                                onChange={(e) => setPromoGold(Number(e.target.value))}
                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-4 text-sm font-bold text-white outline-none focus:border-emerald-500/50 transition-all"
                            />
                        </div>

                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={handleGeneratePromo}
                            disabled={isGeneratingPromo || !promoCode}
                            className="w-full bg-emerald-500 text-black font-black py-5 rounded-2xl text-[10px] tracking-[0.2em] flex items-center justify-center gap-3 shadow-[0_0_30px_rgba(16,185,129,0.1)] transition-all uppercase disabled:opacity-50"
                        >
                            {isGeneratingPromo ? <Loader2 className="w-4 h-4 animate-spin text-black" /> : (
                                <>
                                    <Plus className="w-4 h-4" />
                                    Gerar Novo Cupom
                                </>
                            )}
                        </motion.button>

                        <div className="pt-6 border-t border-white/5">
                            <h4 className="text-[10px] font-black text-white/20 uppercase tracking-widest mb-4 flex items-center gap-2">
                                <History className="w-3 h-3" /> Logs Recentes
                            </h4>
                            <div className="space-y-3">
                                <div className="p-4 bg-white/5 rounded-xl border border-white/5 flex justify-between items-center group hover:border-emerald-500/20 transition-all">
                                    <div>
                                        <p className="text-xs font-bold text-white/60">VELORIANHOT</p>
                                        <p className="text-[9px] text-white/20 uppercase font-black">100.000 GOLD</p>
                                    </div>
                                    <span className="text-[9px] text-emerald-500 font-black">ATIVO</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default EventManager;
