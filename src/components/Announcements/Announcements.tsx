import Link from '@docusaurus/Link';
import clsx from 'clsx';
import React, { useMemo, useState } from 'react';
import rawAnnouncements from '@site/src/data/announcements.json';
import {
  ANNOUNCEMENT_CATEGORY_META,
  CATEGORY_OPTIONS,
  filterAnnouncementsByCategory,
  getActiveAnnouncements,
  getArchivedAnnouncements,
  type Announcement,
  type AnnouncementCategoryFilter,
} from '@site/src/utils/announcements';
import styles from './Announcements.module.css';

const announcements = rawAnnouncements as Announcement[];

interface AnnouncementBoardProps {
  variant: 'home' | 'page';
  limit?: number;
}

function formatDate(date: string): string {
  const [year, month, day] = date.split('-');

  return `${year}年${Number(month)}月${Number(day)}日`;
}

function EmptyState({ children }: { children: React.ReactNode }): JSX.Element {
  return <div className={styles.emptyState}>{children}</div>;
}

function AnnouncementCard({ announcement }: { announcement: Announcement }): JSX.Element {
  const [expanded, setExpanded] = useState(false);
  const categoryMeta = ANNOUNCEMENT_CATEGORY_META[announcement.category];
  const hasBody = announcement.body.length > 0;

  return (
    <article className={clsx(styles.card, announcement.pinned && styles.pinned)}>
      <div className={styles.cardMeta}>
        <span className={clsx(styles.category, styles[categoryMeta.tone])}>
          {categoryMeta.label}
        </span>
        {announcement.pinned && <span className={styles.pin}>置顶</span>}
        <time dateTime={announcement.date}>{formatDate(announcement.date)}</time>
      </div>

      <h3 className={styles.cardTitle}>{announcement.title}</h3>
      <p className={styles.summary}>{announcement.summary}</p>

      {expanded && hasBody && (
        <div className={styles.body}>
          {announcement.body.map((paragraph, index) => (
            <p key={`${announcement.id}-paragraph-${index}`}>{paragraph}</p>
          ))}
        </div>
      )}

      <div className={styles.actions}>
        {hasBody && (
          <button
            className={styles.textButton}
            type="button"
            onClick={() => setExpanded(current => !current)}
          >
            {expanded ? '收起详情' : '展开详情'}
          </button>
        )}
        {announcement.link && (
          <Link className={styles.linkButton} to={announcement.link}>
            查看相关页面
          </Link>
        )}
      </div>
    </article>
  );
}

function AnnouncementList({
  announcements: list,
  emptyText,
}: {
  announcements: Announcement[];
  emptyText: string;
}): JSX.Element {
  if (list.length === 0) {
    return <EmptyState>{emptyText}</EmptyState>;
  }

  return (
    <div className={styles.list}>
      {list.map(announcement => (
        <AnnouncementCard announcement={announcement} key={announcement.id} />
      ))}
    </div>
  );
}

export default function AnnouncementBoard({
  variant,
  limit = 3,
}: AnnouncementBoardProps): JSX.Element {
  const [filter, setFilter] = useState<AnnouncementCategoryFilter>('all');

  const activeAnnouncements = useMemo(
    () => getActiveAnnouncements(announcements),
    [],
  );
  const archivedAnnouncements = useMemo(
    () => getArchivedAnnouncements(announcements),
    [],
  );

  if (variant === 'home') {
    const latestAnnouncements = activeAnnouncements.slice(0, limit);

    return (
      <section className={clsx(styles.section, styles.homeSection)}>
        <div className={styles.inner}>
          <div className={styles.headingRow}>
            <div>
              <p className={styles.kicker}>公告</p>
              <h2 className={styles.title}>服务器公告</h2>
            </div>
            <Link className={styles.allLink} to="/announcements">
              查看全部
            </Link>
          </div>

          <AnnouncementList announcements={latestAnnouncements} emptyText="暂无最新公告" />
        </div>
      </section>
    );
  }

  const filteredActive = filterAnnouncementsByCategory(activeAnnouncements, filter);
  const filteredArchived = filterAnnouncementsByCategory(archivedAnnouncements, filter);

  return (
    <div className={clsx(styles.section, styles.pageSection)}>
      <div className={styles.inner}>
        <header className={styles.pageHeader}>
          <p className={styles.kicker}>公告中心</p>
          <h1 className={styles.pageTitle}>服务器公告</h1>
          <p className={styles.subtitle}>维护安排、活动通知、规则调整与重要说明都会在这里保留。</p>
        </header>

        <div className={styles.filters} aria-label="公告分类筛选">
          {CATEGORY_OPTIONS.map(option => (
            <button
              className={clsx(styles.filterButton, filter === option.value && styles.activeFilter)}
              key={option.value}
              aria-pressed={filter === option.value}
              type="button"
              onClick={() => setFilter(option.value)}
            >
              {option.label}
            </button>
          ))}
        </div>

        <section className={styles.group}>
          <h2 className={styles.groupTitle}>当前公告</h2>
          <AnnouncementList announcements={filteredActive} emptyText="当前没有需要同步的公告" />
        </section>

        <section className={styles.group}>
          <h2 className={styles.groupTitle}>历史公告</h2>
          <AnnouncementList announcements={filteredArchived} emptyText="暂未归档历史公告" />
        </section>
      </div>
    </div>
  );
}
