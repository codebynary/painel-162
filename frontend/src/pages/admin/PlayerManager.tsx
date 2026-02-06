import { useEffect, useState } from 'react';
import axios from 'axios';
import { Ban, Search, Eye, MapPin, Package, Mail, Shield, User, Loader2, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Types
interface UserData {
    ID: number;
    name: string;
    email: string;
    is_admin: number;
}

interface Character {
    id: number;
    name: string;
    level: number;
    cls: number;
    reputation: number;
}

const PlayerManager = () => {
    const [users, setUsers] = useState<UserData[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [isLoading, setIsLoading] = useState(true);

    // Modal States
    const [selectedUser, setSelectedUser] = useState<UserData | null>(null);
    const [userCharacters, setUserCharacters] = useState<Character[]>([]);
    const [isCharModalLoading, setIsCharModalLoading] = useState(false);

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        setIsLoading(true);
        try {
            const token = localStorage.getItem('token');
            const res = await axios.get('http://localhost:3000/api/admin/users', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setUsers(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    const filteredUsers = users.filter(u =>
        u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const openCharacterModal = async (user: UserData) => {
        setSelectedUser(user);
        setIsCharModalLoading(true);
        try {
            const token = localStorage.getItem('token');
            const res = await axios.get(`http://localhost:3000/api/admin/users/${user.ID}/characters`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setUserCharacters(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setIsCharModalLoading(false);
        }
    };

    return (
        <div className="space-y-10 font-inter">
            <header className="flex flex-col md:flex-row justify-between items-end border-b border-white/5 pb-8 gap-6">
                <div>
                    <h1 className="text-3xl font-black text-white tracking-tighter uppercase">GESTOR DE <span className="text-brand-red">JOGADORES</span></h1>
                    <p className="text-white/30 text-sm font-medium mt-1 tracking-wide">Administração completa de contas e personagens.</p>
                </div>
                <div className="relative group w-full md:w-80">
                    <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20 group-focus-within:text-brand-red transition-colors" />
                    <input
                        type="text"
                        placeholder="Buscar por nome ou email..."
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                        className="w-full bg-white/5 border border-white/10 rounded-2xl pl-12 pr-6 py-4 text-xs font-bold text-white focus:outline-none focus:border-brand-red/50 focus:ring-4 focus:ring-brand-red/5 transition-all outline-none"
                    />
                </div>
            </header>

            <div className="glass-card rounded-3xl overflow-hidden border-white/5">
                <table className="w-full text-left">
                    <thead className="bg-white/5 border-b border-white/5">
                        <tr>
                            <th className="px-8 py-5 text-[10px] font-black text-white/20 uppercase tracking-widest">ID</th>
                            <th className="px-8 py-5 text-[10px] font-black text-white/20 uppercase tracking-widest">Jogador</th>
                            <th className="px-8 py-5 text-[10px] font-black text-white/20 uppercase tracking-widest">Email</th>
                            <th className="px-8 py-5 text-[10px] font-black text-white/20 uppercase tracking-widest">Nível</th>
                            <th className="px-8 py-5 text-right text-[10px] font-black text-white/20 uppercase tracking-widest">Ações</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                        {isLoading ? (
                            Array(5).fill(0).map((_, i) => (
                                <tr key={i} className="animate-pulse">
                                    <td colSpan={5} className="px-8 py-6 h-16 bg-white/[0.02]"></td>
                                </tr>
                            ))
                        ) : filteredUsers.map(user => (
                            <tr key={user.ID} className="hover:bg-white/[0.02] transition-colors group">
                                <td className="px-8 py-6 text-sm font-mono text-white/20">#{user.ID}</td>
                                <td className="px-8 py-6">
                                    <div className="flex items-center space-x-3">
                                        <div className="w-10 h-10 rounded-xl bg-brand-red/10 border border-brand-red/20 flex items-center justify-center">
                                            <User className="w-5 h-5 text-brand-red" />
                                        </div>
                                        <span className="font-bold text-white group-hover:text-brand-red transition-colors uppercase text-sm tracking-tight">{user.name}</span>
                                    </div>
                                </td>
                                <td className="px-8 py-6 text-sm text-white/40">{user.email}</td>
                                <td className="px-8 py-6">
                                    {user.is_admin === 1 ? (
                                        <span className="bg-brand-red/10 text-brand-red px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border border-brand-red/20">ADMIN</span>
                                    ) : (
                                        <span className="bg-white/5 text-white/40 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border border-white/5">PLAYER</span>
                                    )}
                                </td>
                                <td className="px-8 py-6 text-right">
                                    <div className="flex justify-end space-x-2">
                                        <button
                                            onClick={() => openCharacterModal(user)}
                                            className="p-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl transition-all text-white/40 hover:text-white"
                                            title="Ver Personagens"
                                        >
                                            <Eye className="w-4 h-4" />
                                        </button>
                                        <button
                                            className="p-3 bg-white/5 hover:bg-brand-red/10 border border-white/10 hover:border-brand-red/30 rounded-xl transition-all text-white/40 hover:text-brand-red"
                                            title="Banir/Punição"
                                        >
                                            <Ban className="w-4 h-4" />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Character List Modal */}
            <AnimatePresence>
                {selectedUser && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/80 backdrop-blur-md">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            className="bg-[#0A0A0A] border border-white/10 rounded-[32px] p-10 w-full max-w-2xl shadow-[0_0_50px_rgba(0,0,0,0.5)] relative overflow-hidden"
                        >
                            <div className="absolute top-0 right-0 w-64 h-64 bg-brand-red/5 blur-[100px] rounded-full -mr-32 -mt-32"></div>

                            <div className="flex justify-between items-start mb-10 relative z-10">
                                <div>
                                    <p className="text-[10px] font-black text-brand-red uppercase tracking-[0.3em] mb-2 leading-none">Personagens da Conta</p>
                                    <h2 className="text-3xl font-black text-white tracking-tighter uppercase">{selectedUser.name}</h2>
                                </div>
                                <button
                                    onClick={() => setSelectedUser(null)}
                                    className="p-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl text-white/40 hover:text-white transition-all"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            <div className="space-y-4 relative z-10">
                                {isCharModalLoading ? (
                                    <div className="flex flex-col items-center justify-center py-20 grayscale opacity-20">
                                        <Loader2 className="w-10 h-10 animate-spin mb-4" />
                                        <p className="font-black text-xs tracking-widest">CARREGANDO DADOS...</p>
                                    </div>
                                ) : userCharacters.length > 0 ? userCharacters.map(char => (
                                    <div key={char.id} className="flex items-center justify-between p-6 bg-white/[0.03] rounded-3xl border border-white/5 group hover:border-brand-red/20 transition-all">
                                        <div className="flex items-center space-x-4">
                                            <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center border border-white/10 group-hover:border-brand-red/30 transition-all">
                                                <Shield className="w-6 h-6 text-white/20 group-hover:text-brand-red" />
                                            </div>
                                            <div>
                                                <h3 className="font-black text-white text-lg tracking-tight uppercase">{char.name}</h3>
                                                <p className="text-[10px] font-bold text-white/20 tracking-wider">LÉVEL {char.level} • ID: {char.id}</p>
                                            </div>
                                        </div>
                                        <div className="flex space-x-2">
                                            <button className="px-6 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-[10px] font-black tracking-widest uppercase transition-all">
                                                HISTÓRICO
                                            </button>
                                            <button className="px-6 py-3 bg-brand-red hover:bg-red-700 shadow-[0_5px_15px_rgba(204,0,0,0.2)] rounded-xl text-[10px] font-black tracking-widest uppercase transition-all">
                                                EDITAR
                                            </button>
                                        </div>
                                    </div>
                                )) : (
                                    <div className="text-center py-20 border-2 border-dashed border-white/5 rounded-[32px]">
                                        <p className="text-white/20 font-black text-xs tracking-[0.2em] uppercase">Nenhum personagem encontrado</p>
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default PlayerManager;
