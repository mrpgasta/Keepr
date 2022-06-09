import React from 'react';
import ReactDOM from 'react-dom/client';
import * as ReactDOMClient from 'react-dom/client';
import App from './App';
import { store } from './redux/store';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';

const container = document.getElementById('root');
const root = ReactDOMClient.createRoot(container);

root.render(
  <React.StrictMode>
    <BrowserRouter>
      <Provider store={store}>
        <App />
      </Provider>
    </BrowserRouter>
  </React.StrictMode>
);