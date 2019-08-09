import React from 'react';
import {BrowserRouter} from 'react-router-dom';
import { Provider } from 'react-redux';

import { MainConnector } from './components/MainConnector';
import './App.css';
import { ConfigureStore } from './redux/configureStore';

const App = () => {
  return (
    <Provider store={ConfigureStore()}>
      <BrowserRouter>
        <div className="App">
          <MainConnector />
        </div>
      </BrowserRouter>
    </Provider>
  );
}

export default App;
