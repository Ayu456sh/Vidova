import React from 'react';
import { motion } from 'framer-motion';

const Loader = () => {
    return (
        <div className="flex items-center justify-center h-full w-full">
            <motion.div
                animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.5, 1, 0.5],
                    rotate: [0, 180, 360],
                }}
                transition={{
                    duration: 2,
                    ease: "easeInOut",
                    repeat: Infinity,
                }}
                className="w-16 h-16 border-4 border-t-neon-cyan border-r-neon-purple border-b-transparent border-l-transparent rounded-full"
            />
        </div>
    );
};

export default Loader;
