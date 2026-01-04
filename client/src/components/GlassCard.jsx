import React from 'react';
import { motion } from 'framer-motion';

const GlassCard = ({ children, className = "" }) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ scale: 1.01, boxShadow: "0px 10px 30px -10px rgba(0, 243, 255, 0.1)" }}
            transition={{ duration: 0.5 }}
            className={`glass-effect rounded-2xl p-6 border border-white/10 shadow-xl backdrop-blur-md ${className}`}
        >
            {children}
        </motion.div>
    );
};

export default GlassCard;
