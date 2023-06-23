import { useEffect } from 'react';
// store
import Store from './store/Store';
// routes
import Router from './routes';
// theme
import ThemeConfig from './theme';
// components
import ScrollToTop from './components/ScrollToTop';
// axios
import api from './api/Api'
// ----------------------------------------------------------------------

const getApiUrl = () => {
  var request = new XMLHttpRequest();

  request.open("GET", document.location.origin, false);
  request.send();

  if (request.readyState === 4)
    if (request.getResponseHeader('X-API-ADDRESS') === null || request.getResponseHeader('X-API-ADDRESS') === undefined) {
      return 'http://127.0.0.1:8000';
    }
    else {
      return request.getResponseHeader('X-API-ADDRESS');
    }
}

const baseUrl = getApiUrl();
api.defaults.baseURL = baseUrl;

export default function App() {

  return (
    <Store>
      <ThemeConfig>
        <ScrollToTop />
        <Router />
      </ThemeConfig>
    </Store>
  );
}
