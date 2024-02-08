import { base } from 'viem/chains';
import { getFrameMetadata } from '@coinbase/onchainkit';

export const SITE_URL = 'https://fingerprints404.vercel.app/';

export const CHAIN = base;
export const CONTRACT_ADDRESS = '0x0898957184da0dCDe9BBAA7F2190f3F2fF8a4686';

export const FRAME_METADATA = getFrameMetadata({
  buttons: ['claim fingerprint'],
  image: `${SITE_URL}/opengraph-image.jpg`,
  post_url: `${SITE_URL}/api/frame`,
});
