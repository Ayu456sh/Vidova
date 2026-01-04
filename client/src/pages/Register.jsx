import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import GlassCard from '../components/GlassCard';
import { useAuth } from '../context/AuthContext';
import { UserPlus } from 'lucide-react';
import { toast } from 'react-toastify';

const Register = () => {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        organizationId: '',
        role: 'Editor'
    });
    
    const { login } = useAuth();
    const navigate = useNavigate();

    const { username, email, password, organizationId, role } = formData;

    const onChange = (e) => {
        setFormData((prev) => ({
            ...prev,
            [e.target.name]: e.target.value,
        }));
    };

    const handleRegister = async (e) => {
        e.preventDefault();

        try {
            const res = await axios.post('http://localhost:5001/api/auth/register', formData);
            
            const userData = res.data;
            login(userData);
            toast.success(`Welcome, ${userData.username}!`);
            navigate('/dashboard');

        } catch (err) {
            console.error(err);
            toast.error(err.response?.data?.message || 'Registration failed');
        }
    };

    return (
        <div className="flex items-center justify-center min-h-[80vh]">
            <GlassCard className="max-w-md w-full">
                <div className="text-center mb-6">
                    <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-neon-cyan to-neon-purple">
                        Create Account
                    </h2>
                    <p className="text-gray-400">Join SafeStream today</p>
                </div>

                <form onSubmit={handleRegister} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">Username</label>
                        <input
                            type="text"
                            name="username"
                            value={username}
                            onChange={onChange}
                            required
                            className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 focus:outline-none focus:border-neon-cyan text-white"
                            placeholder="johndoe"
                        />
                    </div>
                    
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">Email</label>
                        <input
                            type="email"
                            name="email"
                            value={email}
                            onChange={onChange}
                            required
                            className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 focus:outline-none focus:border-neon-cyan text-white"
                            placeholder="john@example.com"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">Password</label>
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

                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">Role</label>
                        <select
                            name="role"
                            value={role}
                            onChange={onChange}
                            className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 focus:outline-none focus:border-neon-cyan text-white [&>option]:bg-[#0a0a0f] [&>option]:text-white"
                        >
                            <option value="Viewer">Viewer (Read-only)</option>
                            <option value="Editor">Editor (Can Upload)</option>
                            <option value="Admin">Admin (Full Control)</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">Organization ID (Optional)</label>
                         <input
                            type="text"
                            name="organizationId"
                            value={organizationId}
                            onChange={onChange}
                            className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 focus:outline-none focus:border-neon-cyan text-white"
                            placeholder="Org-123"
                        />
                        <p className="text-xs text-gray-500 mt-1">For multi-tenant grouping</p>
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-gradient-to-r from-neon-cyan to-neon-purple text-white font-bold py-3 rounded-xl shadow-lg hover:scale-[1.02] transition-transform flex items-center justify-center gap-2 mt-4"
                    >
                        <UserPlus size={20} />
                        Sign Up
                    </button>
                </form>

                <div className="mt-6 text-center text-sm text-gray-400">
                    Already have an account?{' '}
                    <Link to="/login" className="text-neon-cyan hover:underline">
                        Log In
                    </Link>
                </div>
            </GlassCard>
        </div>
    );
};

export default Register;
