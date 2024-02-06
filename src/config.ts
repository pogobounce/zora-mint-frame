import { base } from 'viem/chains';
import { getFrameMetadata } from '@coinbase/onchainkit';

export const SITE_URL = 'https://zora-mint-frame-fawn.vercel.app';

export const CHAIN = base;
export const CONTRACT_ADDRESS = '0xC9f11a1aE22699671eE159a7bCbD42473424cF27';

export const FRAME_METADATA = getFrameMetadata({
  buttons: ['mint'],
  image: `${SITE_URL}/opengraph-image.png`,
  post_url: `${SITE_URL}/api/frame`,
});
