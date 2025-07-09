import React from 'react';
import PlayerCard from './PlayerCard';
import './PlayerCard.css';
interface PlayerCardListProps {
  players: Array<{
    username: string;
    duration: number;
    loginDays: number;
    title?: string;
  }>;
}

const PlayerCardList: React.FC<PlayerCardListProps> = ({ players }) => {
  return (
    <div className="player-card-container">
      {players.map(player => (
        <PlayerCard key={player.username} {...player} />
      ))}
    </div>
  );
};

export default PlayerCardList;