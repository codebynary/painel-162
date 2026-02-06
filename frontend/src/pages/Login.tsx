import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Lock, User, Youtube, Facebook, MessageSquare } from 'lucide-react';
import logo from '../assets/logo-velorian.png';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        try {
            // Should be in an environment variable, using localhost for dev
            const response = await axios.post('http://localhost:3000/api/auth/login', {
                username,
                password
            });

            localStorage.setItem('token', response.data.token);
            navigate('/dashboard');
        } catch (err: any) {
            setError(err.response?.data?.message || 'Falha ao realizar login');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-[#050505] relative overflow-hidden selection:bg-brand-red/30">
            {/* Grainy Overlay */}
            <div className="absolute inset-0 grainy-bg z-50"></div>

            {/* Background Decor */}
            <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,#300000_0%,#000000_100%)] opacity-50"></div>
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-brand-red/10 blur-[120px] rounded-full"></div>
            <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-brand-red/10 blur-[120px] rounded-full"></div>

            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="relative w-full max-w-md glass-card rounded-2xl p-8 border-white/5"
            >
                <div className="text-center mb-10">
                    <motion.div
                        initial={{ y: -20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="mb-8"
                    >
                        <img
                            src={logo}
                            alt="Velorian Logo"
                            className="w-32 h-32 mx-auto drop-shadow-[0_0_20px_rgba(204,0,0,0.5)] mix-blend-screen brightness-110 contrast-125"
                        />
                    </motion.div>
                    <h2 className="text-4xl font-black text-white tracking-tighter mb-2 text-glow-red uppercase">
                        VELORIAN <span className="text-brand-red font-outline">PW</span>
                    </h2>
                    <p className="text-[10px] text-white/30 font-bold tracking-[0.2em] uppercase">SISTEMA DE GESTÃO INTEGRADA</p>

                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-4">
                        <div className="relative group">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-colors group-focus-within:text-brand-red">
                                <User className="h-5 w-5 text-white/30" />
                            </div>
                            <input
                                type="text"
                                placeholder="Nome de Usuário"
                                className="w-full bg-white/5 border border-white/10 rounded-xl py-4 pl-12 pr-4 text-white placeholder:text-white/20 focus:outline-none focus:ring-2 focus:ring-brand-red/50 focus:border-brand-red transition-all"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                required
                            />
                        </div>

                        <div className="relative group">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-colors group-focus-within:text-brand-red">
                                <Lock className="h-5 w-5 text-white/30" />
                            </div>
                            <input
                                type="password"
                                placeholder="Sua Senha"
                                className="w-full bg-white/5 border border-white/10 rounded-xl py-4 pl-12 pr-4 text-white placeholder:text-white/20 focus:outline-none focus:ring-2 focus:ring-brand-red/50 focus:border-brand-red transition-all"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>
                    </div>

                    {error && (
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-brand-red/10 border border-brand-red/30 rounded-xl p-4"
                        >
                            <p className="text-brand-red text-sm font-semibold text-center">{error}</p>
                        </motion.div>
                    )}

                    <motion.button
                        whileHover={{ scale: 1.02, backgroundColor: '#e60000' }}
                        whileTap={{ scale: 0.98 }}
                        disabled={isLoading}
                        type="submit"
                        className="w-full bg-brand-red text-white font-black py-5 rounded-2xl shadow-[0_0_30px_rgba(204,0,0,0.2)] hover:shadow-[0_0_40px_rgba(204,0,0,0.3)] transition-all flex items-center justify-center disabled:opacity-50 text-xs tracking-[0.2em] uppercase"
                    >
                        {isLoading ? (
                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        ) : (
                            'ENTRAR NO PAINEL'
                        )}
                    </motion.button>

                    <div className="flex items-center justify-between mt-6 px-2">
                        <a href="#" className="text-xs font-semibold text-white/30 hover:text-brand-red transition-colors capitalize">
                            Criar Conta
                        </a>
                        <a href="#" className="text-xs font-semibold text-white/30 hover:text-brand-red transition-colors capitalize">
                            Recuperar Senha
                        </a>
                    </div>
                </form>

                <div className="mt-8 flex justify-center space-x-6">
                    <motion.a
                        whileHover={{ scale: 1.1, y: -2 }}
                        href="#"
                        className="p-3 bg-blue-600/10 border border-blue-600/20 rounded-xl text-blue-500 hover:bg-blue-600 hover:text-white transition-all shadow-[0_0_15px_rgba(37,99,235,0.1)]"
                        title="Facebook"
                    >
                        <Facebook className="w-5 h-5" />
                    </motion.a>
                    <motion.a
                        whileHover={{ scale: 1.1, y: -2 }}
                        href="#"
                        className="p-3 bg-indigo-600/10 border border-indigo-600/20 rounded-xl text-indigo-500 hover:bg-indigo-600 hover:text-white transition-all shadow-[0_0_15px_rgba(79,70,229,0.1)]"
                        title="Discord"
                    >
                        <MessageSquare className="w-5 h-5" />
                    </motion.a>
                    <motion.a
                        whileHover={{ scale: 1.1, y: -2 }}
                        href="#"
                        className="p-3 bg-red-600/10 border border-red-600/20 rounded-xl text-red-500 hover:bg-red-600 hover:text-white transition-all shadow-[0_0_15px_rgba(220,38,38,0.1)]"
                        title="YouTube"
                    >
                        <Youtube className="w-5 h-5" />
                    </motion.a>
                </div>

                <div className="mt-10 pt-6 border-t border-white/5 text-center">
                    <p className="text-[10px] text-white/20 font-bold tracking-widest uppercase">
                        VELORIAN NEXT-GEN SYSTEM
                    </p>
                </div>
            </motion.div>
        </div>
    );
};

export default Login;
