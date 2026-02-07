import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Package, Briefcase, ChevronRight, X, Loader2, Info, MapPin } from 'lucide-react';
import axios from 'axios';

interface Item {
    slot: number;
    item_id: number;
    count: number;
    name: string;
    icon?: string;
}

interface InventoryBankViewerProps {
    roleId: number;
    charName: string;
    onClose: () => void;
}

const InventoryBankViewer: React.FC<InventoryBankViewerProps> = ({ roleId, charName, onClose }) => {
    const [activeTab, setActiveTab] = useState<'inventory' | 'bank'>('inventory');
    const [data, setData] = useState<{ inventory: Item[], bank: Item[] } | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [hoveredItem, setHoveredItem] = useState<Item | null>(null);

    useEffect(() => {
        const fetchItems = async () => {
            setIsLoading(true);
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get(`http://localhost:3000/api/characters/${roleId}/items`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setData(response.data);
            } catch (error) {
                console.error('Error fetching items:', error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchItems();
    }, [roleId]);

    const currentItems = activeTab === 'inventory' ? data?.inventory : data?.bank;
    const totalSlots = activeTab === 'inventory' ? 64 : 80; // Standard PW sizes

    const renderGrid = () => {
        const grid = [];
        for (let i = 0; i < totalSlots; i++) {
            const item = currentItems?.find(it => it.slot === i);
            grid.push(
                <div
                    key={i}
                    className="relative w-12 h-12 md:w-14 md:h-14 bg-white/[0.03] border border-white/10 rounded-lg flex items-center justify-center group hover:border-brand-red/40 transition-all cursor-pointer overflow-hidden"
                    onMouseEnter={() => item && setHoveredItem(item)}
                    onMouseLeave={() => setHoveredItem(null)}
                >
                    {item ? (
                        <>
                            <div className="absolute inset-0 bg-brand-red/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                            <img
                                src={`/assets/items/${item.item_id}.png`}
                                alt={item.name}
                                className="w-8 h-8 md:w-10 md:h-10 relative z-10"
                                onError={(e) => {
                                    // Fallback to external API if local not found
                                    (e.target as HTMLImageElement).src = `https://api.velorianpw.com/icons/${item.item_id}.png`;
                                    (e.target as HTMLImageElement).onerror = (err) => {
                                        (err.target as HTMLImageElement).src = 'https://via.placeholder.com/32?text=?';
                                    };
                                }}
                            />
                            {item.count > 1 && (
                                <span className="absolute bottom-1 right-1 text-[9px] font-black text-white bg-black/60 px-1 rounded z-20 pointer-events-none">
                                    {item.count}
                                </span>
                            )}
                        </>
                    ) : (
                        <div className="w-full h-full flex items-center justify-center opacity-10">
                            <div className="w-1 h-1 bg-white rounded-full"></div>
                        </div>
                    )}
                </div>
            );
        }
        return grid;
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8 bg-black/80 backdrop-blur-md font-inter"
        >
            <motion.div
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                className="w-full max-w-4xl glass-card rounded-[40px] border-white/10 overflow-hidden relative"
            >
                {/* Grainy Overlay */}
                <div className="absolute inset-0 grainy-bg z-0 opacity-40 pointer-events-none"></div>

                <div className="p-8 md:p-12 relative z-10">
                    <div className="flex justify-between items-start mb-10">
                        <div>
                            <p className="text-[10px] font-black text-brand-red uppercase tracking-[0.3em] mb-2">Visualizador de Itens</p>
                            <h2 className="text-3xl font-black text-white tracking-tighter uppercase">{charName}</h2>
                        </div>
                        <button
                            onClick={onClose}
                            className="p-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl transition-all group"
                        >
                            <X className="w-5 h-5 text-white/40 group-hover:text-white" />
                        </button>
                    </div>

                    <div className="flex gap-4 mb-8">
                        <button
                            onClick={() => setActiveTab('inventory')}
                            className={`flex-1 flex items-center justify-center gap-3 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest border transition-all ${activeTab === 'inventory' ? 'bg-brand-red border-brand-red text-white shadow-glow' : 'bg-white/5 border-white/10 text-white/40 hover:text-white'}`}
                        >
                            <Package className="w-4 h-4" />
                            Inventário
                        </button>
                        <button
                            onClick={() => setActiveTab('bank')}
                            className={`flex-1 flex items-center justify-center gap-3 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest border transition-all ${activeTab === 'bank' ? 'bg-brand-red border-brand-red text-white shadow-glow' : 'bg-white/5 border-white/10 text-white/40 hover:text-white'}`}
                        >
                            <Briefcase className="w-4 h-4" />
                            Banco (Baú)
                        </button>
                    </div>

                    <div className="relative min-h-[400px]">
                        {isLoading ? (
                            <div className="absolute inset-0 flex flex-col items-center justify-center gap-4">
                                <Loader2 className="w-10 h-10 text-brand-red animate-spin" />
                                <p className="text-[10px] font-black text-white/20 uppercase tracking-widest">Lendo dados binários...</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-6 sm:grid-cols-8 md:grid-cols-10 gap-3 md:gap-4 justify-items-center">
                                {renderGrid()}
                            </div>
                        )}

                        {/* Tooltip */}
                        <AnimatePresence>
                            {hoveredItem && (
                                <motion.div
                                    initial={{ opacity: 0, x: 10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: 10 }}
                                    className="absolute top-0 right-0 w-64 glass-card p-6 border-brand-red/30 shadow-2xl z-50 pointer-events-none"
                                >
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className="p-2 bg-brand-red/10 rounded-lg">
                                            <Info className="w-4 h-4 text-brand-red" />
                                        </div>
                                        <h4 className="font-bold text-white text-sm uppercase leading-tight">{hoveredItem.name}</h4>
                                    </div>
                                    <div className="space-y-2">
                                        <p className="text-[9px] font-black text-white/20 uppercase tracking-widest">Quantidade: <span className="text-white/60">{hoveredItem.count}</span></p>
                                        <p className="text-[9px] font-black text-white/20 uppercase tracking-widest">Item ID: <span className="text-white/60">{hoveredItem.item_id}</span></p>
                                    </div>
                                    <div className="mt-4 pt-4 border-t border-white/5">
                                        <p className="text-[10px] text-white/40 italic font-medium leading-relaxed">Este item está vinculado ao personagem e não pode ser negociado via painel.</p>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>

                <div className="bg-white/[0.02] border-t border-white/5 p-6 flex items-center justify-between text-[10px] font-black uppercase tracking-widest text-white/20">
                    <div className="flex items-center gap-2">
                        <MapPin className="w-3 h-3" /> Visualização Remota Ativa
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                            Dados Sincronizados
                        </div>
                    </div>
                </div>
            </motion.div>
        </motion.div>
    );
};

export default InventoryBankViewer;
