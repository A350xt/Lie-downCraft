import React from 'react';

interface PlayerCardProps {
  username: string;
  duration: number;
  loginDays: number;
  title?: string;
}

const PlayerCard: React.FC<PlayerCardProps> = ({ username, duration, loginDays, title }) => {
  return (
    <a
      href={`http://localhost:3000/docs/servermembers/${username}`}
      className="player-card"
    >
      <div className="player-card-content">
        <div className="player-card-avatar">
          <img
            src={`https://littleskin.cn/avatar/player/${encodeURIComponent(username)}`}
            alt={`${username} 头像`}
            loading="lazy"
          />
        </div>
        <div className="player-card-info">
          <div className="player-card-name-container">
            <h3 className="player-card-name">{username}</h3>
            {title && <span className="player-card-title">{title}</span>}
          </div>
          <div className="player-card-stat-row">
            <span>累计时长：{duration.toFixed(2)} 小时</span>
          </div>
          <div className="player-card-stat-row">
            <span>累计上线：{loginDays} 天</span>
          </div>
        </div>
      </div>
    </a>
  );
};

export default PlayerCard;