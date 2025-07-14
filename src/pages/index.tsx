import useDocusaurusContext from '@docusaurus/useDocusaurusContext'
import Layout from '@theme/Layout'
import clsx from 'clsx'
import React, { useState, useEffect } from 'react'
import HomepageFeatures from '../components/HomepageFeatures'
import styles from './index.module.css'
import { intervalToDuration, Duration } from 'date-fns'

// 类型定义
interface TimeDuration extends Duration {
  years?: number
  months?: number
  days?: number
  hours?: number
  minutes?: number
  seconds?: number
}

// 自定义 Hook：计算时间差（带类型注解）
function useElapsedTime(startDate: Date): TimeDuration {
  const [duration, setDuration] = useState<TimeDuration>(
    intervalToDuration({
      start: startDate,
      end: new Date(),
    })
  )

  useEffect(() => {
    const timer = setInterval(() => {
      setDuration(
        intervalToDuration({
          start: startDate,
          end: new Date(),
        })
      )
    }, 1000)

    return () => clearInterval(timer)
  }, [startDate])

  return duration
}

// 主标题与副标题组件（使用 React.FC 类型）
const HeroContent: React.FC = () => {
  const { siteConfig } = useDocusaurusContext()

  const startDate = new Date('2022-10-27T20:00:00')
  const duration = useElapsedTime(startDate)

  return (
    <div className={styles.heroTextOverlay}>
      <h1 className="hero__title cubic-font">{siteConfig.title}</h1>
      <p className="hero__subtitle">{siteConfig.tagline}</p>
      <p className="hero__time">
        已经存在 
        {duration.years || 0}年 
        {duration.months || 0}月 
        {duration.days || 0}天 
        {duration.hours || 0}小时 
        {duration.minutes || 0}分钟 
        {duration.seconds || 0}秒
      </p>
    </div>
  )
}

// 视频背景 + 遮罩 + 文字内容
const HomepageHeader: React.FC = () => {
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

// 主页面组件（显式声明返回类型）
const Home: React.FC = (): JSX.Element => {
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

export default Home