import React from 'react';
import { Icon, Menu } from 'semantic-ui-react';

const width = window.innerWidth;

const style = {
 position: 'absolute',
 top: '0rem',
 left: '0rem',
 zIndex: '100',
 width: '60%',
 height: '100%',
};

export default function Participantsdiv({
 children,
 participant,
 videoStatus,
 audioStatus,
 visible,
 setVisible,
}) {
 return (
  <>
   {visible && (
    <Menu vertical style={width <= 768 ? { ...style } : {}}>
     <Menu.Item
      header
      style={{ display: 'flex', justifyContent: 'space-between' }}
     >
      <div>Participants</div>{' '}
      {width <= 768 ? (
       <div onClick={() => setVisible(false)}>&#x2715;</div>
      ) : (
       <></>
      )}
     </Menu.Item>
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
   )}
  </>
 );
}
