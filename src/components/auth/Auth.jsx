import React, { useState } from 'react';
import { GoogleLogin } from 'react-google-login';
import { gapi } from 'gapi-script';
import { Button, Divider, Form, Grid, Segment } from 'semantic-ui-react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';

import { BACKEND_URL } from '../../urls';

const clientId =
 '689448220052-661un96oo6o8ijlin42esjotm1oh914d.apps.googleusercontent.com';

export default function Auth() {
 const navigate = useNavigate();
 React.useEffect(() => {
  function start() {
   gapi.client.init({
    clientId: clientId,
    scope: '',
   });
  }
  gapi.load('client:auth2', start);
 }, []);

 const [loginUsername, setLoginUsername] = useState('');
 const [loginPassword, setLoginPassword] = useState('');
 const [registerUsername, setRegisterUsername] = useState('');
 const [registerPassword, setRegisterPassword] = useState('');
 const [registerConfirmPassword, setRegisterConfirmPassword] = useState('');

 const handleLoginSubmit = async () => {
  if (!loginPassword && !loginUsername) return;
  let userData = {
   username: loginUsername,
   password: loginPassword,
  };

  userData = JSON.stringify(userData);

  const res = await fetch(`${BACKEND_URL}/auth/login`, {
   method: 'POST',
   body: userData,
   headers: {
    'Content-Type': 'application/json',
   },
  });

  const data = await res.json();
  console.log(data);

  if (data.status === 200) {
   localStorage.setItem('userToken', data.payload.token);
   localStorage.setItem('username', data.payload.username);
   navigate('/', { replace: true });
   return;
  }

  alert('Login Failed');
 };

 const handleRegisterSubmit = async () => {
  if (!registerPassword && !registerUsername) return;
  if (registerPassword !== registerConfirmPassword) return;
  let userData = {
   username: registerUsername,
   password: registerPassword,
  };

  userData = JSON.stringify(userData);

  const res = await fetch(`${BACKEND_URL}/auth/register`, {
   method: 'POST',
   body: userData,
   headers: {
    'Content-Type': 'application/json',
   },
  });

  const data = await res.json();
  console.log(data);

  if (data.status === 200) {
   alert('Registered Successfully');
   return;
  }

  alert('Registration Failed');
 };

 return (
  <Authdiv>
   <Segment placeholder>
    <Grid columns={3} relaxed='very' stackable>
     <Grid.Column width={7}>
      <Form re>
       <Form.Input
        icon='user'
        iconPosition='left'
        label='Username'
        placeholder='Username'
        onChange={(e) => setLoginUsername(e.target.value)}
       />
       <Form.Input
        icon='lock'
        iconPosition='left'
        label='Password'
        type='password'
        onChange={(e) => setLoginPassword(e.target.value)}
       />
       <Button content='Login' primary onClick={handleLoginSubmit} />
       <Divider horizontal>Or</Divider>
       <Login />
      </Form>
     </Grid.Column>
     <Grid.Column width={2}>
      <div className='vl'></div>
     </Grid.Column>
     <Grid.Column width={7}>
      <Form>
       <Form.Input
        icon='user'
        iconPosition='left'
        label='Username'
        placeholder='Username'
        onChange={(e) => setRegisterUsername(e.target.value)}
       />
       <Form.Input
        icon='lock'
        iconPosition='left'
        label='Password'
        type='password'
        onChange={(e) => setRegisterPassword(e.target.value)}
       />
       <Form.Input
        icon='lock'
        iconPosition='left'
        label='Confirm Password'
        type='password'
        onChange={(e) => setRegisterConfirmPassword(e.target.value)}
       />
       <Button content='SignUp' primary onClick={handleRegisterSubmit} />
      </Form>
     </Grid.Column>
    </Grid>
   </Segment>
  </Authdiv>
 );
}

const Authdiv = styled.div`
 display: flex;
 height: 100vh;
 width: 100%;
 align-items: center;
 justify-content: center;
 .ui.segment {
  background-color: transparent;
 }
 .vl {
  border-left: 2px solid white;
  height: 100%;
 }
`;

const getToken = async (username) => {
 let userData = {
  username,
 };
 userData = JSON.stringify(userData);
 const res = await fetch(`${BACKEND_URL}/getToken`, {
  method: 'POST',
  body: userData,
  headers: {
   'Content-Type': 'application/json',
  },
 });

 const data = await res.json();
 console.log(data);
 if (data.status === 200) {
  return data.payload;
 }

 return null;
};

function Login() {
 const navigate = useNavigate();
 const onSuccess = async (res) => {
  const token = await getToken(res.profileObj.name);
  localStorage.setItem('userToken', token);
  localStorage.setItem('username', res.profileObj.name);
  navigate('/', { replace: true });
 };
 const onFailure = (res) => {
  alert('Google Auth Failed');
  console.log('Login falied res: ', res);
 };
 return (
  <div style={{ textAlign: 'center' }}>
   <GoogleLogin
    clientId={clientId}
    buttonText='Login'
    onSuccess={onSuccess}
    onFailure={onFailure}
    cookiePolicy={'single_host_origin'}
    isSignedIn={true}
   />
  </div>
 );
}
