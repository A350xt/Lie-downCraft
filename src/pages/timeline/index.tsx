import React, { useState, useEffect } from 'react';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
import { useHistory } from '@docusaurus/router';
import styles from './timeline.module.css';
import timelineData from '../../data/timeline.json';

interface TimelineEvent {
  id: string;
  date: string;
  title: string;
  description: string;
  type: ('milestone' | 'machine' | 'building' | 'event' | 'ongoing')[];
  image: string;
  details: string;
}

const Timeline: React.FC = () => {
  const [visibleItems, setVisibleItems] = useState<Set<string>>(new Set());
  const [filter, setFilter] = useState<string>('all');
  const history = useHistory();

  // 格式化日期显示
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // 过滤事件
  const filteredEvents = timelineData.filter((event: TimelineEvent) => {
    if (filter === 'all') return true;
    return event.type.includes(filter as any);
  });

  // 处理图片点击，跳转到画廊
  const handleImageClick = (imageUrl: string) => {
    // 从图片URL提取对应的画廊ID
    const imageName = imageUrl.split('/').pop()?.split('.')[0];
    if (imageName) {
      // 直接跳转到画廊页面并定位到对应图片
      window.open(`/gallery#${imageName}`, '_blank');
    }
  };

  // 滚动动画效果
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const id = entry.target.getAttribute('data-id');
            if (id) {
              setVisibleItems(prev => new Set([...prev, id]));
            }
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: '50px'
      }
    );

    const timelineItems = document.querySelectorAll('[data-id]');
    timelineItems.forEach(item => observer.observe(item));

    return () => {
      timelineItems.forEach(item => observer.unobserve(item));
    };
  }, [filteredEvents]);

  // 获取事件类型的中文名称
  const getTypeName = (type: string): string => {
    const typeNames = {
      milestone: '里程碑',
      machine:'机器',
      building: '建筑',
      event: '活动',
      ongoing: '进行中'
    };
    return typeNames[type] || type;
  };

  // 获取主要类型（用于图标样式）
  const getPrimaryType = (types: string[]): string => {
    return types[0] || 'milestone';
  };

  // 渲染类型标签
  const renderTypeTags = (types: string[]) => {
    return types.map((type, index) => (
      <span key={type} className={`${styles.typeTag} ${styles[type]}`}>
        {getTypeName(type)}
      </span>
    ));
  };

  return (
    <Layout
      title="服务器时间线"
      description="Lie-downCraft 服务器发展历程时间线"
    >
      <div className={styles.timelineContainer}>
        {/* 页面标题 */}
        <div className={styles.timelineHeader}>
          <h1 className={styles.timelineTitle}>服务器时间线</h1>
          <p className={styles.timelineSubtitle}>
            记录 Lie-downCraft 服务器的发展历程与重要时刻
          </p>
        </div>

        {/* 筛选按钮 */}
        <div className={styles.filterContainer}>
          {['all', 'milestone', 'machine','building', 'event', 'ongoing'].map((filterType) => (
            <button
              key={filterType}
              className={`${styles.filterButton} ${filter === filterType ? styles.active : ''}`}
              onClick={() => setFilter(filterType)}
            >
              {filterType === 'all' ? '全部' : getTypeName(filterType)}
            </button>
          ))}
        </div>

        {/* 时间线 */}
        <div className={styles.timeline}>
          {filteredEvents.map((event: TimelineEvent, index: number) => (
            <div
              key={event.id}
              className={`${styles.timelineItem} ${visibleItems.has(event.id) ? styles.visible : ''}`}
              data-id={event.id}
            >
              {/* 时间标签 */}
              <div className={styles.timelineDate}>
                {formatDate(event.date)}
              </div>

              {/* 时间线图标 */}
              <div className={`${styles.timelineIcon} ${styles[getPrimaryType(event.type)]}`}></div>

              {/* 事件内容 */}
              <div className={styles.timelineContent}>
                <div className={styles.eventTitle}>
                  {event.title}
                  <div className={styles.typeTagContainer}>
                    {renderTypeTags(event.type)}
                  </div>
                </div>
                
                <p className={styles.eventDescription}>
                  {event.description}
                </p>
                
                <p className={styles.eventDetails}>
                  {event.details}
                </p>

                {/* 事件图片 */}
                {event.image && (
                  <img
                    src={event.image}
                    alt={event.title}
                    className={styles.eventImage}
                    onClick={() => handleImageClick(event.image)}
                    title="点击查看画廊"
                  />
                )}
              </div>
            </div>
          ))}
        </div>

        {/* 底部链接 */}
        <div style={{ textAlign: 'center', marginTop: '3rem' }}>
          <Link
            to="/gallery"
            className="button button--primary button--lg"
            style={{ marginRight: '1rem' }}
          >
            查看画廊
          </Link>
          <Link
            to="/docs/introduction"
            className="button button--secondary button--lg"
          >
            详细历史记录
          </Link>
        </div>
      </div>
    </Layout>
  );
};

export default Timeline;
