import React, { useRef, useEffect, useState } from 'react';
import { Modal, Segment, Icon, Grid, Button, Header } from 'semantic-ui-react';
import styled from 'styled-components';
import {
 changeAudioStatus,
 changeVideoStatus,
 closePeerConnection,
 initializePeerConnection,
 initializePeersEvents,
 initializeSocketEvents,
 reInitializeStream,
} from './peerService';

import './video.css';

const width = window.innerWidth;
const size = width <= 769 ? '' : 'large';
export default function Videodiv({
 meetUrl,
 updateParticipant,
 videoStatus,
 audioStatus,
 setVideoStatus,
 setAudioStatus,
 btnvisible,
 setVisible,
}) {
 const usersVideo = useRef();
 let peer = initializePeerConnection();
 const [userid, setUserId] = useState('');
 const [open, setOpen] = useState(false);
 const [globalStream, setGlobalStream] = useState(null);
 const [peerInitalized, setPeerInitalized] = useState(false);

 // const getCurrentStream = () => globalStream;

 useEffect(() => {
  reInitializeStream(videoStatus, audioStatus, setGlobalStream);
 }, [audioStatus, videoStatus]);

 useEffect(() => {
  console.log(
   'Current Stream',
   globalStream,
   globalStream?.getAudioTracks(),
   globalStream?.getVideoTracks(),
  );
  usersVideo.current.srcObject = globalStream;
 }, [globalStream]);

 useEffect(() => {
  if (!peer) return;
  if (globalStream && !peerInitalized) {
   console.log(
    'Intial Stream',
    globalStream,
    globalStream.getAudioTracks(),
    globalStream.getVideoTracks(),
   );
   initializePeersEvents(
    peer,
    meetUrl,
    setUserId,
    updateParticipant,
    setGlobalStream,
   );
   initializeSocketEvents(updateParticipant);
   setPeerInitalized(true);
  }
 }, [userid, peer, meetUrl, updateParticipant, globalStream, peerInitalized]);

 return (
  <Maindiv>
   <Segmentdiv style={{ height: '95%', width: '100%' }}>
    <Segment basic style={{ height: '100%', width: '100%' }}>
     <Grid
      className='randomvideogrid'
      columns={width <= 768 ? 1 : 3}
      verticalAlign='middle'
      centered
      container
     >
      <Grid.Column>
       <Supervideodiv>
        <Video ref={usersVideo} playsInline autoPlay muted />
        <h4>You</h4>
       </Supervideodiv>
      </Grid.Column>
     </Grid>
    </Segment>
   </Segmentdiv>

   <Animateddiv>
    <Controldiv>
     {videoStatus ? (
      <Icon
       circular
       inverted
       color='green'
       name='video'
       size={size}
       onClick={() => changeVideoStatus(setVideoStatus, videoStatus)}
      />
     ) : (
      <Icon
       circular
       name='video'
       size={size}
       onClick={() => changeVideoStatus(setVideoStatus, videoStatus)}
      />
     )}
     <Modal
      closeIcon
      open={open}
      size='small'
      trigger={<Icon circular inverted color='red' name='call' size={size} />}
      onClose={() => setOpen(false)}
      onOpen={() => setOpen(true)}
     >
      <Header icon='close' content='Leave the meet' />
      <Modal.Content>
       <p>Do you really want to leave the room ?</p>
      </Modal.Content>
      <Modal.Actions>
       <Button
        color='red'
        onClick={() => {
         setOpen(false);
        }}
       >
        <Icon name='remove' /> No
       </Button>
       <Button
        color='green'
        onClick={() => {
         setOpen(false);
         closePeerConnection();
        }}
       >
        <Icon name='checkmark' /> Yes
       </Button>
      </Modal.Actions>
     </Modal>

     {audioStatus ? (
      <Icon
       circular
       inverted
       color='green'
       name='unmute'
       size={size}
       onClick={() => changeAudioStatus(setAudioStatus, audioStatus)}
      />
     ) : (
      <Icon
       circular
       name='unmute'
       size={size}
       onClick={() => changeAudioStatus(setAudioStatus, audioStatus)}
      />
     )}
     <Icon
      circular
      inverted
      color='green'
      name='copy'
      size={size}
      onClick={async () => {
       const pageLocation = window.location.href;
       await navigator.clipboard.writeText(pageLocation);
       alert('Meet url copied');
      }}
     />
     {!btnvisible && (
      <Icon
       circular
       inverted
       color='green'
       name='user'
       size={size}
       onClick={() => setVisible(true)}
      />
     )}
    </Controldiv>
   </Animateddiv>
  </Maindiv>
 );
}
const Maindiv = styled.div`
 height: 100%;
 width: 100%;
 display: flex;
 flex-direction: column;
 overflow: hidden;
`;

const Segmentdiv = styled.div`
 height: 100%;
 .ui.basic.segment {
  height: 90%;
 }
`;

const Animateddiv = styled.div`
 width: 100%;
 height: 15%;
 i {
  cursor: pointer;
 }
`;

const Supervideodiv = styled.div`
 position: relative;
 background-color: #838282;
 :hover {
  background-color: #000;
  video {
   opacity: 0.5;
  }
  h4 {
   display: block;
  }
 }
 h4 {
  position: absolute;
  text-align: center;
  width: 100%;
  top: 50%;
  left: 50%;
  display: none;
  transform: translate(-50%, -150%);
  color: white;
 }
`;

const Video = styled.video`
 width: 100%;
 height: 19rem;
 object-fit: contain;
`;

const Controldiv = styled.div`
 background-color: white;
 width: 100%;
 height: 5rem;
 padding: 1rem 0;
 display: flex;
 gap: 2rem;
 justify-content: center;
 align-items: center;
`;
