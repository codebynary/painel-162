import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Users, LogOut, Shield, ArrowLeft, ShoppingBag, Mail } from 'lucide-react';
import { motion } from 'framer-motion';

const AdminLayout = () => {
    const location = useLocation();
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/login');
    };

    const isActive = (path: string) => location.pathname === path;

    return (
        <div className="flex h-screen bg-[#050505] text-white font-inter overflow-hidden">
            {/* Sidebar Decor */}
            <div className="fixed left-0 top-0 w-64 h-full bg-gradient-to-r from-brand-red/5 to-transparent pointer-events-none"></div>

            {/* Sidebar */}
            <aside className="w-64 bg-black/40 backdrop-blur-xl border-r border-white/5 flex flex-col relative z-20">
                <div className="p-8 flex items-center space-x-4 border-b border-white/5">
                    <div className="w-12 h-12 bg-brand-red rounded-2xl flex items-center justify-center shadow-[0_0_20px_rgba(204,0,0,0.4)]">
                        <Shield className="text-white w-6 h-6" />
                    </div>
                    <div>
                        <h1 className="font-black text-lg tracking-tighter leading-none">ADMIN</h1>
                        <p className="text-[10px] text-white/30 uppercase tracking-[0.2em] mt-1 font-bold">Protocol 162</p>
                    </div>
                </div>

                <nav className="flex-1 p-6 space-y-2">
                    <Link to="/admin/dashboard">
                        <motion.div
                            whileHover={{ x: 5 }}
                            className={`flex items-center space-x-3 px-6 py-4 rounded-2xl transition-all ${isActive('/admin/dashboard') ? 'bg-brand-red text-white shadow-[0_0_20px_rgba(204,0,0,0.2)]' : 'text-white/30 hover:text-white hover:bg-white/5 border border-transparent hover:border-white/10'}`}
                        >
                            <LayoutDashboard className="w-5 h-5" />
                            <span className="text-xs font-black tracking-widest uppercase">Overview</span>
                        </motion.div>
                    </Link>
                    <Link to="/admin/players">
                        <motion.div
                            whileHover={{ x: 5 }}
                            className={`flex items-center space-x-3 px-6 py-4 rounded-2xl transition-all ${isActive('/admin/players') ? 'bg-brand-red text-white shadow-[0_0_20px_rgba(204,0,0,0.2)]' : 'text-white/30 hover:text-white hover:bg-white/5 border border-transparent hover:border-white/10'}`}
                        >
                            <Users className="w-5 h-5" />
                            <span className="text-xs font-black tracking-widest uppercase">Jogadores</span>
                        </motion.div>
                    </Link>
                    <Link to="/admin/store">
                        <motion.div
                            whileHover={{ x: 5 }}
                            className={`flex items-center space-x-3 px-6 py-4 rounded-2xl transition-all ${isActive('/admin/store') ? 'bg-brand-red text-white shadow-[0_0_20px_rgba(204,0,0,0.2)]' : 'text-white/30 hover:text-white hover:bg-white/5 border border-transparent hover:border-white/10'}`}
                        >
                            <ShoppingBag className="w-5 h-5" />
                            <span className="text-xs font-black tracking-widest uppercase">Loja</span>
                        </motion.div>
                    </Link>
                    <Link to="/admin/mail">
                        <motion.div
                            whileHover={{ x: 5 }}
                            className={`flex items-center space-x-3 px-6 py-4 rounded-2xl transition-all ${isActive('/admin/mail') ? 'bg-brand-red text-white shadow-[0_0_20px_rgba(204,0,0,0.2)]' : 'text-white/30 hover:text-white hover:bg-white/5 border border-transparent hover:border-white/10'}`}
                        >
                            <Mail className="w-5 h-5" />
                            <span className="text-xs font-black tracking-widest uppercase">Correio</span>
                        </motion.div>
                    </Link>
                </nav>

                <div className="p-6 space-y-4">
                    <button
                        onClick={() => navigate('/dashboard')}
                        className="flex items-center space-x-3 px-6 py-4 w-full text-white/30 hover:text-white hover:bg-white/5 rounded-2xl transition-all border border-transparent hover:border-white/10 group"
                    >
                        <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                        <span className="text-[10px] font-black tracking-widest uppercase">Painel Player</span>
                    </button>

                    <button
                        onClick={handleLogout}
                        className="flex items-center space-x-3 px-6 py-4 w-full text-white/30 hover:text-brand-red hover:bg-brand-red/5 rounded-2xl transition-all border border-transparent hover:border-brand-red/20 group"
                    >
                        <LogOut className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                        <span className="text-[10px] font-black tracking-widest uppercase">Sair</span>
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-auto relative z-10">
                <div className="p-10 max-w-7xl mx-auto">
                    <Outlet />
                </div>
            </main>
        </div>
    );
};

export default AdminLayout;
