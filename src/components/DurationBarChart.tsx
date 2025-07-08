import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './DurationBarChart.css';

interface UserDuration {
  id: string;
  duration: number;
  percentage: number;
}

const DurationBarChart: React.FC = () => {
  const [data, setData] = useState<UserDuration[]>([]);
  const [animate, setAnimate] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://homea350ti.top:5000/api/users/total-duration');
        const rawData = response.data as Record<string, number>;

        // 转换数据结构
        const dataArray = Object.entries(rawData)
          .map(([id, duration]) => ({
            id,
            duration
          }))
          .sort((a, b) => b.duration - a.duration);

        // 计算百分比
        const maxDuration = dataArray[0]?.duration || 1;
        const processedData = dataArray.map(item => ({
          ...item,
          percentage: ( Math.log(item.duration)  / Math.log(maxDuration)) * 100
        }));

        setData(processedData);
        setLoading(false);

        // 触发动画
        setTimeout(() => setAnimate(true), 100);
      } catch (err: any) {
        console.error('请求失败:', err.message);
        setError(`无法加载玩家数据: ${err.message}`);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <div>加载中...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="duration-chart">
      {data.map((item, index) => (
        <div key={item.id} className="chart-row">
          <div className="player-info">
            {/* 玩家头像（带错误处理） */}
            <img 
              src={`https://littleskin.cn/avatar/player/${item.id}`} 
              alt={`${item.id} 头像`}
              className="player-avatar"
              onError={(e) => {
                e.currentTarget.src = 'https://littleskin.cn/api/avatar/player/Steve'; 
                e.currentTarget.onerror = null;
              }}
            />
            <span className="player-name">{item.id}</span>
          </div>
          {/* 柱状图容器 */}
          <div className="bar-container">
            <div 
              className="duration-bar"
              style={{ 
                width: animate ? `${item.percentage}%` : '0%',
                transitionDelay: `${index * 0.1}s`
              }}
            >
              <span className="duration-label">
                {item.duration} 小时
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default DurationBarChart;