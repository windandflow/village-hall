/**
 * On-chain utilities for Passport SBT and Visa NFT.
 *
 * 서버 사이드 전용 (API routes에서만 사용).
 * 운영지갑(OPERATOR_PRIVATE_KEY)으로 mint/update 트랜잭션 실행.
 */

import { ethers } from 'ethers';

// ─── ABI (필요한 함수만) ────────────────────────────────────────────────────

export const PASSPORT_ABI = [
  'function mint(address to, bytes32 _manifestoHash) external returns (uint256)',
  'function hasPassport(address) external view returns (bool)',
  'function passportOf(address) external view returns (uint256)',
  'function totalPassports() external view returns (uint256)',
  'function notifyMetadataUpdate(uint256 tokenId) external',
];

export const VISA_ABI = [
  'function mint(address to, bytes32 stateId, address invitedBy) external returns (uint256)',
  'function updateLevel(uint256 tokenId, uint8 newLevel) external',
  'function updateCoopStatus(uint256 tokenId, bool _coopMember) external',
  'function visaOf(address, bytes32) external view returns (uint256)',
  'function visaData(uint256) external view returns (bytes32 stateId, uint8 level, bool coopMember, uint64 issuedAt, uint64 levelUpdatedAt, address invitedBy)',
  'function totalVisas() external view returns (uint256)',
];

// ─── EIP-712 타입 (매니페스토 서약) ────────────────────────────────────────

export const MANIFESTO_DOMAIN = {
  name: 'Wind & Flow',
  version: '1',
  // chainId는 런타임에 설정
};

export const MANIFESTO_TYPES = {
  ManifestoSign: [
    { name: 'signer', type: 'address' },
    { name: 'manifestoHash', type: 'bytes32' },
    { name: 'timestamp', type: 'uint256' },
  ],
};

// ─── Provider & Contracts ──────────────────────────────────────────────────

function getChainConfig() {
  const chain = process.env.NEXT_PUBLIC_CHAIN || 'base-sepolia';
  if (chain === 'base') {
    return {
      rpcUrl: 'https://mainnet.base.org',
      chainId: 8453,
    };
  }
  return {
    rpcUrl: 'https://sepolia.base.org',
    chainId: 84532,
  };
}

function getProvider() {
  const { rpcUrl } = getChainConfig();
  return new ethers.JsonRpcProvider(rpcUrl);
}

function getOperatorWallet() {
  const key = process.env.OPERATOR_PRIVATE_KEY;
  if (!key) throw new Error('OPERATOR_PRIVATE_KEY not set');
  return new ethers.Wallet(key, getProvider());
}

export function getPassportContract(signerOrProvider?: ethers.Signer | ethers.Provider) {
  const address = process.env.NEXT_PUBLIC_PASSPORT_CONTRACT;
  if (!address || address.startsWith('아직')) throw new Error('Passport contract not deployed');
  return new ethers.Contract(address, PASSPORT_ABI, signerOrProvider || getProvider());
}

export function getVisaContract(signerOrProvider?: ethers.Signer | ethers.Provider) {
  const address = process.env.NEXT_PUBLIC_VISA_CONTRACT;
  if (!address || address.startsWith('아직')) throw new Error('Visa contract not deployed');
  return new ethers.Contract(address, VISA_ABI, signerOrProvider || getProvider());
}

// ─── Mint Functions ────────────────────────────────────────────────────────

/**
 * Passport SBT 민팅 (운영지갑이 가스 부담)
 */
export async function mintPassport(
  recipientAddress: string,
  manifestoHash: string,
): Promise<{ tokenId: number; txHash: string }> {
  const wallet = getOperatorWallet();
  const contract = getPassportContract(wallet);

  const tx = await contract.mint(recipientAddress, manifestoHash);
  const receipt = await tx.wait();

  // Transfer 이벤트에서 tokenId 추출
  const transferLog = receipt.logs.find(
    (log: ethers.Log) => log.topics[0] === ethers.id('Transfer(address,address,uint256)'),
  );
  const tokenId = transferLog
    ? Number(BigInt(transferLog.topics[3]))
    : 0;

  return { tokenId, txHash: receipt.hash };
}

/**
 * Visa NFT 민팅 (운영지갑이 가스 부담)
 */
export async function mintVisa(
  recipientAddress: string,
  stateSlug: string,
  inviterAddress: string,
): Promise<{ tokenId: number; txHash: string }> {
  const wallet = getOperatorWallet();
  const contract = getVisaContract(wallet);

  // stateSlug를 bytes32로 변환
  const stateIdBytes = ethers.id(stateSlug);

  const tx = await contract.mint(recipientAddress, stateIdBytes, inviterAddress);
  const receipt = await tx.wait();

  const transferLog = receipt.logs.find(
    (log: ethers.Log) => log.topics[0] === ethers.id('Transfer(address,address,uint256)'),
  );
  const tokenId = transferLog
    ? Number(BigInt(transferLog.topics[3]))
    : 0;

  return { tokenId, txHash: receipt.hash };
}

// ─── EIP-712 서명 검증 ────────────────────────────────────────────────────

/**
 * 매니페스토 서명 검증
 */
export function verifyManifestoSignature(
  signature: string,
  signer: string,
  manifestoHash: string,
  timestamp: number,
): boolean {
  const { chainId } = getChainConfig();
  const domain = { ...MANIFESTO_DOMAIN, chainId };
  const value = { signer, manifestoHash, timestamp };

  try {
    const recovered = ethers.verifyTypedData(domain, MANIFESTO_TYPES, value, signature);
    return recovered.toLowerCase() === signer.toLowerCase();
  } catch {
    return false;
  }
}

// 매니페스토 원문 (서명/민팅에 사용)
const MANIFESTO_TEXT = [
  '우리는 눈에 보이지 않는 것들을 봅니다.',
  '바람의 결, 사람 사이의 흐름, 작은 돌봄이 만드는 변화를.',
  '우리는 그 보이지 않는 것들을 증명합니다.',
  '서로를 알아보는 것, 그것이 우리의 시작입니다.',
].join('\n');

/**
 * 매니페스토 해시 생성
 */
export function getManifestoHash(manifestoText?: string): string {
  return ethers.keccak256(ethers.toUtf8Bytes(manifestoText || MANIFESTO_TEXT));
}

/**
 * EIP-712 서명에 사용할 도메인 정보 반환 (클라이언트용)
 */
export function getSigningDomain() {
  const { chainId } = getChainConfig();
  return { ...MANIFESTO_DOMAIN, chainId };
}
