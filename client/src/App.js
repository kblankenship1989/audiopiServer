import React, { useState, useEffect } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';

import { MainConnector } from './components/MainConnector';
import './App.css';
import { ConfigureStore } from './redux/configureStore';
import { SSEUrl } from './helpers/baseUrls';

const App = () => {
  const [eventSource, setEventSource] = useState();
  console.log(eventSource);
  const [SSEPandoraState, setSSEPandoraState] = useState();
  const [SSEPlayerState, setSSEPlayerState] = useState();
  const eventHandlers = {
    'pandora': (e) => setSSEPandoraState(e.data),
    'player': (e) => setSSEPlayerState(e.data)
  };

  useEffect(() => {
    console.log('called effect');
    if (!eventSource) {
      setEventSource(new EventSource(SSEUrl));
    } else {
      if (!eventSource.onopen) {
        eventSource.onopen = () => {
          console.log('Source opened!');
        }
      }
  
      if (!eventSource.onerror) {
        eventSource.onerror = () => {
          console.log(eventSource.readyState);
        }
      }
  
      Object.keys(eventHandlers).forEach((eventType) => {
        eventSource.addEventListener(eventType, (e) => {
          console.log(eventType);
          console.log(e);
          eventHandlers[eventType](e);
        });
      });
  
      return () => eventSource.close();
    }
  }, [eventSource]);

  return (
    <Provider store={ConfigureStore()}>
      <BrowserRouter>
        <div className="App">
          <MainConnector 
            SSEPandoraState={SSEPandoraState}
            SSEPlayerState={SSEPlayerState}
            />
        </div>
      </BrowserRouter>
    </Provider>
  );
}

export default App;
