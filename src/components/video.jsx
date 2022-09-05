import React, { useEffect, useRef, useState } from 'react';
import { Peer } from 'peerjs';
import socket from '../socket.config';

const initializePeerConnection = () => {
 return new Peer(undefined, {
  host: 'localhost',
  port: 8000,
  path: '/webRTC/myapp',
 });
};

const peers = {};

const Video = () => {
 const usersVideo = useRef();
 const callVideo = useRef();
 let myPeer = initializePeerConnection();
 let userid;
 const [otherUserStream, setOtherUserStream] = useState();

 useEffect(() => {
  navigator.mediaDevices
   .getUserMedia({ video: true, audio: true })
   .then((stream) => {
    usersVideo.current.srcObject = stream;
   });
  socket.on('meet-url', (data) => {
   console.log(data);
  });
  initializePeersEvents();
  setPeersListeners();
  newUserConnection();
  // peer.on('call', (call) => {
  //  call.answer(stream);
  //  call.on('stream', (userVideoStream) => {
  //   callVideo.current.srcObject = userVideoStream;
  //  });
  // });

  // socket.on('user-connected', (userId) => {
  //  const call = peer.call(userId, stream);
  //  call.on('stream', (userVideoStream) => {
  //   // addVideoStream(video, userVideoStream);
  //  });
  // });
 }, []);

 const initializePeersEvents = () => {
  myPeer.on('open', (id) => {
   //  setPeersListeners();
   userid = id;
   const roomID = 'Hello';
   const userData = {
    userID: id,
    roomID,
   };
   console.log('peers established and joined room', userData);
   socket.emit('join-room', userData);
  });
  myPeer.on('error', (err) => {
   console.log('peer connection error', err);
   myPeer.reconnect();
  });
 };

 //  myPeer.on('call', (call) => {
 //   console.log('stream request aayi bro', call);
 //   call.answer(stream);
 //   call.on('stream', (userVideoStream) => {
 //    console.log('user stream data', userVideoStream);
 //    // createVideo({ id: call.metadata.id, stream: userVideoStream });
 //    callVideo.current.srcObject = userVideoStream;
 //   });
 //  });

 const setPeersListeners = (stream) => {
  navigator.mediaDevices
   .getUserMedia({ video: true, audio: true })
   .then((stream) => {
    myPeer.on('call', (call) => {
     call.answer(stream);
     call.on('stream', (userVideoStream) => {
      console.log('user stream data', userVideoStream);
      // createVideo({ id: call.metadata.id, stream: userVideoStream });
      callVideo.current.srcObject = userVideoStream;
     });
     call.on('close', () => {
      console.log('closing peers listeners', call.metadata.id);
      // this.removeVideo(call.metadata.id);
     });
     call.on('error', () => {
      console.log('peer error ------');
      // this.removeVideo(call.metadata.id);
     });
     peers[call.metadata.id] = call;
    });
   });
 };
 const newUserConnection = (stream) => {
  socket.on('user-connected', (userID) => {
   console.log('New User Connected', userID);
   //  setTimeout(connectToNewUser, 2000, userID, stream);
   connectToNewUser(userID, stream);
  });
 };
 const connectToNewUser = (userID, stream) => {
  navigator.mediaDevices
   .getUserMedia({ video: true, audio: true })
   .then((stream) => {
    const call = myPeer.call(userID, stream, { metadata: { id: userid } });
    console.log('call undefined kyu hai', call);
    call.on('stream', (userVideoStream) => {
     // this.createVideo({ id: userID, stream: userVideoStream, userData });
     callVideo.current.srcObject = userVideoStream;
    });
    call.on('close', () => {
     console.log('closing new user', userID);
     // this.removeVideo(userID);
    });
    call.on('error', () => {
     console.log('peer error ------');
     // this.removeVideo(userID);
    });
    peers[userID] = call;
   });
 };
 // const removeVideo = (id) => {
 //     delete this.videoContainer[id];
 //     const video = document.getElementById(id);
 //     if (video) video.remove();
 // }
 // const destoryConnection = () => {
 //     const myMediaTracks = this.videoContainer[this.myID]?.stream.getTracks();
 //     myMediaTracks?.forEach((track:any) => {
 //         track.stop();
 //     })
 //     socketInstance?.socket.disconnect();
 //     this.myPeer.destroy();
 // }

 return (
  <div style={{ margin: 'auto', width: '50%', overflow: 'scroll' }}>
   <h1>Meet</h1>
   <div>
    <h4>Dursa Banda</h4>
    <video
     playsInline
     muted
     autoPlay
     style={{ width: '100%' }}
     ref={callVideo}
    ></video>
   </div>

   <div>
    <h4>Phela Banda</h4>
    <video
     ref={usersVideo}
     playsInline
     muted
     autoPlay
     style={{ width: '100%' }}
    />
   </div>
  </div>
 );
};

export default Video;
