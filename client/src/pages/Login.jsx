import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import GlassCard from '../components/GlassCard';
import { useAuth } from '../context/AuthContext';
import { LogIn } from 'lucide-react';
import { toast } from 'react-toastify';

const Login = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const { login } = useAuth();
    const navigate = useNavigate();

    const { email, password } = formData;

    const onChange = (e) => {
        setFormData((prev) => ({
            ...prev,
            [e.target.name]: e.target.value,
        }));
    };

    const handleLogin = async (e) => {
        e.preventDefault();

        try {
            const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001';
            const res = await axios.post(`${API_URL}/api/auth/login`, {
                email,
                password
            });

            const userData = res.data;
            login(userData);
            toast.success(`Welcome back, ${userData.username}!`);
            navigate('/dashboard');

        } catch (err) {
            console.error(err);
            toast.error(err.response?.data?.message || 'Login failed');
        }
    };

    return (
        <div className="flex items-center justify-center h-[80vh]">
            <GlassCard className="max-w-md w-full">
                <div className="text-center mb-6">
                    <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-neon-cyan to-neon-purple">Welcome Back</h2>
                    <p className="text-gray-400">Sign in to SafeStream</p>
                </div>

                <form onSubmit={handleLogin} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Email Address</label>
                        <input
                            type="email"
                            name="email"
                            value={email}
                            onChange={onChange}
                            required
                            className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 focus:outline-none focus:border-neon-cyan text-white"
                            placeholder="name@example.com"
                        />
                    </div>
                    
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Password</label>
                        <input
                            type="password"
                            name="password"
                            value={password}
                            onChange={onChange}
                            required
                            className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 focus:outline-none focus:border-neon-cyan text-white"
                            placeholder="********"
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-gradient-to-r from-neon-cyan to-neon-purple text-white font-bold py-3 rounded-xl shadow-lg hover:scale-[1.02] transition-transform flex items-center justify-center gap-2"
                    >
                        <LogIn size={20} />
                        Enter System
                    </button>
                </form>

                <div className="mt-6 text-center text-sm text-gray-400">
                    Don't have an account?{' '}
                    <Link to="/register" className="text-neon-cyan hover:underline">
                        Register
                    </Link>
                </div>
            </GlassCard>
        </div>
    );
};

export default Login;
