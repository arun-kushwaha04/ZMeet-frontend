import React, { useEffect, useState } from 'react';
import Layout from '../../Layout';
import { Grid, Segment, Sidebar, Header } from 'semantic-ui-react';
import styled from 'styled-components';
import Videodiv from './Videodiv';
import Participantsdiv from './Participantsdiv';
import Chats from './Chats';
import { useParams } from 'react-router-dom';
import { BACKEND_URL } from '../../urls';

const Container = styled.div`
 width: 100%;
 height: 100%;
 display: flex;
 .ui.grid {
  background-color: transparent;
  width: 100%;
 }
 .ui.segment {
  background-color: transparent;
 }
 .ui.vertical.menu {
  margin-top: 10px;
 }
`;

export default function Meetpage() {
 const [isChatsVisible, setChatVisiblity] = useState(false);
 const [isValid, setValidity] = useState(false);
 const [loading, setLoading] = useState(true);

 const [videoStatus, setVideoStatus] = useState(true);
 const [audioStatus, setAudioStatus] = useState(false);
 let param = useParams();
 const meetUrl = param.meetUrl.slice(1);

 useEffect(() => {
  const verifyMeetUrl = async () => {
   let userData = {
    meetUrl,
   };
   userData = JSON.stringify(userData);
   const res = await fetch(`${BACKEND_URL}/verifyMeetUrl`, {
    method: 'POST',
    body: userData,
    headers: {
     'Content-Type': 'application/json',
    },
   });

   const data = await res.json();
   console.log(data);
   setLoading(false);
   if (data.status === 200) {
    setValidity(true);
    return;
   }
   setValidity(false);
  };
  verifyMeetUrl();
 }, [meetUrl]);

 const [participant, updateParticipant] = useState({});
 const [visible, setVisible] = useState(false);
 return (
  <Layout>
   <Container>
    {loading ? (
     <Header
      size='large'
      style={{ margin: 'auto 10px', textAlign: 'center', width: '100%' }}
     >
      Checking Room Url
     </Header>
    ) : !isValid ? (
     <Header
      size='large'
      style={{ margin: 'auto 10px', textAlign: 'center', width: '100%' }}
     >
      Room Url Not Valid
     </Header>
    ) : (
     <div
      style={{
       display: 'flex',
       position: 'relative',
       width: '100%',
       maxHeight: '100%',
       overflow: 'hidden',
      }}
     >
      <Participantsdiv
       participant={participant}
       videoStatus={videoStatus}
       audioStatus={audioStatus}
       visible={visible}
       setVisible={setVisible}
      />
      <Grid padded columns={1} style={{ height: '100%', width: '100%' }}>
       <Grid.Column style={{ height: '100%', width: '100%' }}>
        <Sidebar.Pushable
         as={Segment}
         style={{ height: '100%', width: '100%' }}
        >
         <Chats visible={isChatsVisible} setVisiblity={setChatVisiblity} />
         <Videodiv
          visible={isChatsVisible}
          setVisiblity={setChatVisiblity}
          meetUrl={meetUrl}
          updateParticipant={updateParticipant}
          videoStatus={videoStatus}
          audioStatus={audioStatus}
          setVideoStatus={setVideoStatus}
          setAudioStatus={setAudioStatus}
          btnvisible={visible}
          setVisible={setVisible}
         />
        </Sidebar.Pushable>
       </Grid.Column>
      </Grid>
     </div>
    )}
   </Container>
  </Layout>
 );
}
