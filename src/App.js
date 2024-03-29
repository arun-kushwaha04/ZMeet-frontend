import React, { useState } from 'react';
import './App.css';
import {
 Header,
 Segment,
 Grid,
 Message,
 Button,
 Icon,
 Input,
 Divider,
 Label,
} from 'semantic-ui-react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import Layout from './Layout';
import { BACKEND_URL } from './urls';

const Container = styled.div`
 width: 100%;
 height: 100%;
 display: flex;
 align-items: center;
 .ui.attached.header,
 .ui.attached.segment,
 .ui.message {
  background-color: transparent;
 }
`;

const verifyToken = async (token, navigate) => {
 let userData = {
  token,
 };
 userData = JSON.stringify(userData);
 const res = await fetch(`${BACKEND_URL}/verifyToken`, {
  method: 'POST',
  body: userData,
  headers: {
   'Content-Type': 'application/json',
  },
 });

 const data = await res.json();
 console.log(data);
 if (data.status === 200) {
  return;
 }

 localStorage.clear();
 navigate('/account', { replace: true });
};

function App() {
 const navigate = useNavigate();
 const [meetUrl, setMeetUrl] = useState('');
 React.useEffect(() => {
  const token = localStorage.getItem('userToken');
  const username = localStorage.getItem('username');
  if (username && token) {
   verifyToken(token, navigate);
  } else {
   navigate('/account', { replace: true });
  }
 }, [navigate]);

 const getMeetUrl = async () => {
  let userData = {
   username: localStorage.getItem('username'),
   timestamp: new Date(Date()).getTime(),
  };
  userData = JSON.stringify(userData);
  const res = await fetch(`${BACKEND_URL}/getMeetUrl`, {
   method: 'POST',
   body: userData,
   headers: {
    'Content-Type': 'application/json',
   },
  });

  const data = await res.json();
  if (data.status === 200) {
   setMeetUrl(data.payload);
   navigate(`/:${data.payload}`);
   return;
  }
  alert('Failed to generate meet url');
 };

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
  if (data.status === 200) {
   navigate(`/:${meetUrl}`);
   return;
  }
  alert('Invalid meet url');
 };

 return (
  <Layout>
   <Container text>
    <Grid columns={2} relaxed='very' stackable doubling>
     <Grid.Column width={8}>
      <Grid.Row>
       <Header as='h2' attached='top'>
        ZMeet
       </Header>
       <Segment attached>
        Premium vidoe meetings. Now free for everyone. We re-engineered the
        service that we build for secure business meetings, ZMeet, to make it
        free and avialable for all.
       </Segment>
      </Grid.Row>
      <Divider hidden />
      <Grid.Row>
       <Grid columns={3}>
        <Grid.Column>
         <Button
          icon
          fluid
          labelPosition='left'
          color='blue'
          onClick={getMeetUrl}
         >
          <Icon name='video' />
          Create A Room
         </Button>
        </Grid.Column>
        <Grid.Column width={1} verticalAlign='middle'>
         OR
        </Grid.Column>
        <Grid.Column textAlign='center' width={9}>
         <Input
          fluid
          placeholder='Enter a code'
          labelPosition='right'
          onChange={(e) => setMeetUrl(e.target.value)}
         >
          <Label basic>
           <Icon name='users' />
          </Label>
          <input />
          <Button onClick={verifyMeetUrl}>Join</Button>
         </Input>
        </Grid.Column>
       </Grid>
      </Grid.Row>
     </Grid.Column>
     <Grid.Column width={8}>
      <Message>
       <Message.Header>ZMeet Features</Message.Header>
       <Message.List>
        <Message.Item>Get a link that you can share</Message.Item>
        <Message.Item>Redueced video/audio latency</Message.Item>
        <Message.Item>
         Peer to peer communication, no server involved
        </Message.Item>
        {/* <Message.Item>In call chat communication</Message.Item> */}
       </Message.List>
      </Message>
     </Grid.Column>
    </Grid>
   </Container>
  </Layout>
 );
}

export default App;
