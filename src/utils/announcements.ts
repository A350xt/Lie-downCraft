export type AnnouncementCategory = 'maintenance' | 'event' | 'rule' | 'notice';

export interface Announcement {
  id: string;
  title: string;
  date: string;
  category: AnnouncementCategory;
  summary: string;
  body: string[];
  pinned?: boolean;
  expiresAt?: string;
  link?: string;
}

export interface AnnouncementCategoryMeta {
  label: string;
  tone: AnnouncementCategory;
}

export type AnnouncementCategoryFilter = 'all' | AnnouncementCategory;

export const ANNOUNCEMENT_CATEGORY_META: Record<AnnouncementCategory, AnnouncementCategoryMeta> = {
  maintenance: {
    label: '维护',
    tone: 'maintenance',
  },
  event: {
    label: '活动',
    tone: 'event',
  },
  rule: {
    label: '规则',
    tone: 'rule',
  },
  notice: {
    label: '通知',
    tone: 'notice',
  },
};

export const CATEGORY_OPTIONS: Array<{
  value: AnnouncementCategoryFilter;
  label: string;
}> = [
  { value: 'all', label: '全部' },
  { value: 'maintenance', label: ANNOUNCEMENT_CATEGORY_META.maintenance.label },
  { value: 'event', label: ANNOUNCEMENT_CATEGORY_META.event.label },
  { value: 'rule', label: ANNOUNCEMENT_CATEGORY_META.rule.label },
  { value: 'notice', label: ANNOUNCEMENT_CATEGORY_META.notice.label },
];

function toDateKey(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
}

export function isAnnouncementExpired(
  announcement: Announcement,
  referenceDate: Date = new Date(),
): boolean {
  if (!announcement.expiresAt) {
    return false;
  }

  return toDateKey(referenceDate) > announcement.expiresAt;
}

export function sortAnnouncements(announcements: Announcement[]): Announcement[] {
  return [...announcements].sort((left, right) => {
    const pinnedDifference = Number(Boolean(right.pinned)) - Number(Boolean(left.pinned));

    if (pinnedDifference !== 0) {
      return pinnedDifference;
    }

    const dateDifference = right.date.localeCompare(left.date);

    if (dateDifference !== 0) {
      return dateDifference;
    }

    return left.title.localeCompare(right.title, 'zh-Hans');
  });
}

export function getActiveAnnouncements(
  announcements: Announcement[],
  referenceDate: Date = new Date(),
): Announcement[] {
  return sortAnnouncements(
    announcements.filter(announcement => !isAnnouncementExpired(announcement, referenceDate)),
  );
}

export function getArchivedAnnouncements(
  announcements: Announcement[],
  referenceDate: Date = new Date(),
): Announcement[] {
  return sortAnnouncements(
    announcements.filter(announcement => isAnnouncementExpired(announcement, referenceDate)),
  );
}

export function filterAnnouncementsByCategory(
  announcements: Announcement[],
  category: AnnouncementCategoryFilter,
): Announcement[] {
  if (category === 'all') {
    return announcements;
  }

  return announcements.filter(announcement => announcement.category === category);
}
