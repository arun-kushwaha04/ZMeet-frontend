import React from 'react';
import { Icon, Menu } from 'semantic-ui-react';

export default function Participantsdiv({
 participant,
 videoStatus,
 audioStatus,
}) {
 return (
  <Menu vertical>
   <Menu.Item header>Participants</Menu.Item>
   <Menu.Item>
    {videoStatus ? <Icon name='video' /> : <Icon name='hide' />}
    {audioStatus ? <Icon name='unmute' /> : <Icon name='mute' />}
    You
   </Menu.Item>
   {Object.values(participant).map((obj) => {
    console.log(obj);
    return (
     <Menu.Item key={obj.userId}>
      {obj.videoStatus ? <Icon name='video' /> : <Icon name='hide' />}
      {obj.audioStatus ? <Icon name='unmute' /> : <Icon name='mute' />}
      {obj.username}
     </Menu.Item>
    );
   })}
  </Menu>
 );
}
