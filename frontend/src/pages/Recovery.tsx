import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, ArrowRight, RefreshCw, CheckCircle2, ChevronLeft } from 'lucide-react';
import axios from 'axios';
import { motion } from 'framer-motion';

const Recovery = () => {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');
        setMessage('');
        try {
            const response = await axios.post('http://localhost:3000/api/auth/recovery/request', { email });
            setMessage(response.data.message);
        } catch (err: any) {
            setError(err.response?.data?.message || 'Erro ao processar solicitação');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center p-4 relative overflow-hidden font-inter">
            <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-brand-red/10 rounded-full blur-[120px]"></div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-md relative z-10"
            >
                <Link to="/login" className="inline-flex items-center gap-2 text-gray-400 hover:text-white mb-6 transition-colors group">
                    <ChevronLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                    Voltar para o Login
                </Link>

                <div className="glass-card p-8 rounded-3xl border border-white/10 shadow-2xl backdrop-blur-xl">
                    <div className="text-center mb-8">
                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-brand-red/20 border border-brand-red/30 mb-4 shadow-lg shadow-brand-red/10">
                            <RefreshCw className="w-8 h-8 text-brand-red" />
                        </div>
                        <h1 className="text-3xl font-bold text-white tracking-tight">Recuperar Conta</h1>
                        <p className="text-gray-400 mt-2">Enviaremos as instruções para o seu e-mail</p>
                    </div>

                    {message ? (
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className="text-center py-6"
                        >
                            <div className="bg-green-500/10 border border-green-500/20 text-green-400 p-4 rounded-2xl flex flex-col items-center gap-3">
                                <CheckCircle2 className="w-10 h-10" />
                                <p className="font-medium">{message}</p>
                            </div>
                            <Link to="/login" className="inline-block mt-8 text-brand-red hover:underline font-semibold">
                                Retornar ao Login
                            </Link>
                        </motion.div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {error && (
                                <div className="bg-red-500/10 border border-red-500/20 text-red-500 p-4 rounded-xl text-sm flex items-center gap-3">
                                    {error}
                                </div>
                            )}

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-300 ml-1">Seu E-mail</label>
                                <div className="relative group">
                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 group-focus-within:text-brand-red transition-colors" />
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="w-full bg-white/5 border border-white/10 rounded-xl py-3.5 pl-12 pr-4 text-white focus:outline-none focus:ring-2 focus:ring-brand-red/50 transition-all placeholder:text-gray-600"
                                        placeholder="seu@email.com"
                                        required
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full bg-brand-red hover:bg-red-700 disabled:opacity-50 text-white font-bold py-4 rounded-xl transition-all shadow-lg shadow-brand-red/20 active:scale-[0.98] flex items-center justify-center gap-2"
                            >
                                {isLoading ? (
                                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                ) : (
                                    <>
                                        Enviar Instruções
                                        <ArrowRight className="w-5 h-5" />
                                    </>
                                )}
                            </button>
                        </form>
                    )}
                </div>
            </motion.div>
        </div>
    );
};

export default Recovery;
