// LottieAnimation.js
import React from 'react';
import Lottie from 'react-lottie';
import animationData from '../../assets/lotties/animation.json';

const LottieAnimation = () => {
    const defaultOptions = {
        loop: true,
        autoplay: true,
        animationData: animationData,
        rendererSettings: {
            preserveAspectRatio: 'xMidYMid slice'
        }
    };

    return (
        <div>
            <Lottie options={defaultOptions} height={150} width={150} />
        </div>
    );
};

export default LottieAnimation;