import React from "react";
import { motion } from "framer-motion";

interface LoadingOverlayProps {
    message: string;
}

const LoadingOverlay: React.FC<LoadingOverlayProps> = ({ message }) => {
    return (
        <div className="flex items-center justify-center h-full bg-blue-50">
            <div className="text-center">
                {/* Animated spinner */}
                <motion.div
                    className="mx-auto mb-4 w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full"
                    animate={{ rotate: 360 }}
                    transition={{
                        duration: 1,
                        repeat: Infinity,
                        ease: "linear"
                    }}
                />
                
                {/* Loading message */}
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                >
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        {message}
                    </h3>
                    <p className="text-sm text-gray-600">
                        Please wait...
                    </p>
                </motion.div>

                {/* Animated dots */}
                <div className="flex justify-center gap-1 mt-4">
                    {[0, 1, 2].map((i) => (
                        <motion.div
                            key={i}
                            className="w-2 h-2 bg-blue-600 rounded-full"
                            animate={{
                                y: [0, -10, 0],
                                opacity: [1, 0.5, 1]
                            }}
                            transition={{
                                duration: 0.8,
                                repeat: Infinity,
                                delay: i * 0.15,
                                ease: "easeInOut"
                            }}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default LoadingOverlay;
