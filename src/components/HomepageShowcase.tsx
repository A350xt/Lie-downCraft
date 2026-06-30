import Link from '@docusaurus/Link';
import Footer from '@theme/Footer';
import clsx from 'clsx';
import React from 'react';
import rawAnnouncements from '@site/src/data/announcements.json';
import galleryDataRaw from '@site/src/data/gallery.json';
import {
  ANNOUNCEMENT_CATEGORY_META,
  getActiveAnnouncements,
  type Announcement,
} from '@site/src/utils/announcements';
import styles from './HomepageShowcase.module.css';

interface FeatureCard {
  title: string;
  subtitle: string;
  description: string;
  image: string;
  href: string;
  cta: string;
  tone: 'coral' | 'magenta' | 'blue' | 'purple';
}

interface QuickLink {
  title: string;
  description: string;
  href: string;
  cta: string;
  download?: boolean;
  external?: boolean;
}

interface StatItem {
  value: string;
  label: string;
  description: string;
}

interface GalleryImage {
  src: string;
  alt: string;
}

interface GalleryItem {
  id: string;
  title: string;
  description: string;
  images: GalleryImage[];
}

interface SmartLinkProps {
  href: string;
  className: string;
  children: React.ReactNode;
  external?: boolean;
  download?: boolean;
  ariaLabel?: string;
}

const announcements = rawAnnouncements as Announcement[];
const galleryData = galleryDataRaw as GalleryItem[];

const featureCards: FeatureCard[] = [
  {
    title: '休闲养老',
    subtitle: 'Slow Survival',
    description: '把节奏放慢，留出时间修一条路、补一段墙、坐在篝火边看天亮。',
    image: '/img/Campfire_JE2_BE2.gif',
    href: '/timeline',
    cta: '看成长足迹',
    tone: 'coral',
  },
  {
    title: '纯净原版',
    subtitle: 'Vanilla First',
    description: '不靠模组堆体验，保留 Minecraft 原版的探索、建造和协作手感。',
    image: '/img/GrassBlock.png',
    href: '/docs/intro',
    cta: '阅读加入指南',
    tone: 'magenta',
  },
  {
    title: '红石工程',
    subtitle: 'Redstone Works',
    description: '从小型机关到生电玩法，让机器、建筑与日常生产连成系统。',
    image: '/img/Redstone.webp',
    href: '/gallery',
    cta: '浏览服务器风光',
    tone: 'blue',
  },
  {
    title: '社区共建',
    subtitle: 'Built Together',
    description: '每位玩家都在地图上留下痕迹，也把服务器历史写成一段段记录。',
    image: '/img/newicon.png',
    href: '/members/total',
    cta: '查看玩家列表',
    tone: 'purple',
  },
];

const quickLinks: QuickLink[] = [
  {
    title: '下载客户端',
    description: '下载已整理的客户端压缩包，按加入指南完成账号与登录准备。',
    href: 'pathname:///download/client.zip',
    cta: '下载客户端',
    download: true,
  },
  {
    title: '玩家列表',
    description: '查看服务器成员与他们留下的建设记录。',
    href: '/members/total',
    cta: '查看成员',
  },
  {
    title: '数据统计',
    description: '查看在线时长、登录天数等服务器活动数据。',
    href: '/docs/activity/玩家在线时长',
    cta: '查看数据',
  },
  {
    title: '近期计划',
    description: '查看服务器建设、网页内容和客户端维护的公开计划。',
    href: '/todo-list',
    cta: '查看计划',
  },
];

const stats: StatItem[] = [
  {
    value: '2022',
    label: '开始记录',
    description: '从第一份历史日记开始，服务器持续保留建设轨迹。',
  },
  {
    value: '二周目',
    label: '二周目进行中',
    description: '新地图、新工程和新的社区生活正在展开。',
  },
  {
    value: '原版',
    label: '原版生存',
    description: '核心体验保持纯净，让协作和创造成为主角。',
  },
];

function SmartLink({
  href,
  className,
  children,
  download = false,
  external = false,
  ariaLabel,
}: SmartLinkProps): JSX.Element {
  if (external) {
    return (
      <a
        aria-label={ariaLabel}
        className={className}
        href={href}
        rel={external ? 'noreferrer' : undefined}
        target={external ? '_blank' : undefined}
      >
        {children}
      </a>
    );
  }

  return (
    <Link
      aria-label={ariaLabel}
      className={className}
      download={download || undefined}
      to={href}
    >
      {children}
    </Link>
  );
}

function formatDate(date: string): string {
  const [year, month, day] = date.split('-');

  return `${year}.${month}.${day}`;
}

