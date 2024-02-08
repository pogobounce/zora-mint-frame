import { base } from 'viem/chains';
import { getFrameMetadata } from '@coinbase/onchainkit';

export const SITE_URL = 'https://fingerprints404.vercel.app/';

export const CHAIN = base;
export const CONTRACT_ADDRESS = '0x0133D5828eBAF7E2E4408E7544D979Aadff643c8';

export const FRAME_METADATA = getFrameMetadata({
  buttons: ['claim fingerprint'],
  image: `${SITE_URL}/opengraph-image.jpg`,
  post_url: `${SITE_URL}/api/frame`,
});
