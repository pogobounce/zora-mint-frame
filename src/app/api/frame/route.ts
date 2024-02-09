import { Zora1155ABI } from '@/abi/Zora1155';
import { CHAIN, CONTRACT_ADDRESS, SITE_URL } from '@/config';
import { NextRequest, NextResponse } from 'next/server';
import {
  Address,
  Hex,
  TransactionExecutionError,
  createPublicClient,
  createWalletClient,
  http,
} from 'viem';
import { privateKeyToAccount } from 'viem/accounts';
import { ethers } from 'ethers';

const NEYNAR_API_KEY = process.env.NEYNAR_API_KEY
const MINTER_PRIVATE_KEY = process.env.PRIVKEY as `0x${string}` | undefined;

const transport = http('https://mainnet.base.org');

const publicClient = createPublicClient({
  chain: CHAIN,
  transport,
});

const walletClient = createWalletClient({
  chain: CHAIN,
  transport,
});

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest): Promise<Response> {
	return getResponse(ResponseType.OUT_OF_GAS);
}

enum ResponseType {
  SUCCESS,
  RECAST,
  ALREADY_MINTED,
  NO_ADDRESS,
  OUT_OF_GAS,
  ERROR,
}

function getResponse(type: ResponseType) {
  const IMAGE = {
    [ResponseType.SUCCESS]: 'status/success.jpg',
    [ResponseType.RECAST]: 'status/recast.jpg',
    [ResponseType.ALREADY_MINTED]: 'status/already-minted.jpg',
    [ResponseType.NO_ADDRESS]: 'status/no-address.jpg',
    [ResponseType.OUT_OF_GAS]: 'status/out-of-mints.jpg',
    [ResponseType.ERROR]: 'status/error.jpg',
  }[type];
  const shouldRetry =
    type === ResponseType.ERROR || type === ResponseType.RECAST;
  return new NextResponse(`<!DOCTYPE html><html><head>
    <meta property="fc:frame" content="vNext" />
    <meta property="fc:frame:image" content="${SITE_URL}/${IMAGE}" />
    <meta property="fc:frame:post_url" content="${SITE_URL}/api/frame" />
    ${
      shouldRetry
        ? `<meta property="fc:frame:button:1" content="Try again" />`
        : ''
    }
  </head></html>`);
}

async function validateFrameRequest(data: string | undefined) {
  if (!NEYNAR_API_KEY) throw new Error('NEYNAR_API_KEY is not set');
  if (!data) throw new Error('No data provided');

  const options = {
    method: 'POST',
    headers: {
      accept: 'application/json',
      api_key: NEYNAR_API_KEY,
      'content-type': 'application/json',
    },
    body: JSON.stringify({ message_bytes_in_hex: data }),
  };

  return await fetch(
    'https://api.neynar.com/v2/farcaster/frame/validate',
    options,
  )
    .then((response) => response.json())
    .catch((err) => console.error(err));
}
