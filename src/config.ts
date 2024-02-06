import { base } from 'viem/chains';
import { getFrameMetadata } from '@coinbase/onchainkit';

export const SITE_URL = 'https://zora-mint-frame-fawn.vercel.app';

export const CHAIN = base;
export const CONTRACT_ADDRESS = '0xf2daa2c8e2a48b490dcd6a4cde09b60cb0426873';

export const FRAME_METADATA = getFrameMetadata({
  buttons: ['mint'],
  image: `${SITE_URL}/opengraph-image.png`,
  post_url: `${SITE_URL}/api/frame`,
});
