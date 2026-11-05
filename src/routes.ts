/** Route map — one entry per Figma frame on "Page 4 Job Transition". */
export const R = {
  home: '/', //                   P0 - Home (Home tab, default landing page)
  welcome: '/welcome', //         P1 - Welcome Page (first-time entry; also where Sign out lands)
  coachGuide: '/coach/start', //  P2 - AI Coach Guiding (first-time flow, no tab bar)
  coach: '/coach', //             P2.2 - AI Coach
  strengths: '/strengths', //     P3 - User Strength
  possibilities: '/possibilities', // P4 - possibilities before choosing a job
  fit: '/fit', //                 P5 - fit comparison after choosing a job
  discover: '/discover', //       P4.2 - Explore Your Next Steps (Explore tab)
  roadmap: '/roadmap', //         P6 - My Plan tab ("My 100-Day Roadmap")
  community: '/community', //     P7 - Community
  myDay: '/community/my-day', //  P7.2 - My Day (hidden: no route, nothing links here)
  me: '/me', //                   User Page
  messages: '/messages', //       P8 - Messages
  joyaiSettings: '/joyai', //       JoyAI Settings
} as const;

export type RouteKey = keyof typeof R;

export const SCREEN_MAP: { group: string; items: { label: string; to: string; figma: string }[] }[] = [
  {
    group: 'First-time journey',
    items: [
      { label: 'Welcome', to: R.welcome, figma: 'P1 - Welcome Page' },
      { label: 'JoyAI · guided chat', to: R.coachGuide, figma: 'P2 - AI Coach Guiding' },
      { label: 'Your strengths', to: R.strengths, figma: 'P3 - User Strength' },
      { label: 'Your possibilities', to: R.possibilities, figma: 'P4' },
      { label: 'How each path fits', to: R.fit, figma: 'P5' },
    ],
  },
  {
    group: 'Everyday use',
    items: [
      { label: 'Home', to: R.home, figma: 'P0 - Home' },
      { label: 'AI Coach', to: R.coach, figma: 'P2.2 - AI Coach' },
      { label: 'Discover · next steps', to: R.discover, figma: 'P4.2' },
      { label: 'Roadmap · 100-Day Roadmap', to: R.roadmap, figma: 'P6 - Roadmap' },
      { label: 'Community', to: R.community, figma: 'P7 - Community' },
      { label: 'Messages', to: R.messages, figma: 'P8 - Messages' },
      { label: 'Me · strengths profile', to: R.me, figma: 'User Page' },
      { label: 'JoyAI settings', to: R.joyaiSettings, figma: 'JoyAI Settings' },
    ],
  },
];
