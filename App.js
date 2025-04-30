import React from 'react';
import {StatusBar} from 'react-native';
import {Provider} from 'react-redux';
import {PersistGate} from 'redux-persist/integration/react';
import {MenuProvider} from 'react-native-popup-menu';

import Routes from './src/routes';
import {colors} from './src/styles';
import {store, persistor} from './src/store/index';

const App = () => {
  return (
    <Provider store={store}>
      <PersistGate persistor={persistor} loading={null}>
        <>
          <StatusBar
            barStyle="light-content"
            backgroundColor={colors.primary}
          />
          <MenuProvider>
            <Routes />
          </MenuProvider>
        </>
      </PersistGate>
    </Provider>
  );
};

export default App;
