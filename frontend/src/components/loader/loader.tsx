import React from 'react';
import Lottie from 'react-lottie-player';

export const Loader = () => {
  return (
    <Lottie
      loop
      animationData={fetch('/Animation-1736438540676.json').then(res => res.json())} // ใช้ fetch เพื่อโหลด JSON
      play
      style={{ width: 300, height: 300 }}
    />
  );
};
