import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { Play, AlertTriangle, CheckCircle, Clock } from 'lucide-react';
import GlassCard from '../components/GlassCard';
import { useSocket } from '../context/SocketContext';
import { motion } from 'framer-motion';

const Dashboard = () => {
    const [videos, setVideos] = useState([]);
    const [loading, setLoading] = useState(true);
    const socket = useSocket();

    const fetchVideos = async () => {
        try {
            const token = localStorage.getItem('token');
            const config = {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            };
            const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001';
            const res = await axios.get(`${API_URL}/api/videos`, config);
            setVideos(res.data);
            setLoading(false);
        } catch (err) {
            console.error(err);
            if (err.response && err.response.status === 401) {
                window.location.href = '/login';
            }
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchVideos();
    }, []);

    useEffect(() => {
        if (!socket) return;
        socket.on('video_processed', (updatedVideo) => {
            setVideos((prev) =>
                prev.map(v => v._id === updatedVideo._id ? updatedVideo : v)
            );
            fetchVideos();
        });
        return () => socket.off('video_processed');
    }, [socket]);

    // Video Card Component
    const VideoCard = ({ video }) => {
        const isProcessing = video.status === 'Processing';
        const isFlagged = video.sensitivity === 'Flagged';
        const [isRevealed, setIsRevealed] = useState(false);

        return (
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
            >
                <GlassCard className="p-0 overflow-hidden group relative h-64 flex flex-col">
                    {/* Thumbnail Area */}
                    <div className="relative flex-1 bg-black/50 overflow-hidden">
                        {isProcessing ? (
                            <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-900 animate-pulse">
                                <Clock className="text-gray-600 mb-2 animate-spin-slow" />
                                <span className="text-xs text-gray-500 font-mono">PROCESSING</span>
                            </div>
                        ) : (
                            <>
                                {/* Placeholder Thumbnail Gradient */}
                                <div className={`w-full h-full bg-gradient-to-br from-gray-800 to-black transition-all duration-500 ${isFlagged && !isRevealed ? 'blur-xl scale-110' : ''}`} />

                                {/* Play Button Overlay */}
                                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-10">
                                    <Link to={`/watch/${video._id}`}>
                                        <div className="w-12 h-12 rounded-full bg-neon-cyan text-black flex items-center justify-center shadow-lg hover:scale-110 transition-transform">
                                            <Play fill="currentColor" size={20} className="ml-1" />
                                        </div>
                                    </Link>
                                </div>

                                {/* Flagged Overlay */}
                                {isFlagged && !isRevealed && (
                                    <div
                                        className="absolute inset-0 flex flex-col items-center justify-center z-20 cursor-pointer"
                                        onClick={() => setIsRevealed(true)}
                                    >
                                        <AlertTriangle className="text-red-500 mb-2" size={32} />
                                        <span className="text-xs font-bold text-red-500 border border-red-500/50 px-2 py-1 rounded bg-black/50 mb-2">
                                            SENSITIVE CONTENT
                                        </span>
                                        <span className="text-[10px] text-gray-400 uppercase tracking-widest">Click to Reveal</span>
                                    </div>
                                )}
                            </>
                        )}
                    </div>

                    {/* Info Area */}
                    <div className="p-4 bg-white/5 border-t border-white/5 relative z-20 backdrop-blur-sm">
                        <h3 className="font-semibold text-sm truncate mb-1" title={video.title}>{video.title}</h3>
                        <div className="flex items-center justify-between text-xs">
                            <span className="text-gray-400">{new Date(video.createdAt).toLocaleDateString()}</span>
                            {isProcessing && <span className="text-yellow-500">Analysing...</span>}
                            {video.status === 'Completed' && (
                                <span className={`flex items-center gap-1 ${isFlagged ? 'text-red-400' : 'text-green-400'}`}>
                                    {isFlagged ? <AlertTriangle size={12} /> : <CheckCircle size={12} />}
                                    {video.sensitivity}
                                </span>
                            )}
                        </div>
                    </div>
                </GlassCard>
            </motion.div>
        );
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold">Video Library</h2>
                <button onClick={fetchVideos} className="text-sm text-neon-cyan hover:underline">Refresh</button>
            </div>

            {loading ? (
                <div className="text-center py-20 text-gray-500">Loading library...</div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {videos.length === 0 ? (
                        <div className="col-span-full py-10 text-center">
                            <p className="text-gray-500">No videos found. Upload one to get started.</p>
                        </div>
                    ) : (
                        videos.map(video => <VideoCard key={video._id} video={video} />)
                    )}
                </div>
            )}
        </div>
    );
};

export default Dashboard;
