import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Package, Plus, Edit2, Trash2, Save, X, Zap, DollarSign, Gift, Loader2 } from 'lucide-react';
import axios from 'axios';

interface DonatePackage {
    id: number;
    name: string;
    price: number;
    gold: number;
    bonus: number;
    image_url?: string;
}

const StoreManager = () => {
    const [packages, setPackages] = useState<DonatePackage[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isEditing, setIsEditing] = useState<number | 'new' | null>(null);
    const [editForm, setEditForm] = useState<Partial<DonatePackage>>({});
    const [isSaving, setIsSaving] = useState(false);

    const fetchPackages = async () => {
        setIsLoading(true);
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get('http://localhost:3000/api/admin/store/packages', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setPackages(response.data);
        } catch (error) {
            console.error('Error fetching packages', error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchPackages();
    }, []);

    const handleEdit = (pkg: DonatePackage | 'new') => {
        if (pkg === 'new') {
            setIsEditing('new');
            setEditForm({ name: '', price: 0, gold: 0, bonus: 0 });
        } else {
            setIsEditing(pkg.id);
            setEditForm(pkg);
        }
    };

    const handleSave = async () => {
        setIsSaving(true);
        try {
            const token = localStorage.getItem('token');
            if (isEditing === 'new') {
                await axios.post('http://localhost:3000/api/admin/store/packages', editForm, {
                    headers: { Authorization: `Bearer ${token}` }
                });
            } else {
                await axios.put(`http://localhost:3000/api/admin/store/packages/${isEditing}`, editForm, {
                    headers: { Authorization: `Bearer ${token}` }
                });
            }
            setIsEditing(null);
            fetchPackages();
        } catch (error) {
            alert('Erro ao salvar pacote');
        } finally {
            setIsSaving(false);
        }
    };

    const handleDelete = async (id: number) => {
        if (!window.confirm('Tem certeza que deseja excluir este pacote?')) return;
        try {
            const token = localStorage.getItem('token');
            await axios.delete(`http://localhost:3000/api/admin/store/packages/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            fetchPackages();
        } catch (error) {
            alert('Erro ao excluir pacote');
        }
    };

    return (
        <div className="space-y-10 font-inter">
            <header className="flex justify-between items-end border-b border-white/5 pb-8">
                <div>
                    <h1 className="text-3xl font-black text-white tracking-tighter uppercase">GERENCIAR <span className="text-brand-red">LOJA</span></h1>
                    <p className="text-white/30 text-xs font-bold tracking-[0.2em] uppercase mt-1">Configuração de pacotes de Gold e ofertas</p>
                </div>
                <button
                    onClick={() => handleEdit('new')}
                    className="bg-brand-red hover:bg-red-700 text-white px-6 py-3 rounded-xl text-xs font-black tracking-widest flex items-center shadow-[0_0_20px_rgba(204,0,0,0.2)] transition-all"
                >
                    <Plus className="w-4 h-4 mr-2" />
                    NOVO PACOTE
                </button>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <AnimatePresence mode="popLayout">
                    {isLoading ? (
                        Array(3).fill(0).map((_, i) => (
                            <div key={i} className="h-64 bg-white/5 animate-pulse rounded-3xl border border-white/5"></div>
                        ))
                    ) : packages.map((pkg) => (
                        <motion.div
                            key={pkg.id}
                            layout
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            className="glass-card rounded-3xl p-8 border-white/5 relative group overflow-hidden"
                        >
                            <div className="flex justify-between items-start mb-6">
                                <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center border border-white/10 text-brand-red">
                                    <Zap className="w-6 h-6 fill-brand-red" />
                                </div>
                                <div className="flex space-x-2">
                                    <button onClick={() => handleEdit(pkg)} className="p-2 bg-white/5 hover:bg-white/10 rounded-lg text-white/40 hover:text-white transition-all">
                                        <Edit2 className="w-4 h-4" />
                                    </button>
                                    <button onClick={() => handleDelete(pkg.id)} className="p-2 bg-white/5 hover:bg-red-500/20 rounded-lg text-white/40 hover:text-red-500 transition-all">
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>

                            <h3 className="text-xl font-black text-white mb-1 uppercase tracking-tight">{pkg.name}</h3>
                            <p className="text-sm font-bold text-brand-red mb-6">R$ {Number(pkg.price).toFixed(2)}</p>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="bg-white/5 rounded-2xl p-4 border border-white/5">
                                    <p className="text-[10px] font-black text-white/20 uppercase tracking-widest mb-1">Gold</p>
                                    <p className="text-lg font-black text-white">{pkg.gold.toLocaleString()}</p>
                                </div>
                                <div className="bg-white/5 rounded-2xl p-4 border border-white/5">
                                    <p className="text-[10px] font-black text-white/20 uppercase tracking-widest mb-1">Bônus</p>
                                    <p className="text-lg font-black text-emerald-500">+{pkg.bonus.toLocaleString()}</p>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>

            {/* Modal de Edição/Criação */}
            <AnimatePresence>
                {isEditing !== null && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsEditing(null)}
                            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                        ></motion.div>

                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            className="bg-[#0f0f0f] border border-white/10 rounded-[32px] w-full max-w-lg p-10 relative z-10 shadow-[0_30px_60px_rgba(0,0,0,0.5)]"
                        >
                            <h2 className="text-2xl font-black text-white mb-8 tracking-tighter">
                                {isEditing === 'new' ? 'CRIAR NOVO PACOTE' : 'EDITAR PACOTE'}
                            </h2>

                            <div className="space-y-6">
                                <div>
                                    <label className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em] mb-3 block">Nome do Pacote</label>
                                    <input
                                        type="text"
                                        value={editForm.name}
                                        onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                                        className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white focus:border-brand-red/50 transition-all outline-none font-bold"
                                        placeholder="Ex: Pacote Lendário"
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-6">
                                    <div>
                                        <label className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em] mb-3 block">Preço (R$)</label>
                                        <div className="relative">
                                            <DollarSign className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
                                            <input
                                                type="number"
                                                value={editForm.price}
                                                onChange={(e) => setEditForm({ ...editForm, price: Number(e.target.value) })}
                                                className="w-full bg-white/5 border border-white/10 rounded-2xl pl-12 pr-6 py-4 text-white focus:border-brand-red/50 transition-all outline-none font-bold"
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em] mb-3 block">Gold Base</label>
                                        <input
                                            type="number"
                                            value={editForm.gold}
                                            onChange={(e) => setEditForm({ ...editForm, gold: Number(e.target.value) })}
                                            className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white focus:border-brand-red/50 transition-all outline-none font-bold"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em] mb-3 block">Gold Bônus</label>
                                    <div className="relative">
                                        <Gift className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
                                        <input
                                            type="number"
                                            value={editForm.bonus}
                                            onChange={(e) => setEditForm({ ...editForm, bonus: Number(e.target.value) })}
                                            className="w-full bg-white/5 border border-white/10 rounded-2xl pl-12 pr-6 py-4 text-white focus:border-brand-red/50 transition-all outline-none font-bold"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="flex gap-4 mt-12">
                                <button
                                    onClick={() => setIsEditing(null)}
                                    className="flex-1 bg-white/5 hover:bg-white/10 text-white font-black py-5 rounded-2xl text-xs tracking-widest transition-all"
                                >
                                    CANCELAR
                                </button>
                                <button
                                    onClick={handleSave}
                                    disabled={isSaving}
                                    className="flex-1 bg-brand-red hover:bg-red-700 text-white font-black py-5 rounded-2xl text-xs tracking-widest transition-all flex items-center justify-center shadow-[0_0_20px_rgba(204,0,0,0.2)]"
                                >
                                    {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
                                    SALVAR ALTERAÇÕES
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default StoreManager;
