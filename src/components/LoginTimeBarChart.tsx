import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './LoginTimeBarChart.css';

interface Userlogintime {
  id: string;
  logintime: number;
  percentage: number;
}

const LoginTimeBarChart: React.FC = () => {
  const [data, setData] = useState<Userlogintime[]>([]);
  const [animate, setAnimate] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://homea350ti.top:5000/api/users/login-days');
        const rawData = response.data as Record<string, number>;

        // 转换数据结构
        const dataArray = Object.entries(rawData)
          .map(([id, logintime]) => ({
            id,
            logintime
          }))
          .sort((a, b) => b.logintime - a.logintime);

        // 计算百分比
        const maxlogintime = dataArray[0]?.logintime || 1;
        const processedData = dataArray.map(item => ({
          ...item,
          percentage: (item.logintime / maxlogintime) * 100
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
    <div className="logintime-chart">
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
              className="logintime-bar"
              style={{ 
                width: animate ? `${item.percentage}%` : '0%',
                transitionDelay: `${index * 0.1}s`
              }}
            >
              <span className="logintime-label">
                {Math.round(item.logintime)} 天
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default LoginTimeBarChart;