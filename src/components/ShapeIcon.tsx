import React from "react";

interface ShapeIconProps {
  shape: string;
  color: string;
  size?: number;
}

export const ShapeIcon: React.FC<ShapeIconProps> = ({ shape, color, size = 44 }) => {
  const c = color;
  const s = size;
  if (shape === 'wave') {
    return (
      <svg width={s} height={s} viewBox="0 0 100 100">
        <path d="M5,55 Q27,20 50,55 Q73,90 95,55" stroke={c} strokeWidth="4" fill="none" strokeLinecap="round" />
        <path d="M5,70 Q27,35 50,70 Q73,105 95,70" stroke={c} strokeWidth="2" fill="none" opacity="0.35" strokeLinecap="round" />
      </svg>
    );
  }
  if (shape === 'leaf') {
    return (
      <svg width={s} height={s} viewBox="0 0 100 100">
        <path d="M50,12 Q82,28 78,58 Q74,85 50,92 Q26,85 22,58 Q18,28 50,12Z" stroke={c} strokeWidth="3" fill={c + '1A'} />
        <line x1="50" y1="12" x2="50" y2="92" stroke={c} strokeWidth="1.5" opacity="0.35" />
      </svg>
    );
  }
  if (shape === 'triangle') {
    return (
      <svg width={s} height={s} viewBox="0 0 100 100">
        <polygon points="50,8 94,84 6,84" stroke={c} strokeWidth="3" fill={c + '15'} />
        <polygon points="50,28 76,70 24,70" stroke={c} strokeWidth="1.5" fill="none" opacity="0.4" />
      </svg>
    );
  }
  if (shape === 'arch') {
    return (
      <svg width={s} height={s} viewBox="0 0 100 100">
        <path d="M18,88 L18,46 Q18,12 50,12 Q82,12 82,46 L82,88" stroke={c} strokeWidth="3" fill={c + '15'} />
        <path d="M30,88 L30,52 Q30,26 50,26 Q70,26 70,52 L70,88" stroke={c} strokeWidth="1.5" fill="none" opacity="0.4" />
      </svg>
    );
  }
  return (
    <svg width={s} height={s} viewBox="0 0 100 100">
      <polygon points="50,6 90,28 90,72 50,94 10,72 10,28" stroke={c} strokeWidth="3" fill={c + '15'} />
      <polygon points="50,24 74,37 74,63 50,76 26,63 26,37" stroke={c} strokeWidth="1.5" fill="none" opacity="0.4" />
    </svg>
  );
};
