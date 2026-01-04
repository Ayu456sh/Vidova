import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload as UploadIcon, CheckCircle, AlertCircle, FileVideo, Activity } from 'lucide-react';
import axios from 'axios';
import GlassCard from '../components/GlassCard';
import { useSocket } from '../context/SocketContext';
import { toast } from 'react-toastify';

const Upload = () => {
    const [file, setFile] = useState(null);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [status, setStatus] = useState('idle'); // idle, uploading, analyzing, completed
    const socket = useSocket();

    const onDrop = useCallback((acceptedFiles) => {
        const selectedFile = acceptedFiles[0];
        if (selectedFile) {
            if (!selectedFile.type.startsWith('video/')) {
                toast.error("Please upload a valid video file.");
                return;
            }
            setFile(selectedFile);
            setStatus('idle');
            setUploadProgress(0);
        }
    }, []);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: { 'video/*': [] },
        multiple: false
    });

    const handleUpload = async () => {
        if (!file) return;

        setStatus('uploading');
        const formData = new FormData();
        formData.append('video', file);
        
        const token = localStorage.getItem('token');

        if (!token) {
            toast.error("You must be logged in to upload.");
            setStatus('idle');
            return;
        }

        const config = {
            headers: {
                'Content-Type': 'multipart/form-data',
                Authorization: `Bearer ${token}`
            },
            onUploadProgress: (progressEvent) => {
                const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                setUploadProgress(percentCompleted);
            }
        };

        try {
            const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001';
            const res = await axios.post(`${API_URL}/api/videos/upload`, formData, config);
            setStatus('analyzing');
            console.log('Upload success:', res.data);

            setTimeout(() => {
                setFile(null);
                setStatus('completed');
                setUploadProgress(0);
            }, 6000);

        } catch (err) {
            console.error(err);
            setStatus('idle');
            const errorMessage = err.response?.data?.message || err.message || 'Upload failed. Are you logged in?';
            toast.error(errorMessage);
        }
    };

    return (
        <div className="max-w-2xl mx-auto space-y-8">
            <div className="text-center space-y-2">
                <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-neon-cyan to-neon-purple">
                    Upload Footage
                </h2>
                <p className="text-gray-400">Securely upload video for AI analysis</p>
            </div>

            <GlassCard className="relative overflow-hidden group">
                <div
                    {...getRootProps()}
                    className={`border-2 border-dashed rounded-xl p-10 flex flex-col items-center justify-center transition-all cursor-pointer h-64
            ${isDragActive ? 'border-neon-cyan bg-neon-cyan/5' : 'border-white/20 hover:border-white/40 hover:bg-white/5'}
          `}
                >
                    <input {...getInputProps()} />
                    <AnimatePresence mode="wait">
                        {!file ? (
                            <motion.div
                                key="prompt"
                                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                                className="flex flex-col items-center text-center space-y-4"
                            >
                                <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-2">
                                    <UploadIcon size={32} className="text-neon-cyan" />
                                </div>
                                <div>
                                    <p className="text-lg font-medium">Drag & drop or click to browse</p>
                                    <p className="text-sm text-gray-500 mt-1">MP4, MOV, AVI (Max 100MB)</p>
                                </div>
                            </motion.div>
                        ) : (
                            <motion.div
                                key="preview"
                                initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
                                className="flex flex-col items-center space-y-4 w-full"
                            >
                                <div className="flex items-center gap-3 bg-midnight/50 px-4 py-3 rounded-lg border border-white/10 w-full max-w-md">
                                    <FileVideo className="text-neon-purple" />
                                    <div className="flex-1 min-w-0">
                                        <p className="font-medium truncate">{file.name}</p>
                                        <p className="text-xs text-gray-400">{(file.size / (1024 * 1024)).toFixed(2)} MB</p>
                                    </div>
                                    <button
                                        onClick={(e) => { e.stopPropagation(); setFile(null); }}
                                        className="text-gray-500 hover:text-white"
                                    >
                                        ✕
                                    </button>
                                </div>

                                {status === 'idle' && (
                                    <button
                                        onClick={(e) => { e.stopPropagation(); handleUpload(); }}
                                        className="bg-gradient-to-r from-neon-cyan to-neon-purple text-white font-bold py-2 px-8 rounded-lg shadow-lg shadow-neon-cyan/20 hover:scale-105 transition-transform"
                                    >
                                        Start Analysis
                                    </button>
                                )}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Progress Overlay */}
                {status !== 'idle' && status !== 'completed' && (
                    <div className="absolute inset-0 bg-midnight/80 backdrop-blur-sm flex flex-col items-center justify-center z-10">
                        <div className="w-full max-w-sm space-y-4">
                            <div className="flex justify-between text-sm">
                                <span className={status === 'analyzing' ? 'text-neon-cyan font-bold animate-pulse' : 'text-white'}>
                                    {status === 'uploading' ? 'Uploading...' : 'AI Analysis...'}
                                </span>
                                <span>{status === 'uploading' ? `${uploadProgress}%` : ''}</span>
                            </div>

                            <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
                                <motion.div
                                    className="h-full bg-gradient-to-r from-neon-cyan to-neon-purple"
                                    initial={{ width: 0 }}
                                    animate={{
                                        width: status === 'uploading' ? `${uploadProgress}%` : '100%'
                                    }}
                                    transition={{ duration: 0.5 }}
                                />
                            </div>

                            {status === 'analyzing' && (
                                <motion.div
                                    initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                                    className="flex items-center justify-center gap-2 text-xs text-gray-400 mt-2"
                                >
                                    <Activity size={12} className="animate-spin" />
                                    Processing content sensitivity
                                </motion.div>
                            )}
                        </div>
                    </div>
                )}
            </GlassCard>
        </div>
    );
};

export default Upload;
