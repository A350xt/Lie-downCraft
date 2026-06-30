import React from 'react';
import Layout from '@theme/Layout';
import AnnouncementBoard from '@site/src/components/Announcements/Announcements';

export default function AnnouncementsPage(): JSX.Element {
  return (
    <Layout title="服务器公告" description="Lie-downCraft 服务器公告与历史通知">
      <AnnouncementBoard variant="page" />
    </Layout>
  );
}
