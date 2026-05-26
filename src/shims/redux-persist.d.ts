declare module 'redux-persist/lib/storage' {
  import { WebStorage } from 'redux-persist';
  const storage: WebStorage;
  export default storage;
}

declare module 'redux-persist/integration/react' {
  import { ReactNode, PureComponent } from 'react';
  import { Persistor } from 'redux-persist';

  interface PersistGateProps {
    children?: ReactNode;
    loading?: ReactNode;
    persistor: Persistor;
    onBeforeLift?: () => void;
  }

  export class PersistGate extends PureComponent<PersistGateProps> {}
}
