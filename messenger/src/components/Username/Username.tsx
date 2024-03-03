import './Username.css';
import { useParticipantProperty } from '@daily-co/daily-react';

const Username = ({ id, isLocal }: {id: string, isLocal: boolean | undefined}) => {
  const username = useParticipantProperty(id, 'user_name');

  return (
    <div className="username">
      {username || id} {isLocal && '(you)'}
    </div>
  );
}

export default Username;
