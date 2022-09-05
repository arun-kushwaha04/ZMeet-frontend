import { Peer } from 'peerjs';
import socket from '../../socket.config';
import { HOSTNAME } from '../../urls';

const initializePeerConnection = () => {
 return new Peer(undefined, {
  host: HOSTNAME,
  port: 8000,
  path: '/webRTC/myapp',
 });
};
const peers = {};
let roomID;
let userID;

let globalStream;

const initializePeersEvents = (
 myPeer,
 meetUrl,
 setUserId,
 videoStatus,
 audioStatus,
 updateParticipant,
) => {
 console.log('Trying to get peer id', meetUrl);
 myPeer.on('open', async (id) => {
  setUserId(id);
  userID = id;
  roomID = meetUrl;
  const userData = {
   userID: id,
   roomID,
   username: localStorage.getItem('username'),
  };
  console.log('peers established and joined room', userData);
  socket.emit('join-room', userData);
  globalStream = await getVideoAndAudioStream(videoStatus, audioStatus);
  setNavigatorToStream(myPeer, id, peers, updateParticipant);
 });
 myPeer.on('error', (err) => {
  console.log('peer connection error', err);
  myPeer.reconnect();
 });
};

const initializeSocketEvents = (updateParticipant) => {
 console.log('intalizing socket events');
 socket.on('connect', () => {
  console.log('socket connected');
 });
 socket.on('video-changed', (userID, status) => {
  console.log('video status changed for ', userID, status);
  updateParticipant((data) => ({
   ...data,
   [userID]: { ...data[userID], videoStatus: status },
  }));
 });
 socket.on('audio-changed', (userID, status) => {
  console.log('audio status changed for ', userID);
  updateParticipant((data) => ({
   ...data,
   [userID]: { ...data[userID], audioStatus: status },
  }));
 });
 socket.on('user-disconnected', (userID) => {
  console.log('user disconnected-- closing peers', userID);
  peers[userID] && peers[userID].close();
  removeParticipant(updateParticipant, userID);
 });
 socket.on('disconnect', () => {
  console.log('socket disconnected --');
 });
};

const closePeerConnection = () => {
 Object.values(peers).forEach((call) => {
  call.close();
 });
 window.open('/', '_self');
 window.close();
};

const removeParticipant = (updateParticipant, targetUserID) => {
 updateParticipant((data) => {
  let newObj = {};
  Object.keys(data).forEach((key) => {
   if (key !== targetUserID) newObj[key] = data[key];
  });
  return newObj;
 });
};

const setPeersListeners = (myPeer, peers, updateParticipant) => {
 myPeer.on('call', (call) => {
  call.answer(globalStream);
  const id = call.metadata.id;
  const username = call.metadata.username;
  call.on('stream', (userVideoStream) => {
   console.log('user stream data', username);
   const div = document.getElementById(id);
   if (!div) {
    addNewUsersVideo(id, username, userVideoStream);
   }
   const userData = {
    userID: id,
    username: username,
    videoStatus: true,
    audioStatus: true,
   };
   updateParticipant((data) => {
    return { ...data, [id]: userData };
   });
  });
  call.on('close', () => {
   console.log('closing peers listeners', call.metadata.id);
   const div = document.getElementById(id);
   div.remove();
   delete peers[id];
   removeParticipant(updateParticipant, id);
  });
  call.on('error', () => {
   console.log('peer error ------');
   const div = document.getElementById(id);
   div.remove();
   delete peers[id];
   removeParticipant(updateParticipant, id);
  });
  peers[id] = call;
 });
};

const newUserConnection = (peer, myuserID, peers, updateParticipant) => {
 socket.on('user-connected', async (userID, othersUsername) => {
  console.log('New User Connected', userID, othersUsername);
  const userData = {
   userID,
   username: othersUsername,
   videoStatus: true,
   audioStatus: true,
  };
  updateParticipant((data) => {
   return { ...data, [userID]: userData };
  });
  setTimeout(
   connectToNewUser,
   2000,
   peer,
   userID,
   myuserID,
   peers,
   othersUsername,
   updateParticipant,
  );
  // connectToNewUser(peer, userID, myuserID, updatePeers);
 });
};

