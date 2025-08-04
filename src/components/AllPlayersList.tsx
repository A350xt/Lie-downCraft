import React, { useState, useEffect } from 'react';
import PlayerCardList from './PlayerCardList';

const AllPlayersList: React.FC = () => {
  const [players, setPlayers] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // 检查缓存
        const cacheKey = 'allPlayerData';
        const cached = localStorage.getItem(cacheKey);
        const cacheTime = localStorage.getItem(`${cacheKey}_timestamp`);

        if (
          cached &&
          cacheTime &&
          Date.now() - parseInt(cacheTime) < 60 * 1000 // 5分钟缓存
        ) {
          setPlayers(JSON.parse(cached));
          setLoading(false);
          return;
        }

        // 获取用户名列表
        const durationRes = await fetch('https://lie-downcraft.cn:5000/api/users/total-duration');
        if (!durationRes.ok) throw new Error('获取玩家列表失败');
        const durations = await durationRes.json();
        const usernames = Object.keys(durations);

        // 获取登录天数
        const daysRes = await fetch('https://lie-downcraft.cn:5000/api/users/login-days');
        if (!daysRes.ok) throw new Error('获取登录天数失败');
        const days = await daysRes.json();

        // 并行获取头衔
        const titles: Record<string, string | undefined> = {};
        await Promise.allSettled(
          usernames.map(async (username) => {
            const cacheKey = `title_${username}`;
            const cached = localStorage.getItem(cacheKey);
            const cacheTime = localStorage.getItem(`${cacheKey}_timestamp`);

            if (
              cached &&
              cacheTime &&
              Date.now() - parseInt(cacheTime) < 5 * 60 * 1000
            ) {
              titles[username] = cached;
              return;
            }

            try {
              const titleRes = await fetch(`https://lie-downcraft.cn:5000/api/user/preflex/${username}`);
              if (!titleRes.ok) return;

              const titleData = await titleRes.json();
              titles[username] = titleData?.preflex || undefined;

              // 缓存头衔
              localStorage.setItem(cacheKey, titles[username] || '');
              localStorage.setItem(`${cacheKey}_timestamp`, Date.now().toString());
            } catch (err) {
              console.error(`获取 ${username} 头衔失败`, err);
            }
          })
        );

        // 合并数据
        const merged: Record<string, any> = {};
        for (const username of usernames) {
          merged[username] = {
            username,
            duration: parseFloat(durations[username] || 0),
            loginDays: parseInt(days[username] || 0),
            title: titles[username] || undefined
          };
        }

        // 缓存数据
        localStorage.setItem(cacheKey, JSON.stringify(merged));
        localStorage.setItem(cacheKey + '_timestamp', Date.now().toString());

        setPlayers(merged);
        setLoading(false);
      } catch (err) {
        setError('加载失败：' + (err as Error).message);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <p>加载中...</p>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;

  return <PlayerCardList players={Object.values(players)} />;
};

export default AllPlayersList;