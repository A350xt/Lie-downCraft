import useDocusaurusContext from '@docusaurus/useDocusaurusContext'
import Layout from '@theme/Layout'
import clsx from 'clsx'
import React from 'react'
import HomepageFeatures from '../components/HomepageFeatures'
import styles from './index.module.css'

// 主标题与副标题组件
function HeroContent() {
  const { siteConfig } = useDocusaurusContext()
  return (
    <div className={styles.heroTextOverlay}>
      <h1 className="hero__title cubic-font">{siteConfig.title}</h1>
      <p className="hero__subtitle">{siteConfig.tagline}</p>
    </div>
  )
}

// 视频背景 + 遮罩 + 文字内容
function HomepageHeader() {
  return (
    <header className={styles.heroBanner}>
      <div className={styles.videoContainer}>
        <video
          className={styles.heroVideo}
          autoPlay
          loop
          muted
          playsInline
        >
          <source src="/img/video.mp4" type="video/mp4" />
          您的浏览器不支持视频播放。
        </video>

        {/* 黑色遮罩层 */}
        <div className={styles.videoOverlay}></div>

        {/* 视频上方的文字内容 */}
        <HeroContent />
      </div>
    </header>
  )
}

// 主页面组件
export default function Home(): JSX.Element {
  return (
    <Layout>
      {/* 全局渐变背景容器 */}
      <div className={styles.globalBackground}>
        {/* 非固定视频背景 */}
        <HomepageHeader />

        {/* 可滚动的主内容区域 */}
        <main className={styles.mainContent}>
          {/* 功能模块组件 */}
          <HomepageFeatures />
        </main>
      </div>
    </Layout>
  )
}