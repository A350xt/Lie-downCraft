import React from 'react';
import AllPlayersList from '@site/src/components/AllPlayersList';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import styles from './members.module.css';

export default function MembersPage(): JSX.Element {
  const { siteConfig } = useDocusaurusContext();

  return (
    <Layout title="成员列表" description="各领域优秀成员共创了服务器精彩纪录">
      <div className={styles.membersContainer}>
        <div className={styles.membersContent}>
          <div className={styles.title}>
            <strong>成员列表</strong>
          </div>
          <div className={styles.subtitle}>
            各领域优秀成员共创了服务器精彩纪录
          </div>
          <AllPlayersList />
        </div>
      </div>
    </Layout>
  );
}