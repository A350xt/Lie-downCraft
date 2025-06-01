import clsx from 'clsx'
import React from 'react'
import styles from './HomepageFeatures.module.css'

interface FeatureItem {
  title: string
  image: string
  description: JSX.Element
}

const FeatureList: FeatureItem[] = [
  {
    title: '养老养老',
    image: '/img/Campfire_JE2_BE2.gif',
    description: (
      <>
        这里没有快节奏生活的ddl和kpi
        <br />
        非常适合养老与放松心情
      </>
    ),
  },
  {
    title: '原版原版',
    image: '/img/GrassBlock.png',
    description: (
      <>
        提供一流的原版游戏体验
        <br />
        整合包玩多了还是原版舒服吧
      </>
    ),
  },
  {
    title: '红石红石',
    image: '/img/Redstone.webp',
    description: (
      <>
        原版生电服务器
        <br />
        更多生电技术等待你的产出
      </>
    ),
  },
]

function Feature({ title, image, description }: FeatureItem) {
  return (
    <div className={clsx('col col--4')}>
      <div className="text--center">
        <img className={styles.featureSvg} alt={title} src={image} />
      </div>
      <div className="text--center padding-horiz--md">
        <h3>{title}</h3>
        <p>{description}</p>
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
