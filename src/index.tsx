import React from 'react';
import ReactDOM from 'react-dom';
import 'index.css';
import App from 'components/App/App';
import {store} from 'store/store';
import {Provider} from 'react-redux';
import * as serviceWorker from './serviceWorker';
import CssBaseline from "@material-ui/core/CssBaseline";
import axios from 'axios';

const githubAccountLogin = 'bdvx';
const password = 'TEST_PASSWORD';
const token = btoa(`${githubAccountLogin}:${password}`);
localStorage.setItem('authorization_token', token);

axios.interceptors.response.use(
  response => {
    return response;
  },
  function(error) {
    if (error?.response?.status === 400) {
      alert(error.response.data?.data);
      console.log(error.response.data?.data);
    } else if (error?.response?.status === 401 || error?.config?.headers?.Authorization === "Basic null") {
      alert('401 Unauthorized: Please check your credentials and try again.');
      console.log('401 Unauthorized: Please check your credentials and try again.');
    } else if (error?.response?.status === 403 || (error?.config?.headers?.Authorization && error?.config?.url?.includes('prod/import') && /Basic.*/.test(error?.config?.headers?.Authorization))) {
      alert('403 Forbidden: You do not have permission to access this resource.');
      console.log(`403 Forbidden: You do not have permission to access this resource.${error?.config?.headers?.Authorization}`);
    } else {
      console.log(`Unknown error, response: ${JSON.stringify(error)}`);
    }
    return Promise.reject(error?.response ?? error);
  }
);

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <CssBaseline/>
      <App/>
    </Provider>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
