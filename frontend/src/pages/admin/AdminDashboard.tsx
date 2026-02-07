import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Shield, Users, Trophy, Box, Activity, Power, RefreshCcw, Loader2, Map, ArrowLeft } from 'lucide-react';
import logo from '../../assets/logo-velorian.png';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

interface ProcessStatus {
    name: string;
    running: boolean;
}

const AdminDashboard = () => {
    const [processStatus, setProcessStatus] = useState<ProcessStatus[]>([]);
    const [isLoadingStatus, setIsLoadingStatus] = useState(true);
    const [isActionInProgress, setIsActionInProgress] = useState(false);
    const [activeMaps, setActiveMaps] = useState<number[]>([]);
    const navigate = useNavigate();

    const fetchStatus = async () => {
        setIsLoadingStatus(true);
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get('http://localhost:3000/api/admin/server/status', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setProcessStatus(response.data);

            const mapsResponse = await axios.get('http://localhost:3000/api/admin/server/maps', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setActiveMaps(mapsResponse.data);
        } catch (error) {
            console.error('Error fetching server info', error);
        } finally {
            setIsLoadingStatus(false);
        }
    };

    const handleServerAction = async (action: 'start' | 'stop') => {
        if (!window.confirm(`Tem certeza que deseja ${action === 'start' ? 'LIGAR' : 'DESLIGAR'} o servidor?`)) return;

        setIsActionInProgress(true);
        try {
            const token = localStorage.getItem('token');
            await axios.post(`http://localhost:3000/api/admin/server/${action}`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
            alert(`Sinal de ${action === 'start' ? 'inicialização' : 'desligamento'} enviado.`);
            setTimeout(fetchStatus, 3000);
        } catch (error: any) {
            alert(error.response?.data?.message || `Erro ao ${action} servidor`);
        } finally {
            setIsActionInProgress(false);
        }
    };

    useEffect(() => {
        fetchStatus();
    }, []);

    const stats = [
        { label: 'Jogadores Online', value: '142', icon: <Users />, color: 'text-blue-500' },
        { label: 'Total de Contas', value: '1.234', icon: <Shield />, color: 'text-emerald-500' },
        { label: 'Vendas (Hoje)', value: 'R$ 450,00', icon: <Trophy />, color: 'text-yellow-500' },
        { label: 'SLA Servidor', value: '99.9%', icon: <Activity />, color: 'text-brand-red' },
    ];

    return (
        <div className="space-y-10 font-inter selection:bg-brand-red/30 relative">
            {/* Grainy Overlay */}
            <div className="absolute inset-0 grainy-bg z-50"></div>

            <header className="flex justify-between items-end border-b border-white/5 pb-8">
                <div className="flex items-center gap-8">
                    <div className="flex items-center gap-4">
                        <img
                            src={logo}
                            alt="Velorian Logo"
                            className="w-12 h-12 drop-shadow-[0_0_10px_rgba(204,0,0,0.4)] mix-blend-screen"
                        />
                        <div>
                            <h1 className="text-3xl font-black text-white tracking-tighter uppercase leading-none">VELORIAN <span className="text-brand-red font-outline">ADMIN</span></h1>
                            <p className="text-[10px] text-white/30 font-bold tracking-[0.2em] uppercase mt-2">Painel de Controle de Infraestrutura</p>
                        </div>

                    </div>
                    <button
                        onClick={() => navigate('/dashboard')}
                        className="flex items-center gap-2 text-[10px] font-black text-white/20 hover:text-brand-red transition-all uppercase tracking-widest bg-white/5 px-4 py-2 rounded-lg border border-white/5"
                    >
                        <ArrowLeft className="w-3 h-3" />
                        Voltar ao Painel
                    </button>
                </div>
                <button
                    onClick={fetchStatus}
                    className="p-3 rounded-xl bg-white/5 border border-white/10 hover:border-white/20 transition-all text-white/40 hover:text-white"
                >
                    <RefreshCcw className={`w-5 h-5 ${isLoadingStatus ? 'animate-spin' : ''}`} />
                </button>
            </header>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="glass-card rounded-2xl p-6 border-white/5 relative overflow-hidden group"
                    >
                        <div className="flex items-center space-x-4 relative z-10">
                            <div className={`p-4 rounded-xl bg-white/5 border border-white/10 group-hover:border-white/20 transition-all ${stat.color}`}>
                                {stat.icon}
                            </div>
                            <div>
                                <p className="text-xs font-bold text-white/30 tracking-wider uppercase">{stat.label}</p>
                                <p className="text-2xl font-black text-white">{stat.value}</p>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                {/* Server Status Center */}
                <div className="lg:col-span-8 glass-card rounded-3xl p-10 border-brand-red/10 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-brand-red/5 blur-[100px] rounded-full -mr-32 -mt-32"></div>

                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-8 relative z-10">
                        <div>
                            <h2 className="text-2xl font-black text-white mb-2 flex items-center">
                                <Activity className="w-6 h-6 mr-3 text-brand-red animate-pulse" />
                                STATUS DO SERVIDOR
                            </h2>
                            <p className="text-white/30 text-sm font-medium">Estado dos processos vitais do Perfect World.</p>
                        </div>
                        <div className="flex items-center space-x-4">
                            <button
                                onClick={() => handleServerAction('start')}
                                disabled={isActionInProgress}
                                className="bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 text-white px-8 py-4 rounded-2xl text-xs font-black tracking-widest flex items-center shadow-[0_0_20px_rgba(16,185,129,0.2)]"
                            >
                                {isActionInProgress ? <Loader2 className="w-4 h-4 animate-spin mr-3" /> : <Power className="w-4 h-4 mr-3" />}
                                START
                            </button>
                            <button
                                onClick={() => handleServerAction('stop')}
                                disabled={isActionInProgress}
                                className="bg-white/5 hover:bg-red-500/20 border border-white/10 hover:border-red-500/30 text-white/60 hover:text-red-500 px-8 py-4 rounded-2xl text-xs font-black tracking-widest transition-all"
                            >
                                SHUTDOWN
                            </button>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6 relative z-10">
                        {isLoadingStatus ? (
                            Array(10).fill(0).map((_, i) => (
                                <div key={i} className="h-28 bg-white/5 animate-pulse rounded-2xl"></div>
                            ))
                        ) : processStatus.map((proc, i) => (
                            <div key={i} className="bg-white/5 border border-white/10 rounded-2xl p-6 flex flex-col items-center justify-center text-center group hover:border-brand-red/30 transition-all relative overflow-hidden">
                                <div className={`w-3 h-3 rounded-full mb-4 shadow-[0_0_15px_currentColor] ${proc.running ? 'text-emerald-500 bg-emerald-500' : 'text-red-500 bg-red-500'}`}></div>
                                <span className="text-[9px] font-black text-white/20 uppercase tracking-[0.3em] mb-2">{proc.name}</span>
                                <span className={`text-[10px] font-black tracking-widest ${proc.running ? 'text-white' : 'text-white/20'}`}>
                                    {proc.running ? 'ONLINE' : 'OFFLINE'}
                                </span>
                            </div>

                        ))}
                    </div>
                </div>

                {/* Map Control Sidebar */}
                <div className="lg:col-span-4 space-y-8 h-full">
                    <div className="glass-card rounded-3xl p-8 border-white/5 relative overflow-hidden h-full flex flex-col">
                        <div className="flex justify-between items-center mb-10">
                            <div>
                                <h3 className="text-lg font-black text-white flex items-center tracking-tighter">
                                    <Map className="w-5 h-5 mr-3 text-brand-red" />
                                    MAPAS ATIVOS
                                </h3>
                                <p className="text-[9px] text-white/20 font-bold uppercase tracking-widest mt-1">Gerenciamento de Instâncias</p>
                            </div>
                            <span className="text-[10px] font-black bg-brand-red/10 text-brand-red px-3 py-1.5 rounded-full border border-brand-red/20 shadow-[0_0_15px_rgba(204,0,0,0.1)]">
                                {activeMaps.length} RODANDO
                            </span>
                        </div>

                        <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
                            {[
                                { id: 1, name: 'Mundo (M01)' },
                                { id: 31, name: 'Vale Primordial' },
                                { id: 101, name: 'DG 19 (Humanos)' },
                                { id: 102, name: 'DG 19 (Feras)' },
                                { id: 108, name: 'Cidade das Feras' },
                                { id: 111, name: 'Palácio dos Dragões' },
                                { id: 120, name: 'Enseada do Porto' },
                                { id: 131, name: 'Ilha da Serpente' },
                                { id: 142, name: 'Arena de Batalha' },
                                { id: 161, name: 'Vale do Luar' },
                                { id: 201, name: 'Crepúsculo (1-1)' }
                            ].map((map) => (
                                <div key={map.id} className="flex items-center justify-between p-5 bg-white/5 rounded-2xl border border-white/5 group hover:bg-white/[0.08] hover:border-brand-red/30 transition-all duration-300">
                                    <div className="flex items-center space-x-4">
                                        <div className={`w-2 h-2 rounded-full ${activeMaps.includes(map.id) ? 'bg-emerald-500 shadow-[0_0_10px_#10b981]' : 'bg-white/10'}`}></div>
                                        <div>
                                            <p className="text-sm font-black text-white group-hover:text-brand-red transition-colors">{map.name}</p>
                                            <p className="text-[9px] text-white/30 font-black tracking-widest uppercase">Instância {map.id}</p>
                                        </div>
                                    </div>
                                    <button className="text-[9px] font-black text-white/20 hover:text-brand-red transition-all px-4 py-2 bg-white/5 rounded-xl border border-white/5 uppercase tracking-widest group-hover:border-brand-red/20">
                                        Ação
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
