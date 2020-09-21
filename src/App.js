import 'react-native-gesture-handler';
import {enableScreens} from 'react-native-screens';
import React, { Component } from 'react';
import {Provider} from 'react-redux';
import {createStore, applyMiddleware} from 'redux';
import ReduxThunk from 'redux-thunk';
import reducers from 'store/reducers';
import Router from './Router';

class App extends Component {
  render() {
    console.disableYellowBox = true;
    enableScreens();
    const store = createStore(reducers, {}, applyMiddleware(ReduxThunk));
    return (
      <Provider store={store}>
        <Router/>
      </Provider>      
    );
  }
}

export default App;