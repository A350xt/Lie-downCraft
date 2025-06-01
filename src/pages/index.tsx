import Link from '@docusaurus/Link'
import useDocusaurusContext from '@docusaurus/useDocusaurusContext'
import Layout from '@theme/Layout'
import clsx from 'clsx'
import React from 'react'
import HomepageFeatures from '../components/HomepageFeatures'
import styles from './index.module.css'

function HeroContent() {
  const { siteConfig } = useDocusaurusContext()
  return (
    <div className={clsx('hero', styles.heroContent)}>
      <div className="container text--center">
        <img 
          className={clsx('hero__logo', styles.heroLogo)} 
          src="/img/server-icon.webp" 
          alt="Logo" 
        />
        <h1 className="hero__title cubic-font">{siteConfig.title}</h1>
        <p className="hero__subtitle">{siteConfig.tagline}</p>
        <div className="buttons">
          <Link className="button button--secondary button--lg" to="/docs/intro">
            怎么加入？
          </Link>
        </div>
      </div>
    </div>
  )
}

function HomepageHeader({ 
  isVideoVisible, 
  setIsVideoVisible 
}: { 
  isVideoVisible: boolean 
  setIsVideoVisible: (visible: boolean) => void 
}) {
  React.useEffect(() => {
    let ticking = false
    let lastScrollTop = 0

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const scrollTop = window.scrollY || document.documentElement.scrollTop
          
          // 向下滚动超过50px隐藏视频
          if (scrollTop > 50 && lastScrollTop < scrollTop) {
            setIsVideoVisible(false)
          } 
          // 向上滚动到顶部显示视频
          else if (scrollTop <= 50) {
            setIsVideoVisible(true)
          }
          
          lastScrollTop = scrollTop
          ticking = false
        })
        ticking = true
      }
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [setIsVideoVisible])

  return (
    <header className={clsx(styles.heroBanner, !isVideoVisible && styles.scrolled)}>
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
      </div>
    </header>
  )
}

export default function Home(): JSX.Element {
  const [isVideoVisible, setIsVideoVisible] = React.useState(true)
  
  return (
    <Layout>
      {/* 全局渐变背景 - 放在Layout最外层 */}
      <div className={styles.globalBackground}>
        <HomepageHeader 
          isVideoVisible={isVideoVisible} 
          setIsVideoVisible={setIsVideoVisible} 
        />
        
        <main className={styles.mainContent}>
          {/* 滚动后显示的Hero内容 */}
          <HeroContent />
          
          {/* 功能模块 */}
          <HomepageFeatures />
        </main>
      </div>
    </Layout>
  )
}