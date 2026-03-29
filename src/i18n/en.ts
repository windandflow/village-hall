import type { MessageKey } from './ko';

export const en: Record<MessageKey, string> = {
  // Common
  'common.wind_and_flow': 'Wind & Flow',
  'common.tagline': 'The Way of Wind and Flow',
  'common.philosophy': 'Nurture · Sustain · Harmonize',
  'common.request_invite': 'Request Invite',
  'common.request_invite_long': 'Request an Invite',
  'common.login': 'Log in',
  'common.my_passport': 'My Passport',
  'common.learn_more': 'Learn More',
  'common.view_all': 'View All →',
  'common.all': 'All →',
  'common.join': 'Join',
  'common.active': 'Active',

  // Nav
  'nav.about': 'About',
  'nav.events': 'Events',
  'nav.members': 'Members',
  'nav.sodo': 'Sodo',
  'nav.menu_open': 'Open menu',
  'nav.menu_close': 'Close menu',

  // Landing — Hero
  'landing.hero.title': 'WIND & FLOW',
  'landing.hero.description':
    'A digital Sodo network for a new era.\nWe dream of freer, quieter connections.',
  'landing.hero.manifesto': 'Manifesto',

  // Landing — Sodo Network
  'landing.sodo.label': 'The Network',
  'landing.sodo.title': 'Sodo Network',
  'landing.sodo.newmoon': 'New Moon Village',
  'landing.sodo.newmoon_location': 'Inje, Gangwon · Sinwol-ri',
  'landing.sodo.hwahoe': 'Hahoe Village',
  'landing.sodo.hwahoe_location': 'Andong · 2027',
  'landing.sodo.stat_members': 'Members',
  'landing.sodo.stat_residents': 'Residents',
  'landing.sodo.stat_elders': 'Elders',

  // Landing — Featured NIMs
  'landing.nims.title': 'FEATURED NIMS',

  // Landing — CTA
  'landing.cta.title': 'Want to join\nWind & Flow?',
  'landing.cta.description': 'You can only join through an invitation.',

  // Footer
  'footer.brand': 'W&F Network',
  'footer.quote': '"Free as the wind, flowing like water"',
  'footer.copyright': '© 2026 Wind & Flow. All rights reserved.',
  'footer.privacy': 'Privacy Policy',
  'footer.terms': 'Terms of Service',
  'footer.network': 'Network',
  'footer.community': 'Community',
  'footer.projects': 'Projects',
  'footer.opensource': 'Open Source',
  'footer.manifesto': 'Manifesto',
  'footer.protocol': 'Protocol',
  'footer.wfos': 'W&F OS',
  'footer.events': 'Events',
  'footer.members': 'Members',
  'footer.sodo': 'Sodo',
  'footer.newmoon': 'New Moon Village',
  'footer.github': 'GitHub',

  // About
  'about.title': 'About',
  'about.manifesto.label': 'Manifesto',
  'about.manifesto.title': 'Free as the wind, flowing like water.',
  'about.manifesto.p1':
    'In this land there is a profound Way called Pungryudo. It embraces the three teachings and benefits all living beings with love.',
  'about.manifesto.p2':
    'We rewrite this Pungryudo in the language of the digital age.',
  'about.manifesto.p3':
    'Using each other as mirrors, we first look within ourselves. We listen with respect and speak with love.',
  'about.manifesto.p4': 'Governance begins when we truly see one another.',

  'about.protocol.label': 'Recognition Protocol',
  'about.protocol.description':
    'Every mechanism in W&F is built upon a single verb: to see. We see existence, we see stories, we see contributions.',
  'about.protocol.detail': 'Details: Coming soon',

  'about.wfos.label': 'W&F OS',
  'about.wfos.description':
    'An open-source framework for network states. Seven domains: Identity, Membership, Relationship, Activity, Economy, Governance, Anchor.',
  'about.wfos.detail': 'Details: Coming soon',

  'about.contribute.label': 'Contribute',
  'about.contribute.description':
    'W&F is open source. You can contribute through code, design, translation, documentation, and more.',

  'about.cta': 'If you share these values, request an invite',

  // Events
  'events.title': 'Events',
  'events.upcoming': 'Upcoming Events',
  'events.past': 'Past Events',
  'events.no_upcoming': 'No upcoming events.',
  'events.no_past': 'No past events.',

  // Invite Request Modal
  'request.title': 'Request an Invite',
  'request.description': 'You can apply without an existing invitation.\nAn admin will review and contact you.',
  'request.name': 'Name',
  'request.name_placeholder': 'John Doe',
  'request.email': 'Email',
  'request.email_placeholder': 'hello@example.com',
  'request.reason': 'Reason',
  'request.reason_placeholder': 'Tell us why you want to join Wind & Flow.',
  'request.region': 'Region',
  'request.region_placeholder': 'e.g. Seoul, Andong, Tokyo',
  'request.consent': 'I agree to the principles of this community.',
  'request.submit': 'Submit',
  'request.submitting': 'Submitting...',
  'request.success_title': 'Request received',
  'request.success': 'Your request is not just a registration — it is received as an expression of intent to join a new experiment.\nWe will review and reach out in order.',
  'request.error': 'Something went wrong. Please try again.',
  'request.validation.name': 'Please enter your name.',
  'request.validation.email': 'Please enter a valid email.',
  'request.validation.reason': 'Please tell us your reason.',
  'request.validation.consent': 'Please agree to the community principles.',

  // My Page
  'my.login_prompt': 'Log in to view your passport.',
  'my.logout': 'Log out',
  'my.edit_profile': 'Edit Profile',
  'my.no_passport': 'You don\'t have a passport yet.',
  'my.issue_passport': 'Get Your Passport',

  // Passport
  'passport.nim': '',
  'passport.number': 'Passport No.',
  'passport.issued': 'Issued',
  'passport.expires': 'Expires',
  'passport.no_bio': 'No bio yet.',
  'passport.no_visa': 'No visa stamps yet.',
  'passport.no_links': 'No links registered.',
  'passport.no_bonds': 'No connections yet.',
  'passport.bonds_title': 'Connections',
  'passport.joined': 'Joined',

  // Profile Edit
  'edit.title': 'Edit Profile',
  'edit.slug': 'Handle',
  'edit.slug_placeholder': 'hahnryu',
  'edit.slug_available': 'This handle is available.',
  'edit.slug_taken': 'This handle is already taken.',
  'edit.display_name': 'Name',
  'edit.bio': 'Bio',
  'edit.bio_placeholder': 'Tell us about yourself.',
  'edit.links': 'Links',
  'edit.link_label': 'Label',
  'edit.link_url': 'URL',
  'edit.add_link': 'Add Link',
  'edit.save': 'Save',
  'edit.saving': 'Saving...',
  'edit.saved': 'Saved.',

  // Onboarding
  'onboarding.sign.title': 'Manifesto Pledge',
  'onboarding.sign.description': 'This pledge is your first step as a W&F member.\nPlease read and sign below.',
  'onboarding.sign.manifesto_title': 'Free as the wind, flowing like water.',
  'onboarding.sign.agree': 'I agree to this pledge.',
  'onboarding.sign.button': 'Sign',
  'onboarding.sign.signing': 'Signing...',
  'onboarding.sign.success': 'Pledge completed.',
  'onboarding.sign.next': 'Get Passport',

  // Invite
  'invite.title': 'My Invitations',
  'invite.remaining': 'Remaining',
  'invite.create': 'Create Invitation',
  'invite.copy': 'Copy Link',
  'invite.copied': 'Copied!',
  'invite.no_invites': 'No invitations sent yet.',
  'invite.status_pending': 'Pending',
  'invite.status_accepted': 'Accepted',
  'invite.status_expired': 'Expired',
  'invite.accept_title': 'You\'ve been invited',
  'invite.accept_description': ' has invited you to Wind & Flow.',
  'invite.accept_button': 'Accept Invitation',
  'invite.decline_button': 'Decline',
  'invite.accepting': 'Accepting...',
  'invite.accepted': 'Invitation accepted!',
  'invite.accepted_next': 'Start Onboarding',
  'invite.invalid': 'This invitation is invalid.',
  'invite.login_first': 'Please log in first to accept this invitation.',

  // Visa
  'visa.level': 'Level',
  'visa.l0': 'Observer',
  'visa.l1': 'Participant',
  'visa.l2': 'Contributor',
  'visa.l3': 'Steward',
  'visa.l4': 'Elder',

  // NIM
  'nim.title': 'Members',
  'nim.search': 'Search by name or handle',
  'nim.no_results': 'No results found.',
  'nim.empty': 'No members yet.',
  'nim.filter_all': 'All',
  'nim.filter_state': 'By Sodo',
  'nim.profile_not_found': 'Profile not found.',

  // Sodo
  'sodo.title': 'Sodo Network',
  'sodo.explore': 'Explore Sodo',
  'sodo.members_count': 'Members',
  'sodo.coming_soon': 'Coming Soon',
  'sodo.about': 'About',
  'sodo.events': 'Events',
  'sodo.invite': 'Request Invite',
  'sodo.members': 'Members',
  'sodo.no_events': 'No upcoming events.',

  // Admin
  'admin.title': 'Admin',
  'admin.dashboard': 'Dashboard',
  'admin.members': 'Members',
  'admin.content': 'Content',
  'admin.requests': 'Requests',
  'admin.reports': 'Reports',
  'admin.total_members': 'Total Members',
  'admin.total_visas': 'Visas Issued',
  'admin.pending_requests': 'Pending Requests',
  'admin.total_events': 'Events',
  'admin.no_requests': 'No pending requests.',
  'admin.approve': 'Approve',
  'admin.reject': 'Reject',
  'admin.generate_report': 'Generate Report',
  'admin.unauthorized': 'Admin access required. (L3+)',

  // Theme
  'theme.light': 'Sun',
  'theme.dark': 'Moon',

  // Locale
  'locale.ko': '한',
  'locale.en': 'EN',
};
