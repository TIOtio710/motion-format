import {AbsoluteFill, interpolate, Sequence, spring, useCurrentFrame, useVideoConfig} from 'remotion';

// Template 1: teks kinetik per kata. Cocok untuk hook / kutipan / pernyataan berani.
// Tiap baris tampil bergantian; baris terakhir diberi warna aksen.
export type KataProps = {
  baris: string[];
  tahanFrame: number; // lama tiap baris di layar
  bg: string;
  fg: string;
  aksen: string;
  handle: string;
};

export const kataDefaults: KataProps = {
  baris: ['Berhenti scroll.', 'Ini yang bikin video kamu', 'dilewati orang.'],
  tahanFrame: 60,
  bg: '#0E0F13',
  fg: '#FFFFFF',
  aksen: '#FFD23F',
  handle: '@namakamu',
};

export const kataDurasi = (p: KataProps) => p.baris.length * p.tahanFrame;

const Baris = ({teks, warna, tahan}: {teks: string; warna: string; tahan: number}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const kata = teks.split(' ');
  // fade-out 6 frame terakhir agar transisi antar baris halus
  const keluar = interpolate(frame, [tahan - 6, tahan], [1, 0], {extrapolateLeft: 'clamp'});
  return (
    <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center', padding: 80, opacity: keluar}}>
      <div style={{display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '0 28px'}}>
        {kata.map((k, i) => {
          const s = spring({frame: frame - i * 4, fps, config: {damping: 12, stiffness: 160}});
          return (
            <span
              key={i}
              style={{
                fontSize: 120,
                fontWeight: 900,
                lineHeight: 1.15,
                color: warna,
                transform: `translateY(${(1 - s) * 60}px) scale(${0.8 + 0.2 * s})`,
                opacity: s,
              }}
            >
              {k}
            </span>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

export const KataKinetik = (p: KataProps) => {
  const frame = useCurrentFrame();
  const {durationInFrames} = useVideoConfig();
  const bar = interpolate(frame, [0, durationInFrames], [0, 100]);
  return (
    <AbsoluteFill style={{background: p.bg, fontFamily: 'Inter, "Helvetica Neue", system-ui, sans-serif'}}>
      {p.baris.map((t, i) => (
        <Sequence key={i} from={i * p.tahanFrame} durationInFrames={p.tahanFrame}>
          <Baris teks={t} tahan={p.tahanFrame} warna={i === p.baris.length - 1 ? p.aksen : p.fg} />
        </Sequence>
      ))}
      <div style={{position: 'absolute', bottom: 140, width: '100%', textAlign: 'center', color: p.fg, opacity: 0.6, fontSize: 40}}>
        {p.handle}
      </div>
      <div style={{position: 'absolute', bottom: 0, left: 0, height: 12, width: `${bar}%`, background: p.aksen}} />
    </AbsoluteFill>
  );
};
