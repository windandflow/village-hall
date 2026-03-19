export const ko = {
  // Common
  'common.wind_and_flow': 'Wind & Flow',
  'common.tagline': '바람과 흐름의 길',
  'common.philosophy': '모심 · 살림 · 어울림',
  'common.request_invite': '초대 신청',
  'common.request_invite_long': '초대 신청하기',
  'common.login': '로그인',
  'common.my_passport': '내 여권',
  'common.learn_more': '더 알아보기',
  'common.view_all': '전체 보기 →',
  'common.all': '전체 →',
  'common.join': '참여하기',
  'common.active': 'Active',

  // Nav
  'nav.about': '소개',
  'nav.events': '이벤트',
  'nav.members': '구성원',
  'nav.sodo': '소도',
  'nav.menu_open': '메뉴 열기',
  'nav.menu_close': '메뉴 닫기',

  // Landing — Hero
  'landing.hero.title': 'WIND & FLOW',
  'landing.hero.description':
    '새로운 시대를 여는 디지털 소도(蘇塗) 네트워크.\n우리는 더 자유롭고 고요한 연결을 꿈꿉니다.',
  'landing.hero.manifesto': '매니페스토',

  // Landing — Sodo Network
  'landing.sodo.label': 'The Network',
  'landing.sodo.title': '소도 네트워크',
  'landing.sodo.newmoon': '달뜨는마을',
  'landing.sodo.newmoon_location': '강원 인제군 · 신월리',
  'landing.sodo.hwahoe': '하회마을',
  'landing.sodo.hwahoe_location': '안동 · 2027',
  'landing.sodo.stat_members': '구성원',
  'landing.sodo.stat_residents': '주민',
  'landing.sodo.stat_elders': '원주민',

  // Landing — Featured NIMs
  'landing.nims.title': 'FEATURED NIMS',

  // Landing — CTA
  'landing.cta.title': 'W&F에 참여하고\n싶으신가요?',
  'landing.cta.description': '초대를 통해서만 구성원이 될 수 있습니다.',

  // Footer
  'footer.brand': 'W&F Network',
  'footer.quote': '"바람처럼 자유롭게, 물처럼 흐르며"',
  'footer.copyright': '© 2026 Wind & Flow. All rights reserved.',
  'footer.privacy': '개인정보처리방침',
  'footer.terms': '이용약관',
  'footer.network': 'Network',
  'footer.community': 'Community',
  'footer.projects': 'Projects',
  'footer.opensource': 'Open Source',
  'footer.manifesto': 'Manifesto',
  'footer.protocol': 'Protocol',
  'footer.wfos': 'W&F OS',
  'footer.events': '이벤트',
  'footer.members': '구성원',
  'footer.sodo': '소도',
  'footer.newmoon': '달뜨는마을',
  'footer.github': 'GitHub',

  // Theme
  'theme.light': '햇님',
  'theme.dark': '달님',

  // Locale
  'locale.ko': '한',
  'locale.en': 'EN',
} as const;

export type MessageKey = keyof typeof ko;
