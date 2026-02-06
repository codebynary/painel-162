import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import CharacterCard from '../components/CharacterCard';
import logo from '../assets/logo-velorian.png';
import axios from 'axios';
import { LogOut, RefreshCcw, ShieldCheck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface Character {
    id: number;
    name: string;
    level: number;
    cls: number;
    reputation: number;
    gender: number;
    roleid: number;
}

const Dashboard = () => {
    const [characters, setCharacters] = useState<Character[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isServerOnline, setIsServerOnline] = useState(false);
    const [balance, setBalance] = useState(0);
    const navigate = useNavigate();

    const fetchBalance = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get('http://localhost:3000/api/donate/balance', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setBalance(response.data.balance);
        } catch (error) {
            console.error('Error fetching balance', error);
        }
    };

    const fetchServerStatus = async () => {
        try {
            const response = await axios.get('http://localhost:3000/api/server/status');
            const online = response.data.some((proc: any) => proc.running);
            setIsServerOnline(online);
        } catch (error) {
            console.error('Error fetching server status', error);
            setIsServerOnline(false);
        }
    };

    const fetchCharacters = async () => {
        setIsLoading(true);
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get('http://localhost:3000/api/characters', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setCharacters(response.data);
        } catch (error) {
            console.error('Error fetching characters', error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchCharacters();
        fetchServerStatus();
        fetchBalance();
        // Polling status
        const interval = setInterval(() => {
            fetchServerStatus();
            fetchBalance();
        }, 30000);
        return () => clearInterval(interval);
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/login');
    };

    return (
        <div className="min-h-screen bg-[#050505] text-white relative overflow-hidden font-inter selection:bg-brand-red/30">
            {/* Grainy Overlay */}
            <div className="absolute inset-0 grainy-bg z-50"></div>

            {/* Background Decor */}
            <div className="fixed inset-0 bg-[radial-gradient(circle_at_50%_0%,#200000_0%,#000000_100%)] opacity-40"></div>
            <div className="fixed top-[-10%] right-[-10%] w-[40%] h-[40%] bg-brand-red/5 blur-[120px] rounded-full"></div>


            <div className="relative z-10 max-w-7xl mx-auto p-6 lg:p-12">
                <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-16 gap-6">
                    <div className="flex items-center gap-6">
                        <img
                            src={logo}
                            alt="Velorian Logo"
                            className="w-16 h-16 drop-shadow-[0_0_15px_rgba(204,0,0,0.4)] mix-blend-screen"
                        />
                        <div>
                            <h1 className="text-4xl font-black text-white tracking-tighter text-glow-red uppercase leading-none">
                                VELORIAN <span className="text-brand-red font-outline">PW</span>
                            </h1>
                            <p className="text-[10px] text-white/30 font-bold tracking-[0.2em] uppercase mt-2">Plataforma de Gestão de Heróis</p>
                        </div>

                    </div>
                    <div className="flex items-center space-x-4">
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => navigate('/admin')}
                            className="bg-brand-red/10 border border-brand-red/30 px-6 py-3 rounded-xl text-xs font-bold text-brand-red hover:bg-brand-red hover:text-white transition-all flex items-center shadow-[0_0_15px_rgba(204,0,0,0.1)]"
                        >
                            <ShieldCheck className="w-4 h-4 mr-2" />
                            PAINEL ADMIN
                        </motion.button>
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={handleLogout}
                            className="bg-white/5 border border-white/10 px-6 py-3 rounded-xl text-xs font-bold text-white/40 hover:bg-white/10 hover:text-white transition-all flex items-center"
                        >
                            <LogOut className="w-4 h-4 mr-2" />
                            ENCERRAR
                        </motion.button>
                    </div>
                </header>

                <main className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                    {/* Character Column */}
                    <div className="lg:col-span-8 space-y-8">
                        <div className="flex items-center justify-between border-b border-white/5 pb-4">
                            <h2 className="text-lg font-bold text-white/80 flex items-center">
                                <span className="w-2 h-2 bg-brand-red rounded-full mr-3 shadow-[0_0_8px_#cc0000]"></span>
                                SEUS PERSONAGENS
                            </h2>
                            <button
                                onClick={fetchCharacters}
                                className={`text-white/40 hover:text-white transition-colors flex items-center text-xs font-bold ${isLoading ? 'animate-pulse' : ''}`}
                            >
                                <RefreshCcw className={`w-3 h-3 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
                                ATUALIZAR LISTA
                            </button>
                        </div>

                        {isLoading ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {[1, 2].map(i => (
                                    <div key={i} className="h-40 glass-card rounded-2xl animate-pulse"></div>
                                ))}
                            </div>
                        ) : characters.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {characters.map((char, index) => (
                                    <CharacterCard
                                        key={char.id}
                                        character={char}
                                        index={index}
                                        onActionSuccess={fetchCharacters}
                                    />
                                ))}
                            </div>
                        ) : (
                            <div className="glass-card rounded-2xl p-16 text-center border-dashed border-white/10">
                                <p className="text-white/20 font-bold uppercase tracking-widest text-sm">Nenhum guerreiro encontrado nesta conta.</p>
                            </div>
                        )}
                    </div>

                    {/* Sidebar / Stats */}
                    <div className="lg:col-span-4 space-y-8">
                        <div className="glass-card rounded-2xl p-8 border-brand-red/10 overflow-hidden relative">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-brand-red/10 blur-3xl rounded-full -mr-16 -mt-16"></div>

                            <h3 className="text-xs font-black text-white/20 tracking-[0.2em] mb-8 uppercase">Estado da Conta</h3>

                            <div className="space-y-6">
                                <div className="flex items-center justify-between">
                                    <span className="text-white/40 text-sm font-medium">Status</span>
                                    <span className="text-emerald-400 bg-emerald-400/10 px-3 py-1 rounded-lg text-[10px] font-black border border-emerald-400/20 uppercase tracking-tighter">ATIVO</span>
                                </div>
                                <div className="flex items-center justify-between border-t border-white/5 pt-6">
                                    <span className="text-white/40 text-sm font-medium">Créditos Gold</span>
                                    <div className="text-right">
                                        <span className="text-3xl font-black text-white block leading-none tracking-tighter text-glow-white">{balance.toLocaleString()}</span>
                                        <span className="text-[10px] text-brand-red font-bold uppercase tracking-[0.2em] mt-1 block">CASH</span>
                                    </div>
                                </div>

                            </div>

                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                className="w-full bg-brand-red hover:bg-red-700 text-white font-black py-5 rounded-xl mt-10 shadow-[0_0_20px_rgba(204,0,0,0.3)] transition-all text-xs tracking-widest"
                                onClick={() => navigate('/donate')}
                            >
                                ADQUIRIR GOLD
                            </motion.button>
                        </div>

                        {/* Server Status Dynamic */}
                        <div className="glass-card rounded-2xl p-6 border-white/5 flex items-center justify-between">
                            <div className="flex items-center space-x-4">
                                <div className={`w-2 h-2 ${isServerOnline ? 'bg-emerald-500 shadow-[0_0_8px_#10b981]' : 'bg-red-500 shadow-[0_0_8px_#ef4444]'} rounded-full ${isServerOnline ? 'animate-pulse' : ''}`}></div>
                                <span className="text-xs font-bold text-white/60 uppercase tracking-wider">Status do Servidor</span>
                            </div>
                            <span className={`text-[10px] font-black ${isServerOnline ? 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20' : 'text-red-500 bg-red-500/10 border-red-500/20'} px-2 py-1 rounded border uppercase`}>
                                {isServerOnline ? 'ONLINE' : 'OFFLINE'}
                            </span>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default Dashboard;
