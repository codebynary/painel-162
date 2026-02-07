import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CreditCard, Package, History, ArrowRight, Zap, Loader2, CheckCircle2, Clock, XCircle, Gift } from 'lucide-react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

interface DonatePackage {
    id: number;
    name: string;
    price: number;
    gold: number;
    bonus: number;
}

interface Donation {
    id: number;
    amount: number;
    gold_amount: number;
    status: 'pending' | 'completed' | 'cancelled';
    created_at: string;
}

const Donate = () => {
    const [packages, setPackages] = useState<DonatePackage[]>([]);
    const [history, setHistory] = useState<Donation[]>([]);
    const [activeTab, setActiveTab] = useState<'store' | 'history'>('store');
    const [isLoading, setIsLoading] = useState(true);
    const [processingId, setProcessingId] = useState<number | null>(null);
    const navigate = useNavigate();

    const fetchPackages = async () => {
        setIsLoading(true);
        try {
            const token = localStorage.getItem('token');
            const [pkgRes, histRes] = await Promise.all([
                axios.get('http://localhost:3000/api/donate/packages', { headers: { Authorization: `Bearer ${token}` } }),
                axios.get('http://localhost:3000/api/donate/history', { headers: { Authorization: `Bearer ${token}` } })
            ]);
            setPackages(pkgRes.data);
            setHistory(histRes.data);
        } catch (error) {
            console.error('Error fetching donate data', error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchPackages();
    }, []);

    const [showSuccessModal, setShowSuccessModal] = useState<{ show: boolean, amount: number }>({ show: false, amount: 0 });

    const handleBuy = async (packageId: number) => {
        setProcessingId(packageId);
        try {
            const token = localStorage.getItem('token');
            const response = await axios.post('http://localhost:3000/api/donate/create',
                { packageId },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            // Premium simulation: Instead of just opening a link, we simulate the flow
            const win = window.open(response.data.paymentUrl, '_blank');
            if (win) {
                setTimeout(() => {
                    win.close();
                    setActiveTab('history');
                }, 3000);
            }
        } catch (error) {
            console.error('Erro ao iniciar compra.');
        } finally {
            setProcessingId(null);
        }
    };

    const simulatePayment = async (id: number, amount: number) => {
        try {
            const token = localStorage.getItem('token');
            await axios.post('http://localhost:3000/api/donate/webhook', {
                donationId: id,
                externalId: 'MP_' + Math.random().toString(36).substr(2, 9).toUpperCase()
            }, { headers: { Authorization: `Bearer ${token}` } });

            setShowSuccessModal({ show: true, amount });
            fetchPackages();
        } catch (e) {
            console.error(e);
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'completed': return <CheckCircle2 className="w-4 h-4 text-emerald-500" />;
            case 'pending': return <Clock className="w-4 h-4 text-yellow-500" />;
            default: return <XCircle className="w-4 h-4 text-red-500" />;
        }
    };

    return (
        <div className="min-h-screen bg-[#050505] text-white relative overflow-hidden font-inter">
            {/* Background Decor */}
            <div className="fixed inset-0 bg-[radial-gradient(circle_at_50%_0%,#200000_0%,#000000_100%)] opacity-40"></div>

            {/* Success Modal */}
            <AnimatePresence>
                {showSuccessModal.show && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/80 backdrop-blur-xl">
                        <motion.div
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.8, opacity: 0 }}
                            className="bg-[#0a0a0a] border border-white/10 rounded-[3rem] p-12 max-w-md w-full text-center relative overflow-hidden"
                        >
                            <div className="absolute inset-0 bg-gradient-to-b from-brand-red/5 to-transparent"></div>
                            <div className="w-24 h-24 bg-emerald-500 rounded-full flex items-center justify-center mx-auto mb-8 shadow-[0_0_50px_rgba(16,185,129,0.3)]">
                                <CheckCircle2 className="w-12 h-12 text-white" />
                            </div>
                            <h2 className="text-3xl font-black text-white mb-4 uppercase tracking-tighter">Depósito Confirmado!</h2>
                            <p className="text-white/40 mb-10 text-sm font-medium">Seus <span className="text-emerald-500 font-black">{showSuccessModal.amount.toLocaleString()} GOLD</span> foram creditados instantaneamente em sua conta.</p>
                            <button
                                onClick={() => setShowSuccessModal({ show: false, amount: 0 })}
                                className="w-full bg-white text-black font-black py-5 rounded-2xl text-[10px] tracking-[0.2em] hover:bg-brand-red hover:text-white transition-all uppercase"
                            >
                                CONTINUAR AVENTURA
                            </button>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            <div className="relative z-10 max-w-7xl mx-auto p-6 lg:p-12">
                <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-16 gap-8">
                    <motion.div initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }}>
                        <h1 className="text-4xl font-black text-white tracking-tighter text-glow-red uppercase">
                            LOJA DE <span className="text-brand-red">GOLD</span>
                        </h1>
                        <p className="text-white/30 font-medium tracking-wide mt-1 uppercase text-[9px] tracking-[0.4em]">Velorian Prime Resources</p>
                    </motion.div>
                    <div className="flex bg-white/5 p-1 rounded-[1.5rem] border border-white/10 backdrop-blur-md">
                        <button
                            onClick={() => setActiveTab('store')}
                            className={`px-8 py-3.5 rounded-xl text-[10px] font-black tracking-widest transition-all ${activeTab === 'store' ? 'bg-brand-red text-white shadow-[0_0_20px_rgba(204,0,0,0.3)]' : 'text-white/40 hover:text-white hover:bg-white/5'}`}
                        >
                            <Package className="w-3.5 h-3.5 inline-block mr-2" />
                            PACOTES
                        </button>
                        <button
                            onClick={() => setActiveTab('history')}
                            className={`px-8 py-3.5 rounded-xl text-[10px] font-black tracking-widest transition-all ${activeTab === 'history' ? 'bg-brand-red text-white shadow-[0_0_20px_rgba(204,0,0,0.3)]' : 'text-white/40 hover:text-white hover:bg-white/5'}`}
                        >
                            <History className="w-3.5 h-3.5 inline-block mr-2" />
                            HISTÓRICO
                        </button>
                    </div>
                </header>

                <main>
                    {activeTab === 'store' ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                            {isLoading ? (
                                Array(4).fill(0).map((_, i) => (
                                    <div key={i} className="h-[450px] glass-card rounded-[2.5rem] animate-pulse"></div>
                                ))
                            ) : packages.map((pkg, index) => (
                                <motion.div
                                    key={pkg.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.1, duration: 0.5 }}
                                    whileHover={{ scale: 1.02 }}
                                    className="glass-card rounded-[2.5rem] p-10 border-white/5 hover:border-brand-red/40 transition-all group flex flex-col items-center text-center relative overflow-hidden"
                                >
                                    {/* Premium Badge */}
                                    {pkg.bonus > pkg.gold * 0.1 && (
                                        <div className="absolute top-6 right-6 bg-brand-red text-[8px] font-black px-3 py-1.5 rounded-full tracking-[0.2em] shadow-[0_0_15px_rgba(204,0,0,0.4)] animate-pulse">
                                            OFERTA
                                        </div>
                                    )}

                                    <div className="package-icon-container w-24 h-24 bg-gradient-to-br from-brand-red to-red-900 rounded-[2rem] flex items-center justify-center mb-10 shadow-[0_15px_40px_rgba(204,0,0,0.4)] group-hover:shadow-[0_20px_50px_rgba(204,0,0,0.6)] group-hover:-rotate-3 transition-all duration-500">
                                        <Zap className="w-12 h-12 text-white fill-white group-hover:scale-110 transition-transform" />
                                    </div>

                                    <h3 className="text-2xl font-black text-white mb-2 tracking-tight group-hover:text-brand-red transition-colors uppercase">{pkg.name}</h3>
                                    <p className="text-white/20 text-[10px] font-bold tracking-[0.3em] uppercase mb-8">Pacote Exclusivo</p>

                                    <div className="flex flex-col items-center mb-10">
                                        <div className="flex items-baseline mb-1">
                                            <span className="text-xs font-black text-brand-red mr-1.5 self-start mt-1">R$</span>
                                            <span className="text-5xl font-black text-white tracking-tighter">{Number(pkg.price).toFixed(2)}</span>
                                        </div>
                                        <div className="h-1 w-12 bg-brand-red/20 rounded-full mt-2"></div>
                                    </div>

                                    <div className="w-full space-y-4 mb-12">
                                        <div className="bg-white/5 border border-white/5 rounded-[1.5rem] py-4 px-6 flex flex-col items-center group-hover:bg-white/[0.08] transition-colors">
                                            <p className="text-[9px] font-black text-white/20 uppercase tracking-[0.3em] mb-2 leading-none">Entrega Instantânea</p>
                                            <div className="flex items-center">
                                                <Package className="w-4 h-4 text-brand-red mr-2 opacity-50" />
                                                <p className="text-xl font-black text-white leading-none tracking-tight">{pkg.gold.toLocaleString()} <span className="text-xs text-white/40 ml-0.5">GOLD</span></p>
                                            </div>
                                        </div>
                                        {pkg.bonus > 0 && (
                                            <div className="bg-emerald-500/5 border border-emerald-500/10 rounded-[1.5rem] py-4 px-6 flex flex-col items-center transition-all group-hover:bg-emerald-500/10">
                                                <p className="text-[9px] font-black text-emerald-500/40 uppercase tracking-[0.3em] mb-2 leading-none">Bônus Especial</p>
                                                <div className="flex items-center">
                                                    <Gift className="w-4 h-4 text-emerald-500 mr-2 opacity-50" />
                                                    <p className="text-xl font-black text-emerald-500 leading-none">+{pkg.bonus.toLocaleString()} <span className="text-[10px] opacity-40 ml-0.5 ml-0.5">GOLD</span></p>
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    <button
                                        onClick={() => handleBuy(pkg.id)}
                                        disabled={processingId === pkg.id}
                                        className="w-full bg-brand-red hover:bg-red-700 text-white font-black py-5 rounded-[1.5rem] mt-auto btn-glow-red transition-all text-[10px] tracking-[0.3em] flex items-center justify-center uppercase active:scale-95"
                                    >
                                        {processingId === pkg.id ? (
                                            <Loader2 className="w-5 h-5 animate-spin" />
                                        ) : (
                                            <>
                                                EU QUERO ESTE
                                                <ArrowRight className="w-4 h-4 ml-3 group-hover:translate-x-1 transition-transform" />
                                            </>
                                        )}
                                    </button>
                                </motion.div>
                            ))}
                        </div>
                    ) : (
                        <div className="glass-card rounded-[2.5rem] overflow-hidden border-white/5 relative">
                            {/* Decorative glow for table */}
                            <div className="absolute top-0 left-1/4 w-1/2 h-px bg-gradient-to-r from-transparent via-brand-red/50 to-transparent"></div>

                            <table className="w-full text-left">
                                <thead className="bg-white/5 border-b border-white/5">
                                    <tr>
                                        <th className="px-10 py-6 text-[9px] font-black text-white/20 uppercase tracking-[0.3em]">ID Transação</th>
                                        <th className="px-10 py-6 text-[9px] font-black text-white/20 uppercase tracking-[0.3em]">Investimento</th>
                                        <th className="px-10 py-6 text-[9px] font-black text-white/20 uppercase tracking-[0.3em]">Entrega Gold</th>
                                        <th className="px-10 py-6 text-[9px] font-black text-white/20 uppercase tracking-[0.3em]">Estado</th>
                                        <th className="px-10 py-6 text-[9px] font-black text-white/20 uppercase tracking-[0.3em]">Data Registro</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/5">
                                    {history.length > 0 ? history.map((item, idx) => (
                                        <motion.tr
                                            key={item.id}
                                            initial={{ opacity: 0, x: -10 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: idx * 0.05 }}
                                            className="hover:bg-white/[0.03] transition-colors group"
                                        >
                                            <td className="px-10 py-8 text-sm font-mono text-white/40 group-hover:text-white/60 transition-colors">
                                                <span className="text-[10px] opacity-20 mr-1">#</span>{item.id.toString().padStart(6, '0')}
                                            </td>
                                            <td className="px-10 py-8">
                                                <div className="flex flex-col">
                                                    <span className="text-white/30 text-[9px] font-black uppercase tracking-widest mb-1">Total Pago</span>
                                                    <span className="font-bold text-white text-lg">R$ {Number(item.amount).toFixed(2)}</span>
                                                </div>
                                            </td>
                                            <td className="px-10 py-8">
                                                <div className="flex flex-col">
                                                    <span className="text-white/30 text-[9px] font-black uppercase tracking-widest mb-1">Créditos</span>
                                                    <span className="font-black text-brand-red text-xl tracking-tight">{item.gold_amount.toLocaleString()} <span className="text-[10px] opacity-40">GOLD</span></span>
                                                </div>
                                            </td>
                                            <td className="px-10 py-8">
                                                <div className="flex items-center space-x-6">
                                                    <div className="flex items-center px-4 py-2 rounded-full bg-white/5 border border-white/5 group-hover:bg-white/10 transition-all">
                                                        <div className="mr-3">{getStatusIcon(item.status)}</div>
                                                        <span className={`text-[9px] font-black uppercase tracking-[0.2em] ${item.status === 'completed' ? 'text-emerald-500' : item.status === 'pending' ? 'text-yellow-500' : 'text-red-500'}`}>
                                                            {item.status === 'completed' ? 'CONCLUÍDO' : item.status === 'pending' ? 'PENDENTE' : 'CANCELADO'}
                                                        </span>
                                                    </div>
                                                    {item.status === 'pending' && (
                                                        <button
                                                            onClick={() => simulatePayment(item.id, item.gold_amount)}
                                                            className="text-[9px] bg-emerald-500 text-white font-black px-5 py-2.5 rounded-xl shadow-[0_0_15px_rgba(16,185,129,0.3)] hover:shadow-[0_0_25px_rgba(16,185,129,0.5)] transition-all uppercase active:scale-95"
                                                        >
                                                            SIMULAR PAGAMENTO
                                                        </button>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="px-10 py-8">
                                                <div className="flex flex-col">
                                                    <span className="text-white/30 text-[9px] font-black uppercase tracking-widest mb-1">Finalizado em</span>
                                                    <span className="text-xs font-bold text-white/50">{new Date(item.created_at).toLocaleDateString()}</span>
                                                </div>
                                            </td>
                                        </motion.tr>
                                    )) : (
                                        <tr>
                                            <td colSpan={5} className="px-10 py-32 text-center">
                                                <div className="flex flex-col items-center opacity-20">
                                                    <History className="w-16 h-16 mb-6 stroke-[1]" />
                                                    <p className="text-xs font-black uppercase tracking-[0.4em]">Histórico Limpo</p>
                                                </div>
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    )}
                </main>

                <div className="mt-16 flex justify-center">
                    <button
                        onClick={() => navigate('/dashboard')}
                        className="text-white/20 hover:text-white transition-all text-[9px] font-black tracking-[0.2em] flex items-center bg-white/5 px-10 py-5 rounded-[1.5rem] border border-white/5 hover:border-white/10"
                    >
                        <ArrowRight className="w-4 h-4 mr-3 rotate-180" />
                        RETORNAR AO DASHBOARD
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Donate;
