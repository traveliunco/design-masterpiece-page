import { useEffect, useState } from 'react';
import './MouseEffect.css';

const MouseEffect = () => {
  const [clicks, setClicks] = useState<Array<{ id: number; x: number; y: number }>>([]);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    // Track mouse movement
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };

    // Track clicks
    const handleClick = (e: MouseEvent) => {
      const newClick = {
        id: Date.now(),
        x: e.clientX,
        y: e.clientY,
      };
      setClicks(prev => [...prev, newClick]);

      // Remove click effect after animation
      setTimeout(() => {
        setClicks(prev => prev.filter(click => click.id !== newClick.id));
      }, 800);
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('click', handleClick);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('click', handleClick);
    };
  }, []);

  return (
    <>
      {/* Cursor Follower */}
      <div
        className="mouse-cursor"
        style={{
          left: `${mousePos.x}px`,
          top: `${mousePos.y}px`,
        }}
      />

      {/* Click Effects */}
      {clicks.map(click => (
        <div
          key={click.id}
          className="click-ripple"
          style={{
            left: `${click.x}px`,
            top: `${click.y}px`,
          }}
        />
      ))}
    </>
  );
};

export default MouseEffect;