const connectToNewUser = async (
 myPeer,
 othersuserID,
 myuserID,
 peers,
 othersUsername,
 updateParticipant,
) => {
 console.log('stream ka check kaar raha hu', globalStream);
 const call = myPeer.call(othersuserID, globalStream, {
  metadata: { id: myuserID, username: localStorage.getItem('username') },
 });
 call.on('stream', (userVideoStream) => {
  const div = document.getElementById(othersuserID);
  if (!div) {
   addNewUsersVideo(othersuserID, othersUsername, userVideoStream);
  }
 });
 call.on('close', () => {
  console.log('closing new user', othersuserID);
  const div = document.getElementById(othersuserID);
  div.remove();
  delete peers[othersuserID];
  removeParticipant(updateParticipant, othersuserID);
 });
 call.on('error', () => {
  console.log('peer error ------');
  const div = document.getElementById(othersuserID);
  div.remove();
  delete peers[othersuserID];
  removeParticipant(updateParticipant, othersuserID);
 });
 peers[othersuserID] = call;
};

const addNewUsersVideo = (id, username, userVideoStream) => {
 const Maindiv = document.createElement('div');
 Maindiv.classList.add('column');
 Maindiv.setAttribute('id', id);

 const Secdiv = document.createElement('div');
 Secdiv.classList.add('sec-col');

 const video = document.createElement('video');
 video.srcObject = userVideoStream;
 video.autoplay = true;
 video.playsInline = true;
 video.mute = true;
 video.classList.add('video');

 const h4 = document.createElement('h4');
 h4.textContent = username;

 const grid = document.querySelector('.randomvideogrid');

 Secdiv.appendChild(video);
 Secdiv.appendChild(h4);
 Maindiv.appendChild(Secdiv);
 console.log(Maindiv, grid);
 grid.appendChild(Maindiv);
};

export const createEmptyAudioTrack = () => {
 const ctx = new AudioContext();
 const oscillator = ctx.createOscillator();
 const dst = oscillator.connect(ctx.createMediaStreamDestination());
 oscillator.start();
 const track = dst.stream.getAudioTracks()[0];
 return Object.assign(track, { enabled: false });
};

export const createEmptyVideoTrack = ({ width, height }) => {
 const canvas = Object.assign(document.createElement('canvas'), {
  width,
  height,
 });
 canvas.getContext('2d').fillStyle = `rgb(131, 130, 130)`;
 canvas.getContext('2d').fillRect(0, 0, width, height);

 const stream = canvas.captureStream();
 const track = stream.getVideoTracks()[0];

 return Object.assign(track, { enabled: false });
};

const getVideoAndAudioStream = (videoStatus, audioStatus) => {
 console.log('Mai video audio stream bana raha hu');
 return new Promise((resolve, reject) => {
  navigator.mediaDevices
   .getUserMedia({
    video: true,
    audio: true,
   })
   .then((stream) => {
    globalStream = stream;
    console.log(globalStream);
    resolve(stream);
   });
  // if (!videoStatus && !audioStatus) {
  //  const audioTrack = createEmptyAudioTrack();
  //  const videoTrack = createEmptyVideoTrack({ width: 640, height: 480 });
  //  const mediaStream = new MediaStream([audioTrack, videoTrack]);
  //  globalStream = mediaStream;
  //  resolve(mediaStream);
  // } else {
  //  navigator.mediaDevices
  //   .getUserMedia({
  //    video: videoStatus,
  //    audio: audioStatus,
  //   })
  //   .then((stream) => {
  //    globalStream = stream;
  //    resolve(stream);
  //   })
  //   .catch((err) => {
  //    const audioTrack = createEmptyAudioTrack();
  //    const videoTrack = createEmptyVideoTrack({ width: 640, height: 480 });
  //    const mediaStream = new MediaStream([audioTrack, videoTrack]);
  //    globalStream = mediaStream;
  //    resolve(mediaStream);
  //   });
  // }
 });
};

const setNavigatorToStream = async (myPeer, id, peers, updateParticipant) => {
 setPeersListeners(myPeer, peers, updateParticipant);
 newUserConnection(myPeer, id, peers, updateParticipant);
};

const reInitializeStream = async (videoStatus, audioStatus) => {
 if (globalStream) {
  globalStream.getAudioTracks() &&
   globalStream
    .getAudioTracks()
    .forEach((track) => (track.enabled = audioStatus));
  globalStream.getVideoTracks() &&
   globalStream
    .getVideoTracks()
    .forEach((track) => (track.enabled = videoStatus));
 }
};

const changeVideoStatus = (setStatus, videoStatus) => {
 setStatus((data) => {
  // socket.to(roomID).emit('video-changed', userID, !data);
  return !data;
 });
 socket.emit('video-changed-client', userID, !videoStatus);
};

const changeAudioStatus = (setStatus, audioStatus) => {
 setStatus((data) => {
  return !data;
 });
 socket.emit('audio-changed-client', userID, !audioStatus);
};

export {
 initializePeerConnection,
 initializePeersEvents,
 initializeSocketEvents,
 changeAudioStatus,
 changeVideoStatus,
 reInitializeStream,
 closePeerConnection,
};
