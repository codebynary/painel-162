import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Package, Briefcase, X, Loader2, Info, MapPin } from 'lucide-react';
import axios from 'axios';

interface Item {
    slot: number;
    item_id: number;
    count: number;
    name: string;
    icon?: string;
    name_color?: string;
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
    const totalSlots = activeTab === 'inventory' ? 64 : 80;

    // Close on escape key
    useEffect(() => {
        const handleEsc = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };
        window.addEventListener('keydown', handleEsc);
        return () => window.removeEventListener('keydown', handleEsc);
    }, [onClose]);

    const renderGrid = () => {
        const grid = [];
        for (let i = 0; i < totalSlots; i++) {
            const item = currentItems?.find(it => it.slot === i);
            const isHovered = hoveredItem?.slot === i && hoveredItem?.item_id === item?.item_id;

            grid.push(
                <div
                    key={i}
                    className={`relative w-10 h-10 md:w-12 md:h-12 bg-black/40 border ${isHovered ? 'border-brand-red/80' : 'border-white/5'} rounded overflow-hidden group hover:border-brand-red/60 transition-all cursor-pointer shadow-[inset_0_0_10px_rgba(0,0,0,0.8)]`}
                    onMouseEnter={() => item && setHoveredItem(item)}
                    onMouseLeave={() => setHoveredItem(null)}
                >
                    {item ? (
                        <>
                            <div className="absolute inset-0 bg-brand-red/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                            <img
                                src={`/assets/items/${item.item_id}.png`}
                                alt={item.name}
                                className="w-8 h-8 md:w-10 md:h-10 relative z-10 m-auto mt-1"
                                onError={(e: React.SyntheticEvent<HTMLImageElement>) => {
                                    const target = e.currentTarget as HTMLImageElement;
                                    target.src = `https://api.velorianpw.com/icons/${item.item_id}.png`;
                                    target.onerror = () => {
                                        target.src = 'https://via.placeholder.com/32?text=?';
                                    };
                                }}
                            />
                            {item.count > 1 && (
                                <span className="absolute bottom-0.5 right-0.5 text-[8px] font-bold text-white bg-black/80 px-1 rounded-sm z-20 pointer-events-none border border-white/10">
                                    {item.count}
                                </span>
                            )}
                        </>
                    ) : (
                        <div className="absolute inset-0 flex items-center justify-center opacity-[0.03]">
                            <div className="w-full h-full border border-white/10 transform rotate-45 scale-50"></div>
                        </div>
                    )}
                </div>
            );
        }
        return grid;
    };

    const modalContent = (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[9999] flex items-center justify-center p-4 md:p-8 bg-black/90 backdrop-blur-md font-inter"
            onClick={onClose}
        >
            <motion.div
                initial={{ scale: 0.95, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.95, opacity: 0, y: 20 }}
                transition={{ type: "spring", bounce: 0, duration: 0.3 }}
                className="w-full max-w-6xl h-[85vh] bg-[#050505] border border-white/10 rounded-xl overflow-hidden relative flex flex-col shadow-2xl shadow-black/80"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="h-16 border-b border-white/5 bg-black/40 flex items-center justify-between px-6 shrink-0 relative z-20">
                    <div className="flex items-center gap-4">
                        <div className="p-2 bg-brand-red/10 border border-brand-red/20 rounded-lg">
                            <Package className="w-5 h-5 text-brand-red" />
                        </div>
                        <div>
                            <h2 className="text-lg font-bold text-white uppercase tracking-tight">{charName}</h2>
                            <p className="text-[10px] text-white/30 uppercase tracking-[0.2em] font-bold">Gerenciador de Itens</p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-white/5 rounded-lg transition-colors group"
                    >
                        <X className="w-5 h-5 text-white/40 group-hover:text-white transition-colors" />
                    </button>
                </div>

                {/* Main Content Area - 3 Column Layout */}
                <div className="flex-1 flex overflow-hidden">

                    {/* Col 1: Navigation Sidebar */}
                    <div className="w-64 bg-black/20 border-r border-white/5 p-4 flex flex-col gap-2 shrink-0">
                        <p className="px-2 mb-2 text-[9px] font-black text-white/20 uppercase tracking-widest">Armazenamento</p>

                        <button
                            onClick={() => setActiveTab('inventory')}
                            className={`flex items-center gap-3 p-3 rounded-lg border transition-all text-sm font-medium ${activeTab === 'inventory'
                                    ? 'bg-brand-red/10 border-brand-red/30 text-white'
                                    : 'bg-transparent border-transparent text-white/40 hover:bg-white/5 hover:text-white'
                                }`}
                        >
                            <Package className={`w-4 h-4 ${activeTab === 'inventory' ? 'text-brand-red' : ''}`} />
                            <span>Inventário</span>
                            <span className="ml-auto text-xs opacity-50 font-mono">64</span>
                        </button>

                        <button
                            onClick={() => setActiveTab('bank')}
                            className={`flex items-center gap-3 p-3 rounded-lg border transition-all text-sm font-medium ${activeTab === 'bank'
                                    ? 'bg-brand-red/10 border-brand-red/30 text-white'
                                    : 'bg-transparent border-transparent text-white/40 hover:bg-white/5 hover:text-white'
                                }`}
                        >
                            <Briefcase className={`w-4 h-4 ${activeTab === 'bank' ? 'text-brand-red' : ''}`} />
                            <span>Banco</span>
                            <span className="ml-auto text-xs opacity-50 font-mono">80</span>
                        </button>

                        <div className="mt-auto p-4 rounded-xl bg-gradient-to-b from-transparent to-brand-red/5 border border-white/5">
                            <div className="flex items-center gap-2 mb-2">
                                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_#10b981]"></span>
                                <span className="text-[10px] font-bold text-white/60 uppercase tracking-wider">Sincronizado</span>
                            </div>
                            <p className="text-[10px] text-white/30 leading-snug">
                                Dados recuperados do servidor PW em tempo real via GamedBD.
                            </p>
                        </div>
                    </div>

                    {/* Col 2: Item Grid (Scrollable) */}
                    <div className="flex-1 bg-[#0a0a0a] relative flex flex-col">
                        <div className="flex-1 overflow-y-auto custom-scrollbar p-6">
                            {isLoading ? (
                                <div className="h-full flex flex-col items-center justify-center gap-4 opacity-50">
                                    <Loader2 className="w-8 h-8 text-brand-red animate-spin" />
                                    <p className="text-xs font-bold text-white/30 uppercase tracking-widest">Carregando Itens...</p>
                                </div>
                            ) : (
                                <div className="grid grid-cols-6 sm:grid-cols-8 gap-2 content-start justify-items-center">
                                    {renderGrid()}
                                </div>
                            )}
                        </div>
                        {/* Grid Footer Information */}
                        <div className="h-10 border-t border-white/5 bg-black/40 flex items-center justify-between px-6 text-[10px] font-mono text-white/20">
                            <span>SLOTS: {activeTab === 'inventory' ? '64' : '80'} / {totalSlots}</span>
                            <span>CAPACITY: 100%</span>
                        </div>
                    </div>

                    {/* Col 3: Details Panel */}
                    <div className="w-80 bg-black/20 border-l border-white/5 p-6 flex flex-col shrink-0 relative bg-[url('/assets/grid-pattern.png')] bg-repeat opacity-95">
                        <div className="absolute inset-0 bg-gradient-to-b from-black/0 via-black/0 to-black/80 pointer-events-none"></div>

                        {hoveredItem ? (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="space-y-6 relative z-10"
                            >
                                <div className="aspect-square w-full rounded-xl bg-black/40 border border-white/10 flex items-center justify-center relative overflow-hidden group shadow-inner">
                                    <div className="absolute inset-0 bg-brand-red/5 blur-2xl group-hover:bg-brand-red/10 transition-all"></div>
                                    <img
                                        src={`/assets/items/${hoveredItem.item_id}.png`}
                                        alt={hoveredItem.name}
                                        className="w-24 h-24 object-contain drop-shadow-2xl relative z-10"
                                        onError={(e: React.SyntheticEvent<HTMLImageElement>) => {
                                            (e.currentTarget as HTMLImageElement).src = `https://api.velorianpw.com/icons/${hoveredItem.item_id}.png`;
                                        }}
                                    />
                                </div>

                                <div>
                                    <h3
                                        className="text-xl font-bold uppercase leading-tight tracking-wide drop-shadow-md border-b border-white/10 pb-4 mb-4"
                                        style={{ color: hoveredItem.name_color ? `#${hoveredItem.name_color}` : '#FFFFFF' }}
                                    >
                                        {hoveredItem.name}
                                    </h3>

                                    <div className="space-y-3">
                                        <div className="flex justify-between items-center bg-white/5 p-3 rounded-lg border border-white/5">
                                            <span className="text-xs font-bold text-white/40 uppercase">Quantidade</span>
                                            <span className="text-sm font-mono font-bold text-white">{hoveredItem.count}</span>
                                        </div>
                                        <div className="flex justify-between items-center bg-white/5 p-3 rounded-lg border border-white/5">
                                            <span className="text-xs font-bold text-white/40 uppercase">ID do Item</span>
                                            <span className="text-sm font-mono text-brand-red">{hoveredItem.item_id}</span>
                                        </div>
                                        <div className="flex justify-between items-center bg-white/5 p-3 rounded-lg border border-white/5">
                                            <span className="text-xs font-bold text-white/40 uppercase">Slot</span>
                                            <span className="text-sm font-mono text-white/60">{hoveredItem.slot}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="p-4 bg-brand-red/5 border border-brand-red/10 rounded-xl mt-4">
                                    <p className="text-[10px] text-brand-red/80 font-medium italic text-center leading-relaxed">
                                        "Este item é propriedade do personagem e está protegido pelo sistema do servidor."
                                    </p>
                                </div>
                            </motion.div>
                        ) : (
                            <div className="h-full flex flex-col items-center justify-center text-center opacity-30 space-y-4">
                                <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center border border-white/5">
                                    <Info className="w-8 h-8 text-white" />
                                </div>
                                <p className="text-xs font-black uppercase tracking-widest text-white/50 max-w-[150px]">
                                    Passe o mouse sobre um item para ver detalhes
                                </p>
                            </div>
                        )}
                    </div>
                </div>

                <div className="bg-white/[0.02] border-t border-white/5 p-4 flex items-center justify-between text-[10px] font-black uppercase tracking-widest text-white/20">
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

    // Use React Portal to render at document root level, avoiding parent overflow/transform issues
    return createPortal(modalContent, document.body);
};

export default InventoryBankViewer;
