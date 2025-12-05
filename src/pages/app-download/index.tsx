import React from 'react';
import Layout from '@theme/Layout';
import styles from './styles.module.css';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';

export default function AppDownload(): JSX.Element {
  const {siteConfig} = useDocusaurusContext();
  
  // TODO: 请确保您的 APK 文件名为 tielv-log-dev.apk 并放置在 static/app/ 目录下
  const downloadLink = '/app/tielv-log-dev.apk'; 

  return (
    <Layout
      title="APP 下载"
      description="下载铁旅日志 APP">
      <main className={styles.container}>
        <h1 className={styles.title}>铁旅日志</h1>
        <p className={styles.subtitle}>您的铁路旅程伴侣</p>
        
        <div className={styles.downloadSection}>
          <h2>Android 版下载</h2>
          <div className={styles.versionInfo}>
            <p>当前版本：开发预览版</p>
            <p>适用平台：Android</p>
          </div>
          
          <a href={downloadLink} className={styles.downloadButton}>
            立即下载 (.apk)
          </a>
          
          <p className={styles.note}>
            注意：目前仅提供安卓开发版，功能可能尚不完善。
          </p>
        </div>
      </main>
    </Layout>
  );
}
