import React from 'react';
import {
 Menu,
 Sidebar,
 Input,
 Button,
 Container,
 Segment,
} from 'semantic-ui-react';
import styled from 'styled-components';

export default function Chats({ visible, setVisiblity }) {
 return (
  <Sidebar
   as={Div}
   animation='scale down'
   direction='right'
   inverted
   vertical
   visible={visible}
   onHide={() => setVisiblity(false)}
  >
   <Menu
    vertical
    fluid
    text
    style={{ flexGrow: '1', overflow: 'auto', paddingBottom: '4rem' }}
   >
    <Menu.Item header>In Call Chats</Menu.Item>
    <Menu.Item>
     <ChatMessage
      name='Arun'
      message='Hello Everyone'
      timestamp={1662223964000}
     />
    </Menu.Item>
   </Menu>
   <Chatdiv>
    <Input placeholder='Write your message' labelPosition='right'>
     <input />
     <Button>Send</Button>
    </Input>
   </Chatdiv>
  </Sidebar>
 );
}

const Div = styled.section`
 background-color: white;
 display: flex;
 padding-left: 1rem;
 flex-direction: column;
 ::-webkit-scrollbar {
  display: none;
 }
`;

const MessageDiv = styled.div`
 display: flex;
 flex-direction: column;
 margin-bottom: 1rem;
 p {
  margin: 0;
  font-size: 1rem;
  ::-webkit-scrollbar {
   display: none;
  }
 }
 small {
  font-size: 0.7rem;
  margin: 0;
 }
`;

const Chatdiv = styled.div`
 position: fixed;
 bottom: 0rem;
 left: 0rem;
`;

const ChatMessage = ({ name, message, timestamp }) => {
 return (
  <MessageDiv>
   <p>
    {name} &nbsp;<small>{getTimeFromTimestamp(timestamp)}</small>
   </p>
   <article>{message}</article>
  </MessageDiv>
 );
};

const getTimeFromTimestamp = (timestamp) => {
 const pad = (num) => ('0' + num).slice(-2);
 const date = new Date(timestamp * 1000);
 let hours = date.getHours(),
  minutes = date.getMinutes();
 return pad(hours) + ':' + pad(minutes);
};
