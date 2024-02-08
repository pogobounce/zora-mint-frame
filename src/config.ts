import { base } from 'viem/chains';
import { getFrameMetadata } from '@coinbase/onchainkit';

export const SITE_URL = 'https://404fingerprints.vercel.app/';

export const CHAIN = base;
export const CONTRACT_ADDRESS = '0xEC7F8de00e20EC9E4180aE1F9F9eaf6250b8A445';

export const FRAME_METADATA = getFrameMetadata({
  buttons: ['claim fingerprint'],
  image: `${SITE_URL}/opengraph-image.jpg`,
  post_url: `${SITE_URL}/api/frame`,
});
