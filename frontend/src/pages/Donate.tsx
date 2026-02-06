import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { CreditCard, Package, History, ArrowRight, Zap, Loader2, CheckCircle2, Clock, XCircle } from 'lucide-react';
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

    const handleBuy = async (packageId: number) => {
        setProcessingId(packageId);
        try {
            const token = localStorage.getItem('token');
            const response = await axios.post('http://localhost:3000/api/donate/create',
                { packageId },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            window.open(response.data.paymentUrl, '_blank');
            alert('Aba de pagamento aberta. Após concluir, atualize a página.');
        } catch (error) {
            alert('Erro ao iniciar compra.');
        } finally {
            setProcessingId(null);
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

            <div className="relative z-10 max-w-7xl mx-auto p-6 lg:p-12">
                <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-16 gap-8">
                    <div>
                        <h1 className="text-4xl font-black text-white tracking-tighter text-glow-red uppercase">
                            LOJA DE <span className="text-brand-red">GOLD</span>
                        </h1>
                        <p className="text-white/30 font-medium tracking-wide mt-1">Fortaleça sua conta com recursos e itens exclusivos.</p>
                    </div>
                    <div className="flex bg-white/5 p-1 rounded-2xl border border-white/10">
                        <button
                            onClick={() => setActiveTab('store')}
                            className={`px-6 py-3 rounded-xl text-xs font-black tracking-widest transition-all ${activeTab === 'store' ? 'bg-brand-red text-white shadow-[0_0_15px_rgba(204,0,0,0.3)]' : 'text-white/40 hover:text-white'}`}
                        >
                            <Package className="w-4 h-4 inline-block mr-2" />
                            PACOTES
                        </button>
                        <button
                            onClick={() => setActiveTab('history')}
                            className={`px-6 py-3 rounded-xl text-xs font-black tracking-widest transition-all ${activeTab === 'history' ? 'bg-brand-red text-white shadow-[0_0_15px_rgba(204,0,0,0.3)]' : 'text-white/40 hover:text-white'}`}
                        >
                            <History className="w-4 h-4 inline-block mr-2" />
                            HISTÓRICO
                        </button>
                    </div>
                </header>

                <main>
                    {activeTab === 'store' ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                            {isLoading ? (
                                Array(4).fill(0).map((_, i) => (
                                    <div key={i} className="h-[400px] glass-card rounded-3xl animate-pulse"></div>
                                ))
                            ) : packages.map((pkg, index) => (
                                <motion.div
                                    key={pkg.id}
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: index * 0.1 }}
                                    className="glass-card rounded-3xl p-8 border-white/5 hover:border-brand-red/30 transition-all group flex flex-col items-center text-center"
                                >
                                    <div className="w-20 h-20 bg-gradient-to-br from-brand-red to-red-900 rounded-3xl flex items-center justify-center mb-8 shadow-[0_10px_30px_rgba(204,0,0,0.3)] group-hover:scale-110 transition-transform">
                                        <Zap className="w-10 h-10 text-white fill-white" />
                                    </div>

                                    <h3 className="text-xl font-black text-white mb-2">{pkg.name}</h3>
                                    <p className="text-4xl font-black text-white mb-8 tracking-tighter">
                                        <span className="text-sm font-medium text-white/40 mr-1">R$</span>
                                        {Number(pkg.price).toFixed(2)}
                                    </p>

                                    <div className="w-full space-y-4 mb-10">
                                        <div className="bg-white/5 border border-white/5 rounded-2xl py-3 px-4">
                                            <p className="text-[10px] font-black text-white/20 uppercase tracking-widest leading-none mb-1">Conteúdo</p>
                                            <p className="text-lg font-bold text-white leading-none whitespace-nowrap">{pkg.gold.toLocaleString()} GOLD</p>
                                        </div>
                                        {pkg.bonus > 0 && (
                                            <div className="bg-emerald-500/5 border border-emerald-500/10 rounded-2xl py-3 px-4">
                                                <p className="text-[10px] font-black text-emerald-500/40 uppercase tracking-widest leading-none mb-1">Bônus Especial</p>
                                                <p className="text-lg font-bold text-emerald-500 leading-none">+{pkg.bonus.toLocaleString()} GOLD</p>
                                            </div>
                                        )}
                                    </div>

                                    <button
                                        onClick={() => handleBuy(pkg.id)}
                                        disabled={processingId === pkg.id}
                                        className="w-full bg-brand-red hover:bg-red-700 text-white font-black py-4 rounded-2xl mt-auto shadow-[0_0_20px_rgba(204,0,0,0.2)] transition-all text-xs tracking-widest flex items-center justify-center"
                                    >
                                        {processingId === pkg.id ? (
                                            <Loader2 className="w-4 h-4 animate-spin" />
                                        ) : (
                                            <>
                                                COMPRAR AGORA
                                                <ArrowRight className="w-4 h-4 ml-2" />
                                            </>
                                        )}
                                    </button>
                                </motion.div>
                            ))}
                        </div>
                    ) : (
                        <div className="glass-card rounded-3xl overflow-hidden border-white/5">
                            <table className="w-full text-left">
                                <thead className="bg-white/5 border-b border-white/5">
                                    <tr>
                                        <th className="px-8 py-5 text-[10px] font-black text-white/20 uppercase tracking-widest">ID</th>
                                        <th className="px-8 py-5 text-[10px] font-black text-white/20 uppercase tracking-widest">Valor</th>
                                        <th className="px-8 py-5 text-[10px] font-black text-white/20 uppercase tracking-widest">Gold</th>
                                        <th className="px-8 py-5 text-[10px] font-black text-white/20 uppercase tracking-widest">Status</th>
                                        <th className="px-8 py-5 text-[10px] font-black text-white/20 uppercase tracking-widest">Data</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/5">
                                    {history.length > 0 ? history.map((item) => (
                                        <tr key={item.id} className="hover:bg-white/[0.02] transition-colors">
                                            <td className="px-8 py-6 text-sm font-mono text-white/40">#{item.id}</td>
                                            <td className="px-8 py-6 font-bold text-white">R$ {Number(item.amount).toFixed(2)}</td>
                                            <td className="px-8 py-6 font-black text-brand-red">{item.gold_amount.toLocaleString()}</td>
                                            <td className="px-8 py-6">
                                                <div className="flex items-center space-x-2">
                                                    {getStatusIcon(item.status)}
                                                    <span className={`text-[10px] font-black uppercase tracking-widest ${item.status === 'completed' ? 'text-emerald-500' : 'text-white/20'}`}>
                                                        {item.status}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-8 py-6 text-xs text-white/30">{new Date(item.created_at).toLocaleDateString()}</td>
                                        </tr>
                                    )) : (
                                        <tr>
                                            <td colSpan={5} className="px-8 py-16 text-center text-white/20 font-bold uppercase tracking-widest">
                                                Nenhuma transação encontrada.
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
                        className="text-white/30 hover:text-white transition-colors text-xs font-bold flex items-center bg-white/5 px-8 py-4 rounded-2xl border border-white/10"
                    >
                        VOLTAR AO INÍCIO
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Donate;
