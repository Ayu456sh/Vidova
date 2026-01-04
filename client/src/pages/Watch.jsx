import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import GlassCard from '../components/GlassCard';
import { ArrowLeft, User, Calendar } from 'lucide-react';
import Loader from '../components/Loader';

const Watch = () => {
    const { id } = useParams();
    const [video, setVideo] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchVideo = async () => {
            try {
                const res = await axios.get(`http://localhost:5001/api/videos/${id}`);
                setVideo(res.data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchVideo();
    }, [id]);

    if (loading) return <div className="h-[80vh] flex items-center justify-center"><Loader /></div>;
    if (!video) return <div className="text-center py-20">Video not found.</div>;

    return (
        <div className="space-y-6 max-w-4xl mx-auto">
            <Link to="/dashboard" className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors">
                <ArrowLeft size={20} />
                Back to Library
            </Link>

            <GlassCard className="p-0 overflow-hidden border-none bg-black">
                <video
                    controls
                    autoPlay
                    className="w-full aspect-video outline-none"
                    poster="" // Could be a thumbnail URL if we had one
                >
                    <source src={`http://localhost:5001/api/videos/stream/${id}`} type="video/mp4" />
                    Your browser does not support the video tag.
                </video>
            </GlassCard>

            <GlassCard>
                <div className="flex justify-between items-start">
                    <div>
                        <h1 className="text-2xl font-bold mb-2">{video.title}</h1>
                        <div className="flex items-center gap-4 text-sm text-gray-400">
                            <div className="flex items-center gap-1">
                                <User size={16} />
                                <span>{video.uploader?.username || 'Unknown Uploader'}</span>
                            </div>
                            <div className="flex items-center gap-1">
                                <Calendar size={16} />
                                <span>{new Date(video.createdAt).toLocaleDateString()}</span>
                            </div>
                        </div>
                    </div>
                    <div className={`px-3 py-1 rounded text-xs font-bold ${video.sensitivity === 'Flagged' ? 'bg-red-500/20 text-red-500 border border-red-500/50' : 'bg-green-500/20 text-green-500 border border-green-500/50'
                        }`}>
                        {video.sensitivity}
                    </div>
                </div>
            </GlassCard>
        </div>
    );
};

export default Watch;
