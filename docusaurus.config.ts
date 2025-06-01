import {themes as prismThemes} from 'prism-react-renderer';
import type {Config} from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

const config: Config = {
  title: 'Lie-downCraft',
  tagline: 'a place for liedowners',
  favicon: 'img/favicon.ico',

  // Set the production url of your site here
  url: 'https://lie-downcraft.cn',
  // Set the /<baseUrl>/ pathname under which your site is served
  // For GitHub pages deployment, it is often '/<projectName>/'
  baseUrl: '/',

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: 'A350_ti', // Usually your GitHub org/user name.
  projectName: 'Lie-downCraft', // Usually your repo name.

  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',

  // Even if you don't use internationalization, you can use this field to set
  // useful metadata like html lang. For example, if your site is Chinese, you
  // may want to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: 'zh-Hans',
    locales: ['zh-Hans'],
  },

  presets: [
    [
      'classic',
      {
        docs: {
          sidebarPath: './sidebars.ts',
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          editUrl:
            'https://github.com/A350xt/Lie-downCraft',
        },
        blog: {
          showReadingTime: true,
          feedOptions: {
            type: ['rss', 'atom'],
            xslt: true,
          },
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          editUrl:
            'https://github.com/A350xt/Lie-downCraft',
          // Useful options to enforce blogging best practices
          onInlineTags: 'warn',
          onInlineAuthors: 'warn',
          onUntruncatedBlogPosts: 'warn',
        },
        theme: {
          customCss: './src/css/custom.css',
        },
      } satisfies Preset.Options,
    ],
  ],
  themeConfig: {
    // Replace with your project's social card
    image: 'img/docusaurus-social-card.jpg',
    navbar: {
      title: 'Lie-downCraft',
      logo: {
        alt: 'Lie-downCraft Logo',
        src: 'img/server-icon.png',
      },
      items: [
        {
          type: 'docSidebar',
          sidebarId: 'tutorialSidebar',
          position: 'left',
          label: '指南',
        },
        {
          type: 'docSidebar',
          sidebarId: 'history',
          position: 'left',
          label: '历史',
        },
        {
          type: 'docSidebar',
          sidebarId: 'activity',
          position: 'left',
          label: '活跃统计',
        },        		
        {to: '/blog', label: '一些碎碎念', position: 'left'},
		    {
            to: 'http://map.lie-downcraft.cn/',
            label: '网页地图',
            position: 'left',
        },
        {
          href: 'https://github.com/A350xt/Lie-downCraft',
          label: 'GitHub',
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'light',
      links: [
        {
          title: 'Docs',
          items: [
            {
              label: '指南',
              to: '/docs/intro',
            },
			      {
              label: '历史',
              to: '/docs/introduction',
            },
            {
              label: '活跃统计',
              to: '/docs/activity/玩家在线时长',
            }
          ],
        },
        {
          title: '友情链接',
          items: [
            {
              label: 'Littleskin',
              href: 'https://littleskin.cn/',
            },
            {
              label: 'Starry Sakura Craft',
              href: 'http://sscraft.natapp1.cc/',
            },
          ],
        },
        {
          title: 'More',
          items: [
            {
              label: '更新日志',
              to: '/blog',
            },
            {
              label: 'GitHub',
              href: 'https://github.com/A350xt/Lie-downCraft',
            },
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} Lie-downCraft Project, Inc. Built with Docusaurus.`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
