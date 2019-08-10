import { hostname} from 'os';

export const wsBaseUrl = `ws://${hostname()}:3000/ws`;
export const apiBaseUrl = `http://${hostname()}:3000/api`;
