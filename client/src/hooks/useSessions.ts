import { useState, useEffect } from 'react';

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}

export interface Session {
  id: string;
  updatedAt: number;
  blocks: any[];
  history: ChatMessage[];
}

export function useSessions() {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem('recipe_sessions');
    if (stored) {
      try {
        setSessions(JSON.parse(stored));
      } catch (e) {
        // Error reading sessions
      }
    }
  }, []);

  const saveSession = (id: string, blocks: any[], history: ChatMessage[]) => {
    setSessions(prev => {
      const existing = prev.find(s => s.id === id);
      let updated: Session[];
      if (existing) {
        updated = prev.map(s => s.id === id ? { ...s, blocks, history, updatedAt: Date.now() } : s);
      } else {
        updated = [...prev, { id, blocks, history, updatedAt: Date.now() }];
      }
      localStorage.setItem('recipe_sessions', JSON.stringify(updated));
      return updated;
    });
  };

  const loadSession = (id: string) => {
    setCurrentSessionId(id);
  };

  const newSession = () => {
    setCurrentSessionId(Date.now().toString());
  };

  return {
    sessions,
    currentSessionId,
    setCurrentSessionId,
    newSession,
    loadSession,
    saveSession,
  };
}
