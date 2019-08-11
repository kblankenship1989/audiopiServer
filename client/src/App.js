import React, { useState, useEffect } from 'react';
import {BrowserRouter} from 'react-router-dom';
import { Provider } from 'react-redux';

import { MainConnector } from './components/MainConnector';
import './App.css';
import { ConfigureStore } from './redux/configureStore';
import { SSEUrl } from './helpers/baseUrls';

const App = () => {
  const [eventSource, setEventSource] = useState();

  useEffect(() => {
    if (!eventSource) {
      setEventSource(new EventSource(SSEUrl));
    }
  }, [eventSource]);

  useEffect(() => {
    return () => eventSource.close();
  },[])

  return (
    <Provider store={ConfigureStore()}>
      <BrowserRouter>
        <div className="App">
          <MainConnector
            eventSource={eventSource}
            />
        </div>
      </BrowserRouter>
    </Provider>
  );
}

export default App;
