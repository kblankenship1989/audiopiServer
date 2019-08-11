import { hostname} from 'os';

export const SSEUrl = `http://${hostname()}:3000/sse`;
export const apiBaseUrl = `http://${hostname()}:3000/api`;
