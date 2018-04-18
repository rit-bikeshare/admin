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
import { PersistGate } from 'redux-persist/integration/react';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import immutableTransform from 'redux-persist-transform-immutable';

import reducer from './app/reducers/rootReducer';
import LandingPage from './landing-page/components/LandingPage';
import AppContainer from './app/components/AppContainer';
import RequestManager from './api/RequestManager';
import getUserToken from './auth/selectors/getUserToken';
import getLoginQuery from './auth/utils/getLoginQuery';
import UserData from './auth/records/UserData';
import getBaseRequestUrl from './api/utils/getBaseRequestUrl';
import AuthSuccessView from './auth/components/AuthSuccessView';
import LoadingPage from './app/components/LoadingPage';

function createStore(reducer) {
  let store;
  const composeEnhancers =
    window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

  const getToken = () => getUserToken(store.getState());

  const createStoreWithMiddleware = composeEnhancers(
    applyMiddleware(thunk.withExtraArgument(new RequestManager(getToken)))
  )(createReduxStore);

  const config = {
    key: 'root',
    storage,
    whitelist: ['userData'],
    transforms: [immutableTransform({ records: [UserData] })],
  };

  const reducers = persistReducer(config, reducer);

  store = createStoreWithMiddleware(reducers);

  return store;
}

export default () => {
  const store = createStore(reducer);
  const persister = persistStore(store);

  ReactDOM.render(
    <Provider store={store}>
      <PersistGate loading={<LoadingPage />} persistor={persister}>
        <BrowserRouter>
          <Switch>
            <Route exact={true} path="/" component={LandingPage} />
            <Route path="/admin/auth/success" component={AuthSuccessView} />
            <Route path="/admin" component={AppContainer} />
            <Route
              path="/login"
              component={() => {
                window.location.replace(
                  `${getBaseRequestUrl()}/login/?${getLoginQuery()}=true`
                );
                return 'Login';
              }}
            />
            <Route component={() => 'No matching route'} />
          </Switch>
        </BrowserRouter>
      </PersistGate>
    </Provider>,
    document.getElementById('root')
  );
};
