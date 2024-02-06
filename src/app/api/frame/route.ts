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

const NEYNAR_API_KEY = process.env.NEYNAR_API_KEY
const MINTER_PRIVATE_KEY = process.env.MINTER_PRIVATE_KEY // as Hex | undefined;

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
  try {
    if (!MINTER_PRIVATE_KEY) throw new Error('MINTER_PRIVATE_KEY is not set');

    const body: { trustedData?: { messageBytes?: string } } = await req.json();

    // Check if frame request is valid
    const status = await validateFrameRequest(body.trustedData?.messageBytes);

    if (!status?.valid) {
      console.error(status);
      throw new Error('Invalid frame request');
    }

    // Check if user has liked and recasted
    const hasLikedAndRecasted =
      !!status?.action?.cast?.viewer_context?.liked &&
      !!status?.action?.cast?.viewer_context?.recasted;

    // if (!hasLikedAndRecasted) {
    //   return getResponse(ResponseType.RECAST);
    // }

    // Check if user has an address connected
    const address: Address | undefined =
      status?.action?.interactor?.verifications?.[0];

    if (!address) {
      return getResponse(ResponseType.NO_ADDRESS);
    }

		const pk = `0x${MINTER_PRIVATE_KEY}`;
		const minterAccount = privateKeyToAccount('0x0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef');

    // Check if user has a balance
    const balance = await publicClient.readContract({
      abi: Zora1155ABI,
      address: CONTRACT_ADDRESS,
      functionName: 'balanceOf',
      args: [address],
    });

    if (balance > 0n) {
      return getResponse(ResponseType.ALREADY_MINTED);
    }

    // Transfer airdrop
    const { request } = await publicClient.simulateContract({
      address: CONTRACT_ADDRESS,
      abi: Zora1155ABI,
      functionName: 'transfer',
      args: [address, BigInt('10000000000000000')],
      account: minterAccount,
    });

    // if (!request) {
    //   throw new Error('Could not simulate contract');
    // }

    // try {
    //   const hash = await walletClient.writeContract(request);
    // } catch (error) {
    //   if (
    //     error instanceof TransactionExecutionError
    //   ) {
    //     return getResponse(ResponseType.OUT_OF_GAS);
    //   }
    // }

    return getResponse(ResponseType.SUCCESS);
  } catch (error) {
    console.error(error);
    return getResponse(ResponseType.ERROR);
  }
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
    [ResponseType.SUCCESS]: 'status/success.png',
    [ResponseType.RECAST]: 'status/recast.png',
    [ResponseType.ALREADY_MINTED]: 'status/already-minted.png',
    [ResponseType.NO_ADDRESS]: 'status/no-address.png',
    [ResponseType.OUT_OF_GAS]: 'status/out-of-gas.png',
    [ResponseType.ERROR]: 'status/error.png',
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
