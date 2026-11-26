import {AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';

// Template 2: listicle bernomor ("5 tips ..."). Judul masuk, lalu tiap poin muncul berurutan.
export type TipsProps = {
  judul: string;
  tips: string[];
  tahanFrame: number; // jeda antar poin
  bg: string;
  fg: string;
  aksen: string;
  handle: string;
};

export const tipsDefaults: TipsProps = {
  judul: '5 Kebiasaan Pagi yang Mengubah Hari',
  tips: ['Minum air putih dulu', 'Jemur matahari 10 menit', 'Tulis 3 prioritas', 'Jangan buka HP 30 menit', 'Gerak ringan 5 menit'],
  tahanFrame: 45,
  bg: '#F6F1E7',
  fg: '#1B1B1F',
  aksen: '#FF5A36',
  handle: '@namakamu',
};

const INTRO = 45;
const OUTRO = 45;
export const tipsDurasi = (p: TipsProps) => INTRO + p.tips.length * p.tahanFrame + OUTRO;

export const DaftarTips = (p: TipsProps) => {
  const frame = useCurrentFrame();
  const {fps, durationInFrames} = useVideoConfig();
  const judulS = spring({frame, fps, config: {damping: 14}});
  return (
    <AbsoluteFill style={{background: p.bg, fontFamily: 'Inter, "Helvetica Neue", system-ui, sans-serif', padding: '140px 80px'}}>
      <div
        style={{
          fontSize: 92,
          fontWeight: 900,
          lineHeight: 1.1,
          color: p.fg,
          transform: `translateY(${(1 - judulS) * -80}px)`,
          opacity: judulS,
        }}
      >
        {p.judul}
      </div>
      <div style={{marginTop: 80, display: 'flex', flexDirection: 'column', gap: 36}}>
        {p.tips.map((t, i) => {
          const s = spring({frame: frame - (INTRO + i * p.tahanFrame), fps, config: {damping: 13, stiffness: 140}});
          return (
            <div
              key={i}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 36,
                background: '#FFFFFF',
                borderRadius: 32,
                padding: '32px 40px',
                boxShadow: '0 12px 0 rgba(0,0,0,0.08)',
                transform: `translateX(${(1 - s) * 900}px)`,
                opacity: s,
              }}
            >
              <div
                style={{
                  flex: 'none',
                  width: 100,
                  height: 100,
                  borderRadius: 50,
                  background: p.aksen,
                  color: '#fff',
                  fontSize: 56,
                  fontWeight: 900,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                {i + 1}
              </div>
              <div style={{fontSize: 56, fontWeight: 700, color: p.fg, lineHeight: 1.2}}>{t}</div>
            </div>
          );
        })}
      </div>
      <div style={{position: 'absolute', bottom: 80, width: '100%', left: 0, textAlign: 'center', color: p.fg, opacity: 0.55, fontSize: 40}}>
        {p.handle}
      </div>
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          height: 14,
          width: `${interpolate(frame, [0, durationInFrames], [0, 100])}%`,
          background: p.aksen,
        }}
      />
    </AbsoluteFill>
  );
};
