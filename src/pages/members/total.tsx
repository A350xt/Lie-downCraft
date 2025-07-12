import React from 'react';
import AllPlayersList from '@site/src/components/AllPlayersList';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';

export default function MembersPage(): JSX.Element {
  const { siteConfig } = useDocusaurusContext();

  return (
    <Layout title="成员列表" description="各领域优秀成员共创了服务器精彩纪录">
      <React.Fragment>
        <div style={{ textAlign: 'center', fontSize: '48px' }}>
          <strong>成员列表</strong>
        </div>
        <div style={{ textAlign: 'center', fontSize: '24px' }}>
          各领域优秀成员共创了服务器精彩纪录
        </div>
        <AllPlayersList />
      </React.Fragment>
    </Layout>
  );
}