import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import CharacterCard from '../components/CharacterCard';
import axios from 'axios';
import { LogOut, RefreshCcw } from 'lucide-react';
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
    const navigate = useNavigate();

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
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/login');
    };

    return (
        <div className="min-h-screen bg-[#050505] text-white relative overflow-hidden font-inter">
            {/* Background Decor */}
            <div className="fixed inset-0 bg-[radial-gradient(circle_at_50%_0%,#200000_0%,#000000_100%)] opacity-40"></div>
            <div className="fixed top-[-10%] right-[-10%] w-[40%] h-[40%] bg-brand-red/5 blur-[120px] rounded-full"></div>

            <div className="relative z-10 max-w-7xl mx-auto p-6 lg:p-12">
                <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-16 gap-6">
                    <div>
                        <h1 className="text-4xl font-black text-white tracking-tighter text-glow-red">
                            MINHA <span className="text-brand-red">JORNADA</span>
                        </h1>
                        <p className="text-white/30 font-medium tracking-wide mt-1">Gerencie seus personagens e recursos com perfeição.</p>
                    </div>
                    <div className="flex items-center space-x-4">
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={handleLogout}
                            className="bg-brand-red/10 border border-brand-red/30 px-6 py-3 rounded-xl text-xs font-bold text-brand-red hover:bg-brand-red hover:text-white transition-all flex items-center shadow-[0_0_15px_rgba(204,0,0,0.1)]"
                        >
                            <LogOut className="w-4 h-4 mr-2" />
                            ENCERRAR SESSÃO
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
                                        <span className="text-2xl font-black text-white block leading-none">0</span>
                                        <span className="text-[10px] text-brand-red font-bold uppercase tracking-widest">CASH</span>
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

                        {/* Server Status Mock */}
                        <div className="glass-card rounded-2xl p-6 border-white/5 flex items-center justify-between">
                            <div className="flex items-center space-x-4">
                                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_8px_#10b981]"></div>
                                <span className="text-xs font-bold text-white/60 uppercase tracking-wider">Status do Servidor</span>
                            </div>
                            <span className="text-[10px] font-black text-emerald-500 bg-emerald-500/10 px-2 py-1 rounded border border-emerald-500/20">ONLINE</span>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default Dashboard;
