import { useState, useRef, useEffect } from 'react';
import { useRecipe } from './hooks/useRecipe';
import { useSessions } from './hooks/useSessions';
import { ThemeProvider, useTheme } from './components/theme-provider';
import { BlockRenderer } from './components/BlockRenderer';
import { Button } from './components/ui/button';
import { Input } from './components/ui/input';
import { ScrollArea } from './components/ui/scroll-area';
import { Skeleton } from './components/ui/skeleton';
import { Moon, Sun, MessageSquarePlus, Send, History } from 'lucide-react';

function AppContent() {
  const { theme, setTheme } = useTheme();
  const [prompt, setPrompt] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);
  
  const { sessions, currentSessionId, setCurrentSessionId, loadSession, saveSession } = useSessions();
  const { blocks, history, isLoading, error, generate, stop, loadSessionState, setBlocks } = useRecipe();

  // Load session when ID changes
  useEffect(() => {
    if (currentSessionId) {
      const session = sessions.find(s => s.id === currentSessionId);
      if (session) {
        loadSessionState(session.blocks, session.history);
      }
    } else {
      setBlocks([]);
      loadSessionState([], []);
    }
  }, [currentSessionId]);

  // Save session when blocks or history change and not loading
  useEffect(() => {
    if (!isLoading && currentSessionId && blocks.length > 0) {
      saveSession(currentSessionId, blocks, history);
    }
  }, [isLoading, blocks, history, currentSessionId]);

  // Auto-scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [blocks, history, isLoading]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return;
    
    if (!currentSessionId) {
      setCurrentSessionId(); // Create new session ID if none
    }

    generate(prompt, history);
    setPrompt('');
  };

  const isDarkMode = theme === 'dark' || (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);

  return (
    <div className="flex h-screen bg-background text-foreground overflow-hidden font-sans antialiased transition-colors duration-300">
      
      {/* Sidebar for Sessions */}
      <div className="w-64 border-r bg-muted/30 flex flex-col hidden md:flex">
        <div className="p-4 flex items-center justify-between border-b">
          <h2 className="font-semibold text-lg flex items-center gap-2">
            <History className="w-5 h-5" />
            Sessions
          </h2>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => setCurrentSessionId(null)}
            title="New Session"
          >
            <MessageSquarePlus className="w-5 h-5" />
          </Button>
        </div>
        <ScrollArea className="flex-1">
          <div className="p-2 space-y-1">
            {sessions.map(s => (
              <Button
                key={s.id}
                variant={currentSessionId === s.id ? 'secondary' : 'ghost'}
                className="w-full justify-start text-left truncate"
                onClick={() => loadSession(s.id)}
              >
                {s.history[0]?.text.slice(0, 25) || 'New Recipe'}...
              </Button>
            ))}
            {sessions.length === 0 && (
              <p className="text-sm text-muted-foreground p-4 text-center">No past sessions.</p>
            )}
          </div>
        </ScrollArea>
      </div>

      {/* Main Chat/Recipe Area */}
      <div className="flex-1 flex flex-col relative h-full">
        {/* Top Navbar */}
        <header className="h-14 border-b flex items-center justify-between px-4 bg-background/80 backdrop-blur-md z-10">
          <div className="font-bold text-xl tracking-tight bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            Fridge-to-Recipe AI
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(isDarkMode ? 'light' : 'dark')}
          >
            {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </Button>
        </header>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-4 md:p-8" ref={scrollRef}>
          <div className="max-w-3xl mx-auto pb-24">
            
            {/* Empty State */}
            {!isLoading && blocks.length === 0 && history.length === 0 && (
              <div className="flex flex-col items-center justify-center h-full min-h-[40vh] text-center space-y-6">
                <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center">
                  <span className="text-4xl">🍳</span>
                </div>
                <div className="space-y-2">
                  <h2 className="text-3xl font-bold tracking-tight">What's in your fridge?</h2>
                  <p className="text-muted-foreground text-lg max-w-md">
                    Enter your ingredients and our AI will craft a delicious recipe, complete with macros and a checklist.
                  </p>
                </div>
              </div>
            )}

            {/* Error State */}
            {error && (
              <div className="p-4 mb-6 rounded-lg bg-destructive/10 text-destructive border border-destructive/20">
                <p className="font-semibold">Oops! Something went wrong.</p>
                <p className="text-sm opacity-90">
                  {error === 'PROVIDER_ERROR' ? "Couldn't reach the AI service. Check your connection or API key." : error}
                </p>
              </div>
            )}

            {/* Render Blocks */}
            <div className="space-y-6">
              {blocks.map((block, i) => (
                <BlockRenderer key={i} block={block} index={i} />
              ))}
            </div>

            {/* Loading Indicator */}
            {isLoading && (
              <div className="mt-8 space-y-4">
                <div className="flex items-center space-x-4">
                  <Skeleton className="h-12 w-12 rounded-full" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-[250px]" />
                    <Skeleton className="h-4 w-[200px]" />
                  </div>
                </div>
                <Skeleton className="h-[200px] w-full rounded-xl" />
              </div>
            )}
          </div>
        </div>

        {/* Input Bar */}
        <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-background via-background to-transparent pt-12">
          <form 
            onSubmit={handleSubmit}
            className="max-w-3xl mx-auto flex items-end gap-2 relative bg-background border rounded-2xl p-2 shadow-lg shadow-black/5 dark:shadow-black/20 focus-within:ring-2 ring-primary/20 transition-all"
          >
            <Input 
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder={blocks.length > 0 ? "Refine recipe (e.g. 'Make it spicier')" : "E.g., chicken, broccoli, rice..."}
              className="border-0 shadow-none focus-visible:ring-0 text-base md:text-lg h-12 flex-1"
              disabled={isLoading}
            />
            {isLoading ? (
              <Button type="button" variant="secondary" size="icon" className="h-12 w-12 rounded-xl" onClick={stop}>
                <span className="w-4 h-4 bg-foreground rounded-sm" />
              </Button>
            ) : (
              <Button type="submit" size="icon" className="h-12 w-12 rounded-xl" disabled={!prompt.trim()}>
                <Send className="w-5 h-5" />
              </Button>
            )}
          </form>
        </div>

      </div>
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider defaultTheme="system" storageKey="recipe-ui-theme">
      <AppContent />
    </ThemeProvider>
  );
}
