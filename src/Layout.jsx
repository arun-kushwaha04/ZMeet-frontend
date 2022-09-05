import React from 'react';
import { Container } from 'semantic-ui-react';
import Header from './components/header/Header';
import styled from 'styled-components';

const Contentcontainer = styled.section`
 flex-grow: 1;
 width: 100%;
`;
const Navigationcontainer = styled.nav`
 height: auto;
 width: 100%;
 .ui.menu {
  background-color: #ffcdff;
 }
`;

export default function Layout({ children }) {
 return (
  <Container
   style={{
    height: '100vh',
    display: 'flex',
    flexDirection: 'column',
   }}
  >
   <Navigationcontainer>
    <Header />
   </Navigationcontainer>
   <Contentcontainer>{children}</Contentcontainer>
  </Container>
 );
}
