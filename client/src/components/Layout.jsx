import React from 'react';
import { useLocation, Link, useNavigate, Outlet } from 'react-router-dom';
import { LayoutDashboard, Upload, LogOut, Video as VideoIcon } from 'lucide-react';
import { useAuth } from '../context/AuthContext';


const Layout = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { user, logout } = useAuth();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    // Define nav items based on role
    const navItems = [
        { path: '/dashboard', icon: LayoutDashboard, label: 'Dashboard', roles: ['Viewer', 'Editor', 'Admin'] },
        { path: '/upload', icon: Upload, label: 'Upload', roles: ['Editor', 'Admin'] },
    ];

    // Filter items
    const userRole = user ? user.role : 'Guest';
    const filteredNav = navItems.filter(item => item.roles.includes(userRole));

    return (
        <div className="min-h-screen bg-[#050511] text-white font-sans selection:bg-neon-cyan selection:text-black overflow-hidden relative">


            {/* Background Gradients */}
            <div className="fixed top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
                <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-neon-purple/20 blur-[120px] rounded-full animate-pulse-slow"></div>
                <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-neon-cyan/20 blur-[120px] rounded-full animate-pulse-slow animation-delay-2000"></div>
            </div>

            <div className="relative z-10 flex h-screen">
                {/* Sidebar */}
                <aside className="w-64 glass-effect border-r border-white/10 flex flex-col justify-between p-6">
                    <div>
                        <div className="flex items-center gap-3 mb-10">
                            <div className="w-10 h-10 bg-gradient-to-tr from-neon-cyan to-neon-purple rounded-xl flex items-center justify-center shadow-lg shadow-neon-cyan/20">
                                <VideoIcon className="text-white" size={24} />
                            </div>
                            <h1 className="text-2xl font-bold tracking-wider">VIDOVA</h1>
                        </div>

                        <nav className="space-y-4">
                            {filteredNav.map((item) => (
                                <Link
                                    key={item.path}
                                    to={item.path}
                                    className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 group ${location.pathname === item.path
                                            ? 'bg-white/10 text-neon-cyan shadow-inner border border-white/5'
                                            : 'text-gray-400 hover:text-white hover:bg-white/5'
                                        }`}
                                >
                                    <item.icon size={20} className={location.pathname === item.path ? 'text-neon-cyan drop-shadow-[0_0_8px_rgba(0,243,255,0.5)]' : 'group-hover:text-white transition-colors'} />
                                    <span className="font-medium">{item.label}</span>
                                </Link>
                            ))}
                        </nav>
                    </div>

                    <div>
                        {user && (
                            <div className="mb-4 p-3 rounded-lg bg-white/5 border border-white/5">
                                <p className="text-xs text-gray-400">Current User</p>
                                <p className="font-bold text-neon-cyan">{user.username}</p>
                            </div>
                        )}
                        <button
                            onClick={handleLogout}
                            className="flex items-center gap-3 px-4 py-3 w-full text-left text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-xl transition-all duration-300"
                        >
                            <LogOut size={20} />
                            <span className="font-medium">Logout</span>
                        </button>

                        <div className="mt-8 pt-6 border-t border-white/10">
                            <div className="flex items-center gap-2 text-xs text-gray-500">
                                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                                System Status: <span className="text-gray-300">Online</span>
                            </div>
                        </div>
                    </div>
                </aside>

                {/* Main Content */}
                <main className="flex-1 overflow-y-auto relative scrollbar-hide p-8">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default Layout;