function StorySection(): JSX.Element {
  return (
    <section
      className={clsx(styles.snapPage, styles.storySection)}
      aria-labelledby="homepage-story-title"
    >
      <div className={styles.storyText}>
        <h2 id="homepage-story-title">可以慢下来建造的原版服务器</h2>
        <p>
          Lie-downCraft 是一个以原版生存、红石工程和长期建设为核心的 Minecraft 服务器。
          这里整理了公告、加入指南、网页地图、时间线和画廊，方便新老玩家找到需要的信息。
        </p>
        <div className={styles.ctaRow}>
          <Link className={styles.primaryButton} to="/docs/intro">
            如何加入
          </Link>
          <a
            className={styles.secondaryButton}
            href="http://map.lie-downcraft.cn/"
            rel="noreferrer"
            target="_blank"
          >
            查看网页地图
          </a>
        </div>
      </div>
      <div className={styles.statGrid} aria-label="服务器概览">
        {stats.map(stat => (
          <div className={styles.statItem} key={stat.label}>
            <strong>{stat.value}</strong>
            <span>{stat.label}</span>
            <p>{stat.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function FeatureMatrix(): JSX.Element {
  return (
    <section
      className={clsx(styles.snapPage, styles.sectionBlock)}
      aria-labelledby="homepage-feature-title"
    >
      <div className={styles.sectionHeader}>
        <h2 id="homepage-feature-title">服务器的四种气质</h2>
        <p>从玩法、资料和社区记录进入服务器的不同侧面。</p>
      </div>
      <div className={styles.productMatrix}>
        {featureCards.map((card, index) => (
          <Link
            className={clsx(styles.productCard, styles[card.tone])}
            key={card.title}
            to={card.href}
          >
            <span className={styles.cardIndex}>{String(index + 1).padStart(2, '0')}</span>
            <img className={styles.productImage} src={card.image} alt="" loading="lazy" />
            <div className={styles.productCopy}>
              <span>{card.subtitle}</span>
              <h3>{card.title}</h3>
              <p>{card.description}</p>
              <strong>{card.cta}</strong>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}

function AnnouncementPreview(): JSX.Element {
  const latestAnnouncements = getActiveAnnouncements(announcements).slice(0, 3);

  return (
    <section className={styles.panel} aria-labelledby="homepage-announcements-title">
      <div className={styles.panelHeader}>
        <div>
          <h2 id="homepage-announcements-title">服务器公告</h2>
          <p>维护安排、活动通知和规则调整会在这里同步。</p>
        </div>
        <Link className={styles.textLink} to="/announcements">
          查看全部
        </Link>
      </div>

      {latestAnnouncements.length > 0 ? (
        <div className={styles.announcementList}>
          {latestAnnouncements.map(announcement => {
            const categoryMeta = ANNOUNCEMENT_CATEGORY_META[announcement.category];

            return (
              <article className={styles.announcementItem} key={announcement.id}>
                <div className={styles.announcementMeta}>
                  <span className={clsx(styles.category, styles[categoryMeta.tone])}>
                    {categoryMeta.label}
                  </span>
                  <time dateTime={announcement.date}>{formatDate(announcement.date)}</time>
                </div>
                <h3>{announcement.title}</h3>
                <p>{announcement.summary}</p>
              </article>
            );
          })}
        </div>
      ) : (
        <div className={styles.emptyAnnouncements}>
          <strong>暂无最新公告</strong>
          <p>当前没有需要特别同步的事项。后续维护、活动或规则调整会在这里更新。</p>
        </div>
      )}
    </section>
  );
}

function QuickEntryPanel(): JSX.Element {
  return (
    <section className={styles.panel} aria-labelledby="homepage-quick-links-title">
      <div className={styles.panelHeader}>
        <div>
          <h2 id="homepage-quick-links-title">快速入口</h2>
          <p>常用资料和工具入口集中在这里。</p>
        </div>
      </div>
      <div className={styles.quickList}>
        {quickLinks.map(link => (
          <SmartLink
            className={styles.quickLink}
            download={link.download}
            external={link.external}
            href={link.href}
            key={link.title}
          >
            <span>
              <strong>{link.title}</strong>
              <small>{link.description}</small>
            </span>
            <em>{link.cta}</em>
          </SmartLink>
        ))}
      </div>
    </section>
  );
}

function OperationsSection(): JSX.Element {
  return (
    <section className={styles.snapPage} aria-label="公告与快速入口">
      <div className={styles.operationsGrid}>
        <AnnouncementPreview />
        <QuickEntryPanel />
      </div>
    </section>
  );
}

function GallerySection(): JSX.Element {
  const featuredGallery = galleryData.slice(0, 3);

  return (
    <section
      className={clsx(styles.snapPage, styles.sectionBlock, styles.galleryPage)}
      aria-labelledby="homepage-gallery-title"
    >
      <div className={styles.sectionHeader}>
        <div>
          <h2 id="homepage-gallery-title">风光画廊</h2>
          <p>精选服务器中的建筑、工程和日常风景，保留值得回看的建设片段。</p>
        </div>
        <Link className={styles.textLink} to="/gallery">
          打开画廊
        </Link>
      </div>
      <div className={styles.galleryGrid}>
        {featuredGallery.map(item => {
          const image = item.images[0];

          return (
            <Link
              className={styles.galleryCard}
              key={item.id}
              to="/gallery"
            >
              <img src={image.src} alt={image.alt} />
              <span>
                <strong>{item.title}</strong>
                <small>{item.description}</small>
              </span>
            </Link>
          );
        })}
      </div>
    </section>
  );
}

function FinalCta(): JSX.Element {
  return (
    <section
      className={clsx(styles.snapPage, styles.endingSection)}
      aria-labelledby="homepage-final-cta-title"
    >
      <div className={styles.finalCta}>
        <div>
          <h2 id="homepage-final-cta-title">找个地方安顿下来，然后开始建造</h2>
          <p>先阅读加入指南，或打开网页地图看看大家已经建出的世界。</p>
        </div>
        <div className={styles.ctaRow}>
          <Link className={styles.lightButton} to="/docs/intro">
            加入服务器
          </Link>
          <a
            className={styles.ghostButton}
            href="http://map.lie-downcraft.cn/"
            rel="noreferrer"
            target="_blank"
          >
            查看网页地图
          </a>
        </div>
      </div>
      <div className={styles.endingFooter}>
        <Footer />
      </div>
    </section>
  );
}

export default function HomepageShowcase(): JSX.Element {
  return (
    <div className={styles.showcase}>
      <div className={styles.inner}>
        <StorySection />
        <FeatureMatrix />
        <OperationsSection />
        <GallerySection />
        <FinalCta />
      </div>
    </div>
  );
}
