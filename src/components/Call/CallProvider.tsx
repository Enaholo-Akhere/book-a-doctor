import { ReactNode, useEffect, useMemo, useState, useSyncExternalStore } from 'react';
import { useSocket } from '@/library/socket/socketContext';
import { CallContext, CallContextValue } from './callContext';
import { CallEngine } from './callEngine';
import CallOverlay from './CallOverlay';

const CallProvider = ({ children }: { children: ReactNode }) => {
  const { socket } = useSocket();
  const [engine] = useState(() => new CallEngine());

  useEffect(() => {
    engine.attach(socket);
    return () => engine.attach(null);
  }, [engine, socket]);

  useEffect(() => {
    window.addEventListener('pagehide', engine.handlePageHide);
    return () => window.removeEventListener('pagehide', engine.handlePageHide);
  }, [engine]);

  const state = useSyncExternalStore(engine.subscribe, engine.getState);

  const value = useMemo<CallContextValue>(
    () => ({
      ...state,
      startCall: engine.startCall,
      acceptCall: engine.acceptCall,
      rejectCall: engine.rejectCall,
      endCall: engine.endCall,
      toggleMute: engine.toggleMute,
      toggleCamera: engine.toggleCamera,
    }),
    [state, engine]
  );

  return (
    <CallContext.Provider value={value}>
      {children}
      <CallOverlay />
    </CallContext.Provider>
  );
};

export default CallProvider;
