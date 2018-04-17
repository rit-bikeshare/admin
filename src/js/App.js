import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import thunk from 'redux-thunk';
import {
  applyMiddleware,
  createStore as createReduxStore,
  compose,
} from 'redux';
import { Provider } from 'react-redux';
import reducer from './app/reducers/rootReducer';

import LandingPage from './landing-page/components/LandingPage';
import AppContainer from './app/components/AppContainer';

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
          <Route exact={true} path="/" component={LandingPage} />
          <Route path="/admin" component={AppContainer} />
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
