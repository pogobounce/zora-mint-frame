import { base } from 'viem/chains';
import { getFrameMetadata } from '@coinbase/onchainkit';

export const SITE_URL = 'https://fingerprints404.vercel.app/';

export const CHAIN = base;
export const CONTRACT_ADDRESS = '0xbd5e4ca04dcdeb296f855bf06135c484c43e17f4';

export const FRAME_METADATA = getFrameMetadata({
  buttons: ['claim fingerprint'],
  image: `${SITE_URL}/opengraph-image.jpg`,
  post_url: `${SITE_URL}/api/frame`,
});
