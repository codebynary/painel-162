import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Shield, Zap, Sword, Crosshair, Skull, Heart, MapPin, Loader2, Lock as BankLock } from 'lucide-react';
import axios from 'axios';

interface Character {
    id: number;
    name: string;
    level: number;
    cls: number;
    reputation: number;
    gender: number;
    roleid: number;
}

const CLASS_MAP: Record<number, { name: string; icon: React.ReactNode; color: string }> = {
    0: { name: 'Guerreiro', icon: <Sword className="w-5 h-5" />, color: 'text-red-500' },
    1: { name: 'Mago', icon: <Zap className="w-5 h-5" />, color: 'text-blue-500' },
    2: { name: 'Espiritualista', icon: <Zap className="w-5 h-5" />, color: 'text-purple-500' },
    3: { name: 'Feiticeira', icon: <Skull className="w-5 h-5" />, color: 'text-green-500' },
    4: { name: 'Bárbaro', icon: <Shield className="w-5 h-5" />, color: 'text-orange-500' },
    5: { name: 'Mercenário', icon: <Sword className="w-5 h-5" />, color: 'text-red-400' },
    6: { name: 'Arqueiro', icon: <Crosshair className="w-5 h-5" />, color: 'text-emerald-500' },
    7: { name: 'Sacerdote', icon: <Heart className="w-5 h-5" />, color: 'text-cyan-500' },
};

const CharacterCard: React.FC<{ character: Character; index: number; onActionSuccess?: () => void }> = ({ character, index, onActionSuccess }) => {
    const [isTeleporting, setIsTeleporting] = useState(false);
    const [isResetting, setIsResetting] = useState(false);

    const displayClass = CLASS_MAP[character.cls] || { name: 'Desconhecido', icon: <Shield />, color: 'text-gray-500' };

    const handleTeleport = async () => {
        if (!window.confirm(`Deseja DESTRAVAR (Teleportar) ${character.name} para a Cidade Inicial?`)) return;

        setIsTeleporting(true);
        try {
            const token = localStorage.getItem('token');
            await axios.post(`http://localhost:3000/api/characters/${character.roleid}/teleport`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
            alert('Coordenadas resetadas! O personagem foi movido para a Cidade Inicial.');
            if (onActionSuccess) onActionSuccess();
        } catch (error: any) {
            alert(error.response?.data?.message || 'Erro ao teleportar personagem');
        } finally {
            setIsTeleporting(false);
        }
    };

    const handleResetBank = async () => {
        if (!window.confirm(`Tem certeza que deseja RESETAR a SENHA DO BANCO de ${character.name}?`)) return;

        setIsResetting(true);
        try {
            const token = localStorage.getItem('token');
            await axios.post(`http://localhost:3000/api/characters/${character.roleid}/reset-bank`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
            alert('Senha do banco resetada com sucesso!');
            if (onActionSuccess) onActionSuccess();
        } catch (error: any) {
            alert(error.response?.data?.message || 'Erro ao resetar senha do banco');
        } finally {
            setIsResetting(false);
        }
    };


    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.05 }}
            className="glass-card rounded-2xl p-6 border-white/5 hover:border-brand-red/30 transition-all group relative overflow-hidden"
        >
            <div className="absolute top-0 right-0 w-32 h-32 bg-brand-red/5 blur-[40px] rounded-full -mr-16 -mt-16 group-hover:bg-brand-red/10 transition-all"></div>

            <div className="flex items-start justify-between relative z-10">
                <div className="flex items-center space-x-4">
                    <div className={`w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center border border-white/10 group-hover:border-brand-red/30 transition-colors shadow-inner ${displayClass.color}`}>
                        {displayClass.icon}
                    </div>
                    <div>
                        <h3 className="font-bold text-white text-xl tracking-tight leading-none mb-1">{character.name}</h3>
                        <div className="flex items-center text-xs font-semibold text-white/40 space-x-2">
                            <span className="bg-white/5 px-2 py-0.5 rounded border border-white/5 text-white/60">LV. {character.level}</span>
                            <span className={displayClass.color}>{displayClass.name.toUpperCase()}</span>
                        </div>
                    </div>
                </div>

                <div className="text-right">
                    <p className="text-[10px] text-white/20 font-bold tracking-widest uppercase mb-1">Reputação</p>
                    <p className="text-brand-red font-mono font-bold text-sm tracking-tight">{character.reputation.toLocaleString()}</p>
                </div>
            </div>

            <div className="mt-8 flex items-center space-x-2 relative z-10">
                <button
                    onClick={handleTeleport}
                    disabled={isTeleporting || isResetting}
                    className="flex-1 bg-white/5 hover:bg-brand-red/20 border border-white/10 hover:border-brand-red/30 rounded-xl py-3 px-4 text-[10px] font-black text-white/40 hover:text-white transition-all flex items-center justify-center space-x-2 disabled:opacity-50 tracking-widest uppercase"
                    title="Destravar Personagem (Unstuck)"
                >
                    {isTeleporting ? (
                        <Loader2 className="w-4 h-4 animate-spin text-brand-red" />
                    ) : (
                        <>
                            <MapPin className="w-4 h-4" />
                            <span>DESTRAVAR</span>
                        </>
                    )}
                </button>
                <button
                    onClick={handleResetBank}
                    disabled={isTeleporting || isResetting}
                    className="bg-white/5 hover:bg-brand-red/20 border border-white/10 hover:border-brand-red/30 rounded-xl p-3 transition-all flex items-center justify-center min-w-[48px] disabled:opacity-50"
                    title="Resetar Senha do Banco"
                >
                    {isResetting ? (
                        <Loader2 className="w-4 h-4 animate-spin text-brand-red" />
                    ) : (
                        <BankLock className="w-4 h-4 text-white/40" />
                    )}
                </button>
            </div>
        </motion.div>
    );
};

export default CharacterCard;
