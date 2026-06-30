import useDocusaurusContext from '@docusaurus/useDocusaurusContext'
import Layout from '@theme/Layout'
import React, { useState, useEffect } from 'react'
import HomepageShowcase from '../components/HomepageShowcase'
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

const SERVER_START_DATE = new Date('2022-10-27T20:00:00')

// 自定义 Hook：计算时间差（带类型注解）
function useElapsedTime(startDate: Date): TimeDuration | null {
  const [duration, setDuration] = useState<TimeDuration | null>(null)

  useEffect(() => {
    const updateDuration = () => {
      setDuration(
        intervalToDuration({
          start: startDate,
          end: new Date(),
        })
      )
    }

    updateDuration()
    const timer = setInterval(() => {
      updateDuration()
    }, 1000)

    return () => clearInterval(timer)
  }, [startDate])

  return duration
}

// 主标题与副标题组件（使用 React.FC 类型）
const HeroContent: React.FC = () => {
  const { siteConfig } = useDocusaurusContext()

  const duration = useElapsedTime(SERVER_START_DATE)

  return (
    <div className={styles.heroTextOverlay}>
      <h1 className="hero__title cubic-font">{siteConfig.title}</h1>
      <p className="hero__subtitle">{siteConfig.tagline}</p>
      <p className="hero__time">
        {duration
          ? (
            <>
              已经存在
              {' '}
              {duration.years || 0}年
              {' '}
              {duration.months || 0}月
              {' '}
              {duration.days || 0}天
              {' '}
              {duration.hours || 0}小时
              {' '}
              {duration.minutes || 0}分钟
              {' '}
              {duration.seconds || 0}秒
            </>
          )
          : '正在计算服务器存在时间...'}
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
    <Layout noFooter>
      {/* 全局渐变背景容器 */}
      <div className={`${styles.globalBackground} ${styles.homeScrollViewport}`}>
        {/* 非固定视频背景 */}
        <HomepageHeader />

        {/* 可滚动的主内容区域 */}
        <main className={styles.mainContent}>
          <HomepageShowcase />
        </main>
      </div>
    </Layout>
  )
}

export default Home
