import io from 'socket.io-client';
import { BACKEND_URL, PORT } from './urls';

let socket = io(`${BACKEND_URL}:${PORT}`);

console.log(socket);

export default socket;
