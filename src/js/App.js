import '../styles/css/index.css';
import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import thunk from 'redux-thunk';
import {
  applyMiddleware,
  createStore as createReduxStore,
  compose
} from 'redux';
import { Provider } from 'react-redux';
import reducer from './redux';
import Home from './components/Home';
import Bikes from './components/Bikes';
import BikeRacks from './components/BikeRacks';

function createStore(reducer) {
  const composeEnhancers =
    window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

  const createStoreWithMiddleware = composeEnhancers(applyMiddleware(thunk))(
    createReduxStore
  );

  return createStoreWithMiddleware(reducer);
}

export default () => {
  const store = createStore(reducer);
  ReactDOM.render(
    <Provider store={store}>
      <BrowserRouter>
        <Switch>
          <Route exact={true} path="/" component={Home} />
          <Route path="/bikes" component={Bikes} />
          <Route path="/bike-racks" component={BikeRacks} />
          <Route path="/users" component={() => 'Users'} />
          <Route path="/maintenance" component={() => 'Maintenance'} />
          <Route path="/settings" component={() => 'Settings'} />

          <Route
            path="/login"
            component={() => {
              window.location.replace(
                'https://bikesharedev.rit.edu/api/login/'
              );
              return 'Login';
            }}
          />
          <Route component={() => 'No matching route'} />
        </Switch>
      </BrowserRouter>
    </Provider>,
    document.getElementById('root')
  );
};
