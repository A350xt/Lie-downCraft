import clsx from 'clsx'
import React from 'react'
import styles from './HomepageFeatures.module.css'

interface FeatureItem {
  title: string
  image: string
  description: JSX.Element
  buttonText: string
  buttonLink: string
}

const FeatureList: FeatureItem[] = [
  {
    title: '🔥 休闲养老',
    image: '/img/Campfire_JE2_BE2.gif',
    description: (
      <>
        <strong>远离快节奏生活的喧嚣</strong>
        <br />
        这里没有紧张的截止日期和繁重的KPI
        <br />
        在方块世界中找到内心的宁静
        <br />
        <em>非常适合放松心情，享受慢生活</em>
      </>
    ),
    buttonText: '成长足迹',
    buttonLink: '/timeline',
  },
  {
    title: '🌱 纯净原版',
    image: '/img/GrassBlock.png',
    description: (
      <>
        <strong>体验最纯粹的Minecraft魅力</strong>
        <br />
        无MOD，无插件干扰的原汁原味
        <br />
        回归游戏本源，感受经典乐趣
        <br />
        <em>整合包玩多了，还是原版最舒服</em>
      </>
    ),
    buttonText: '如何加入',
    buttonLink: '/docs/intro',
  },
  {
    title: '⚡ 红石科技',
    image: '/img/Redstone.webp',
    description: (
      <>
        <strong>探索无限的红石可能性</strong>
        <br />
        原版生电技术的创新乐园
        <br />
        从简单机械到复杂自动化
        <br />
        <br />
        <em>让你的创意在红石中闪闪发光</em>
      </>
    ),
    buttonText: '服务器风光',
    buttonLink: '/gallery',
  },
]

function Feature({ title, image, description, buttonText, buttonLink }: FeatureItem) {
  // 将标题分解为emoji和文字部分
  const emoji = title.split(' ')[0];
  const text = title.split(' ').slice(1).join(' ');
  
  return (
    <div className={clsx('col col--4')}>
      <div className={styles.featureCard}>
        <div className="text--center">
          <img className={styles.featureSvg} alt={title} src={image} />
        </div>
        <div className="text--center padding-horiz--md">
          <h3 className={styles.featureTitle}>
            <span className={styles.emoji}>{emoji}</span>
            <span className={styles.text}>{text}</span>
          </h3>
          <p className={styles.featureDescription}>{description}</p>
          <a href={buttonLink} className={styles.featureButton}>
            {buttonText}
          </a>
        </div>
      </div>
    </div>
  )
}

export default function HomepageFeatures(): JSX.Element {
  return (
    <section className={styles.features}>
      <div className="container">
        <div className="row">
          {FeatureList.map(props => (
            <Feature {...props} key={props.title} />
          ))}
        </div>
      </div>
    </section>
  )
}
