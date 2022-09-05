import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { Menu } from 'semantic-ui-react';

const Linkdiv = styled.div`
 text-decoration: none;
 color: white;
 cursor: pointer;
 margin: auto 1rem;
 a {
  color: white;
  :hover {
   color: blue;
   text-decoration: underline;
  }
 }
`;

export default function Header() {
 return (
  <Menu style={{ marginTop: '10px' }}>
   <Link to='/'>
    <Menu.Item name='ZMeet' />
   </Link>
   <Menu.Menu position='right'>
    {/* <Linkdiv>
     <Link to='/'>
      <p>Create/Join Room</p>
     </Link>
    </Linkdiv> */}
    <Linkdiv>
     <Link to='/'>
      <p style={{ color: 'white' }}>
       Hello, {localStorage.getItem('username')}
      </p>
     </Link>
    </Linkdiv>
   </Menu.Menu>
  </Menu>
 );
}
