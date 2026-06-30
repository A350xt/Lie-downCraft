import assert from 'node:assert/strict';
import {
  CATEGORY_OPTIONS,
  getActiveAnnouncements,
  getArchivedAnnouncements,
  sortAnnouncements,
  type Announcement,
} from './announcements';

const referenceDate = new Date('2026-06-27T12:00:00+08:00');

const announcements: Announcement[] = [
  {
    id: 'older-notice',
    title: 'Older notice',
    date: '2026-06-20',
    category: 'notice',
    summary: 'Older summary',
    body: ['Older body'],
  },
  {
    id: 'pinned-rule',
    title: 'Pinned rule',
    date: '2026-06-01',
    category: 'rule',
    summary: 'Pinned summary',
    body: ['Pinned body'],
    pinned: true,
  },
  {
    id: 'newer-event',
    title: 'Newer event',
    date: '2026-06-25',
    category: 'event',
    summary: 'Newer summary',
    body: ['Newer body'],
  },
  {
    id: 'expired-maintenance',
    title: 'Expired maintenance',
    date: '2026-06-26',
    category: 'maintenance',
    summary: 'Expired summary',
    body: ['Expired body'],
    expiresAt: '2026-06-26',
  },
];

assert.deepEqual(
  sortAnnouncements(announcements).map(announcement => announcement.id),
  ['pinned-rule', 'expired-maintenance', 'newer-event', 'older-notice'],
);

assert.deepEqual(
  getActiveAnnouncements(announcements, referenceDate).map(announcement => announcement.id),
  ['pinned-rule', 'newer-event', 'older-notice'],
);

assert.deepEqual(
  getArchivedAnnouncements(announcements, referenceDate).map(announcement => announcement.id),
  ['expired-maintenance'],
);

assert.deepEqual(
  CATEGORY_OPTIONS.map(category => category.value),
  ['all', 'maintenance', 'event', 'rule', 'notice'],
);
