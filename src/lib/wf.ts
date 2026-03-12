import { WFClient } from '@windandflow/sdk';

/**
 * W&F OS SDK 클라이언트 인스턴스
 *
 * 이 앱의 모든 DB/블록체인 접근은 이 인스턴스를 통해서만.
 * 절대 Supabase 클라이언트를 직접 생성하지 않는다.
 */
export const wf = new WFClient({
  supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL!,
  supabaseKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  contracts: {
    passportAddress: process.env.NEXT_PUBLIC_PASSPORT_CONTRACT!,
    visaAddress: process.env.NEXT_PUBLIC_VISA_CONTRACT!,
  },
  chain: 'base',
});
