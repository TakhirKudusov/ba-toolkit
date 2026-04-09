// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

// Site lives at https://takhirkudusov.github.io/ba-toolkit/ on GitHub Pages.
// `site` is the canonical origin; `base` is the subpath the project is hosted under.
export default defineConfig({
  site: 'https://takhirkudusov.github.io',
  base: '/ba-toolkit',
  integrations: [
    starlight({
      title: 'BA Toolkit',
      description:
        'AI-powered Business Analyst pipeline — concept to a phase-and-DAG implementation plan an AI coding agent can execute. 24 skills, 12 domains, zero runtime dependencies. Works with Claude Code, Codex CLI, Gemini CLI, Cursor, and Windsurf.',
      // Social links shown in the header. Per Starlight 0.30+ this is an
      // array of { icon, label, href } objects.
      social: [
        {
          icon: 'github',
          label: 'GitHub',
          href: 'https://github.com/TakhirKudusov/ba-toolkit',
        },
        {
          icon: 'seti:npm',
          label: 'npm',
          href: 'https://www.npmjs.com/package/@kudusov.takhir/ba-toolkit',
        },
        {
          icon: 'linkedin',
          label: 'LinkedIn',
          href: 'https://www.linkedin.com/in/takhirkudusov',
        },
      ],
      editLink: {
        baseUrl:
          'https://github.com/TakhirKudusov/ba-toolkit/edit/main/website/src/content/docs/',
      },
      sidebar: [
        { label: 'Home', link: '/' },
        { label: 'Getting started', link: '/getting-started/' },
        {
          label: 'Documentation',
          items: [
            { label: 'Usage guide', link: '/usage/' },
            { label: 'Command reference', link: '/commands/' },
            { label: 'FAQ', link: '/faq/' },
            { label: 'Domain references', link: '/domains/' },
            { label: 'Troubleshooting', link: '/troubleshooting/' },
          ],
        },
        { label: 'Roadmap', link: '/roadmap/' },
        { label: 'Changelog', link: '/changelog/' },
      ],
      customCss: ['./src/styles/custom.css'],
      lastUpdated: true,
      pagination: true,
    }),
  ],
});
