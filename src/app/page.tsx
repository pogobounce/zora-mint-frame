import {
  CHAIN,
  CONTRACT_ADDRESS,
  FRAME_METADATA,
  SITE_URL,
} from '@/config';
import { Metadata } from 'next';

export const metadata: Metadata = {
  metadataBase: SITE_URL ? new URL(SITE_URL) : undefined,
  title: 'Grab a fingerprint!',
  other: FRAME_METADATA,
};

export default function Home() {
  return (
    <div style={{ minHeight: '100dvh', display: 'flex' }}>
      <h1
        style={{
          margin: 'auto',
          fontFamily: 'Comic Sans MS, Comic Sans, cursive',
        }}
      >
        <a
          href={`https://dexscreener.com/base/0x2bc487961eeb5ae27cd1cbc9163cd7ea3106d306`}
          style={{ color: 'inherit' }}
        >
          Free mint!
        </a>
      </h1>
    </div>
  );
}
