import React, { useRef, useEffect, useState } from 'react';

interface LoadingScreenProps {
    onVideoEnded: () => void;
}

export const LoadingScreen: React.FC<LoadingScreenProps> = ({ onVideoEnded }) => {
    const videoRef = useRef<HTMLVideoElement>(null);

    return (
        <div 
            className="loading-screen" 
            role="status" 
            aria-label="Loading Screen"
        >
            <video
                ref={videoRef}
                autoPlay
                muted
                onEnded={onVideoEnded}
                className="loading-video"
                aria-label="Loading animation"
            >
                <source 
                    src="/loading_screen_nobackground_21-ezgif.com-gif-to-webm-converter.webm" 
                    type="video/webm" 
                />
                Your browser does not support videos.
            </video>
        </div>
    );
}; 