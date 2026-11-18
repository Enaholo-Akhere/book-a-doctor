import { create } from 'zustand';

/**
 * UI state of the floating chat widget. Global so any part of the app
 * (dashboards, /chat route, notifications) can open a conversation.
 */
interface ChatUIState {
  isOpen: boolean;
  view: 'list' | 'room';
  activePeerId: string | null;
  openList: () => void;
  openRoom: (peerId: string) => void;
  close: () => void;
}

export const useChatUIStore = create<ChatUIState>()((set) => ({
  isOpen: false,
  view: 'list',
  activePeerId: null,
  openList: () => set({ isOpen: true, view: 'list', activePeerId: null }),
  openRoom: (peerId) => set({ isOpen: true, view: 'room', activePeerId: peerId }),
  close: () => set({ isOpen: false, view: 'list', activePeerId: null }),
}));

/** True when the user is actually looking at the conversation with `peerId`. */
export const isViewingConversation = (peerId: string) => {
  const { isOpen, view, activePeerId } = useChatUIStore.getState();
  return isOpen && view === 'room' && activePeerId === peerId && document.visibilityState === 'visible';
};
