import React from 'react';
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';

export const SocialAdTemplate = ({
  headline = 'Hypnotic Core',
  subtitle = '10s Social Ad Template',
  primary = '#00ffcc',
  secondary = '#8800ff',
}) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  const inOpacity = interpolate(frame, [0, 20], [0, 1], { extrapolateRight: 'clamp' });
  const outroOpacity = interpolate(frame, [durationInFrames - 24, durationInFrames], [1, 0], { extrapolateLeft: 'clamp' });
  const scale = spring({ frame, fps, from: 0.94, to: 1, durationInFrames: 38 });
  const glow = interpolate(frame, [0, durationInFrames], [0, 360]);

  return (
    <AbsoluteFill
      style={{
        justifyContent: 'center',
        alignItems: 'center',
        background: '#06060a',
        color: 'white',
        fontFamily: 'Inter, sans-serif',
        opacity: inOpacity * outroOpacity,
      }}
    >
      <div
        style={{
          position: 'absolute',
          width: 900,
          height: 900,
          borderRadius: '50%',
          background: `radial-gradient(circle, ${primary}66 0%, ${secondary}22 45%, transparent 70%)`,
          filter: `blur(4px) hue-rotate(${glow}deg)`,
          transform: `scale(${scale})`,
        }}
      />

      <div style={{ textAlign: 'center', transform: `scale(${scale})`, zIndex: 2 }}>
        <h1 style={{ margin: 0, fontSize: 120, fontStyle: 'italic', fontFamily: 'Playfair Display, serif' }}>{headline}</h1>
        <p style={{ marginTop: 20, letterSpacing: '0.28em', textTransform: 'uppercase', opacity: 0.8 }}>{subtitle}</p>
      </div>
    </AbsoluteFill>
  );
};
