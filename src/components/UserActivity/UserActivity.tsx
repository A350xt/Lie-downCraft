import React, { useEffect, useState, useMemo } from 'react';
import clsx from 'clsx';
import styles from './ContributionCalendar.module.css';

// 类型定义
interface ActivityData {
  date: Date;
  count: number;
  level: number;
}

interface UserActivityProps {
  userId: string;
}

// 月份名称
const MONTH_NAMES = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
// 颜色等级阈值
const LEVEL_THRESHOLDS = [0, 60, 120, 240, Infinity];

/**
 * 贡献日历组件
 */
const ContributionCalendar: React.FC<{ contributions: ActivityData[] }> = ({ contributions = [] }) => {
  // 安全获取第一个日期
  const firstDate = useMemo(() => {
    if (!contributions.length) return new Date();
    const date = contributions[0]?.date;
    return date ? new Date(date) : new Date();
  }, [contributions]);

  const startRow = useMemo(() => {
    return firstDate.getDay();
  }, [firstDate]);

  // 生成月份标签
  const months = useMemo(() => {
    if (!contributions.length || !firstDate) return [];

    const monthElements: React.ReactNode[] = [];
    let latestMonth = -1;

    contributions.forEach((c, i) => {
      const date = new Date(c.date);
      const month = date.getMonth();

      if (date.getDay() === 0 && month !== latestMonth) {
        const gridColumn = 2 + Math.floor((i + startRow) / 7);
        latestMonth = month;

        monthElements.push(
          <span
            className={styles.month}
            key={i}
            style={{ gridColumn }}
          >
            {MONTH_NAMES[date.getMonth()]}
          </span>
        );
      }
    });

    // 处理第一个月份标签对齐
    const updatedMonths = [...monthElements];
    if (updatedMonths.length > 0) {
      const firstMonthName = updatedMonths[0]?.props?.children;
      const expectedFirstMonth = MONTH_NAMES[firstDate.getMonth()];
      if (firstMonthName === expectedFirstMonth) {
        updatedMonths[0] = React.cloneElement(updatedMonths[0] as React.ReactElement, {
          style: { ...(updatedMonths[0] as any).props.style, gridColumn: 2 }
        });
      }

      // 处理月份标签重叠
      if (updatedMonths.length > 1 && 
          updatedMonths[1]?.props?.style?.gridColumn - updatedMonths[0]?.props?.style?.gridColumn < 3) {
        updatedMonths[0] = null;
      }

      // 处理最后一个月份标签超出范围
      if (updatedMonths.length && 
          updatedMonths[updatedMonths.length - 1]?.props?.style?.gridColumn > 53) {
        updatedMonths[updatedMonths.length - 1] = null;
      }
    }

    return updatedMonths;
  }, [contributions]);

  // 生成日期格子
  const tiles = useMemo(() => {
    if (!contributions.length) return [];

    return contributions.map((c, i) => {
      const date = new Date(c.date);
      const style = i === 0 ? { gridRow: startRow + 1 } : {};
      return (
        <i
          key={i}
          className={styles.tile}
          data-level={c.level}
          title={`${c.count} hours on ${date.toISOString().split('T')[0]}`}
          style={style}
        />
      );
    });
  }, [contributions, startRow]);

  // 计算总时长
  const total = useMemo(() =>
    contributions.reduce((sum, c) => sum + c.count, 0),
    [contributions]
  );

  return (
    <div className={clsx(styles.container)}>
      {/* 月份标签 */}
      {months}

      {/* 日期格子容器 */}
      <div className={styles.tiles}>
        {tiles}
      </div>

      {/* 总时长 */}
      <div className={styles.total}>
        {total} hours in the last year
      </div>

      {/* 图例 */}
      <div className={styles.legend}>
        <span>Less</span>
        <i className={styles.tile} data-level={0} />
        <i className={styles.tile} data-level={1} />
        <i className={styles.tile} data-level={2} />
        <i className={styles.tile} data-level={3} />
        <i className={styles.tile} data-level={4} />
        <span>More</span>
      </div>
    </div>
  );
};

/**
 * 用户活动组件（带数据获取）
 */
const UserActivity: React.FC<UserActivityProps> = ({ userId }) => {
  const [contributions, setContributions] = useState<ActivityData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 获取数据
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`http://47.122.27.73:5000/api/user/${userId}/activity`);

        if (!response.ok) {
          throw new Error('Failed to fetch user activity');
        }

        const data = await response.json();

        // 生成完整年度数据
        const fullYearData = generateYearlyData(data);

        setContributions(fullYearData);
        setLoading(false);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
        setLoading(false);
      }
    };

    fetchData();
  }, [userId]);

  // 生成完整年度数据
  function generateYearlyData(activityData: Record<string, number>): ActivityData[] {
    const today = new Date();
    const oneYearAgo = new Date();
    oneYearAgo.setFullYear(today.getFullYear() - 1);

    // 确保起始日期是最近一个完整的周日
    const adjustedStartDate = new Date(oneYearAgo);
    const dayOfWeek = adjustedStartDate.getDay();
    if (dayOfWeek !== 0) {
      adjustedStartDate.setDate(adjustedStartDate.getDate() - dayOfWeek);
    }

    const dateMap = new Map<string, ActivityData>();

    // 生成 53 周 × 7 天 = 371 天
    for (let i = 0; i < 371; i++) {
      const currentDate = new Date(adjustedStartDate);
      currentDate.setDate(currentDate.getDate() + i);

      const dateStr = currentDate.toISOString().split('T')[0];
      dateMap.set(dateStr, {
        date: new Date(currentDate),
        count: 0,
        level: 0
      });
    }

    // 合并实际数据
    Object.entries(activityData).forEach(([dateStr, duration]) => {
      if (dateMap.has(dateStr)) {
        const contribution = dateMap.get(dateStr)!;
        contribution.count = duration;
        contribution.level = calculateLevel(duration);
      }
    });

    // 转换为数组并排序（按周日开始顺序）
    return Array.from(dateMap.values()).sort((a, b) =>
      a.date.getTime() - b.date.getTime()
    );
  }

  // 计算颜色等级
  const calculateLevel = (duration: number): number => {
    return LEVEL_THRESHOLDS.findIndex(threshold => duration < threshold) || 4;
  };

  if (loading) {
    return <div>加载中...</div>;
  }

  if (error) {
    return <div>错误: {error}</div>;
  }

  return <ContributionCalendar contributions={contributions} />;
};

export default React.memo(UserActivity);