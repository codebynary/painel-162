import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, MapPin, ShieldAlert, ShieldOff, RefreshCcw, Search, UserMinus, MessageSquareOff, Loader2 } from 'lucide-react';
import axios from 'axios';

interface OnlinePlayer {
    roleid: number;
    name: string;
    level: number;
    map: string;
    x: number;
    y: number;
}

const OnlineTracker = () => {
    const [players, setPlayers] = useState<OnlinePlayer[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [stats, setStats] = useState({ count: 0 });

    const fetchOnlines = async () => {
        setIsLoading(true);
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get('http://localhost:3000/api/admin/onlines', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setPlayers(response.data.players);
            setStats({ count: response.data.count });
        } catch (error) {
            console.error('Error fetching onlines:', error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchOnlines();
        const interval = setInterval(fetchOnlines, 30000); // Polling every 30s
        return () => clearInterval(interval);
    }, []);

    const handleAction = async (roleid: number, action: 'ban' | 'mute') => {
        const time = action === 'ban' ? 3600 : 600; // Example times
        const reason = action === 'ban' ? 'Violação de regras' : 'Spam no chat';

        if (!window.confirm(`Tem certeza que deseja aplicar ${action.toUpperCase()} no RoleID ${roleid}?`)) return;

        try {
            const token = localStorage.getItem('token');
            await axios.post(`http://localhost:3000/api/admin/characters/${roleid}/${action}`, {
                reason,
                time
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            alert('Ação aplicada com sucesso!');
        } catch (error) {
            alert('Erro ao aplicar ação');
        }
    };

    const filteredPlayers = players.filter(p =>
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.roleid.toString().includes(search)
    );

    return (
        <div className="space-y-10 font-inter selection:bg-brand-red/30 relative">
            <div className="absolute inset-0 grainy-bg z-50"></div>

            <header className="flex flex-col md:flex-row justify-between items-start md:items-end border-b border-white/5 pb-8 relative z-10 gap-6">
                <div>
                    <h1 className="text-3xl font-black text-white tracking-tighter uppercase leading-none">JOGADORES <span className="text-brand-red font-outline">ONLINE</span></h1>
                    <p className="text-[10px] text-white/30 font-bold tracking-[0.2em] uppercase mt-2">Monitoramento dinâmico e moderação instantânea</p>
                </div>

                <div className="flex flex-wrap items-center gap-4 w-full md:w-auto">
                    <div className="relative flex-1 md:w-64">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
                        <input
                            type="text"
                            placeholder="Buscar nome ou ID..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full bg-white/5 border border-white/10 rounded-xl pl-12 pr-4 py-3 text-xs font-bold text-white outline-none focus:border-brand-red/50 transition-all"
                        />
                    </div>
                    <button
                        onClick={fetchOnlines}
                        className="p-3 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-all text-white/40 hover:text-white"
                    >
                        <RefreshCcw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
                    </button>
                    <div className="bg-brand-red/10 border border-brand-red/20 px-6 py-3 rounded-xl">
                        <span className="text-brand-red font-black text-xs uppercase tracking-widest">{stats.count} ONLINE</span>
                    </div>
                </div>
            </header>

            <div className="glass-card rounded-[32px] overflow-hidden border-white/5 relative z-10">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-white/5 border-b border-white/5">
                            <th className="px-8 py-6 text-[10px] font-black text-white/30 uppercase tracking-[0.2em]">Jogador</th>
                            <th className="px-8 py-6 text-[10px] font-black text-white/30 uppercase tracking-[0.2em]">Nível</th>
                            <th className="px-8 py-6 text-[10px] font-black text-white/30 uppercase tracking-[0.2em]">Localização</th>
                            <th className="px-8 py-6 text-[10px] font-black text-white/30 uppercase tracking-[0.2em] text-right">Ações Rápidas</th>
                        </tr>
                    </thead>
                    <tbody>
                        <AnimatePresence mode="popLayout">
                            {isLoading ? (
                                Array(3).fill(0).map((_, i) => (
                                    <tr key={i} className="animate-pulse">
                                        <td colSpan={4} className="px-8 py-6 h-20 bg-white/[0.02]"></td>
                                    </tr>
                                ))
                            ) : filteredPlayers.map((player) => (
                                <motion.tr
                                    key={player.roleid}
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    className="border-b border-white/5 hover:bg-white/[0.02] transition-colors group"
                                >
                                    <td className="px-8 py-6">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-xl bg-brand-red/10 flex items-center justify-center border border-brand-red/20 text-brand-red font-black text-xs">
                                                ID
                                            </div>
                                            <div>
                                                <p className="font-bold text-white text-sm">{player.name}</p>
                                                <p className="text-[10px] text-white/20 font-mono italic">RoleID: {player.roleid}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <span className="bg-white/5 px-2 py-1 rounded border border-white/10 text-[10px] font-black text-white/60">LVL {player.level}</span>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="flex items-center text-white/40 gap-2">
                                            <MapPin className="w-3 h-3 text-brand-red" />
                                            <span className="text-xs font-bold text-white/60">{player.map}</span>
                                            <span className="text-[10px] font-mono text-white/20 ml-2">({player.x}, {player.y})</span>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6 text-right">
                                        <div className="flex items-center justify-end gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button
                                                onClick={() => handleAction(player.roleid, 'mute')}
                                                className="p-2 bg-yellow-500/10 border border-yellow-500/20 rounded-lg text-yellow-500 hover:bg-yellow-500 hover:text-white transition-all"
                                                title="Silenciar (Mute)"
                                            >
                                                <MessageSquareOff className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={() => handleAction(player.roleid, 'ban')}
                                                className="p-2 bg-brand-red/10 border border-brand-red/20 rounded-lg text-brand-red hover:bg-brand-red hover:text-white transition-all shadow-[0_0_15px_rgba(204,0,0,0.1)]"
                                                title="Banir Personagem"
                                            >
                                                <UserMinus className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </td>
                                </motion.tr>
                            ))}
                        </AnimatePresence>
                    </tbody>
                </table>

                {!isLoading && filteredPlayers.length === 0 && (
                    <div className="p-20 text-center">
                        <Users className="w-12 h-12 text-white/5 mx-auto mb-4" />
                        <p className="text-[10px] font-black text-white/20 uppercase tracking-[0.3em]">Nenhum herói encontrado nesta consulta</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default OnlineTracker;
