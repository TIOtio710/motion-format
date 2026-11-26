import {Composition} from 'remotion';
import {KataKinetik, kataDefaults, kataDurasi, KataProps} from './KataKinetik';
import {DaftarTips, tipsDefaults, tipsDurasi, TipsProps} from './DaftarTips';

// Semua 9:16 (1080x1920), 30 fps: Reels / TikTok / Shorts.
export const Root = () => (
  <>
    <Composition
      id="KataKinetik"
      component={KataKinetik}
      width={1080}
      height={1920}
      fps={30}
      durationInFrames={kataDurasi(kataDefaults)}
      defaultProps={kataDefaults}
      calculateMetadata={({props}: {props: KataProps}) => ({durationInFrames: kataDurasi(props)})}
    />
    <Composition
      id="DaftarTips"
      component={DaftarTips}
      width={1080}
      height={1920}
      fps={30}
      durationInFrames={tipsDurasi(tipsDefaults)}
      defaultProps={tipsDefaults}
      calculateMetadata={({props}: {props: TipsProps}) => ({durationInFrames: tipsDurasi(props)})}
    />
  </>
);
