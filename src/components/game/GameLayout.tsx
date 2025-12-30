import { useState } from 'react';
import { useGameEngine } from '@/hooks/useGameEngine';
import { StoryScreen } from './StoryScreen';
import { StatusDashboard } from './StatusDashboard';
import { DocumentViewer, DocumentCard } from './DocumentViewer';
import { Document } from '@/types/game';
import { cn } from '@/lib/utils';
import { FileText, Menu, X, Save, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { useToast } from '@/hooks/use-toast';

export function GameLayout() {
  const { 
    gameState, 
    getCurrentScene, 
    makeChoice, 
    newGame, 
    saveGame, 
    getDocument,
    userId 
  } = useGameEngine();
  
  const [showStatus, setShowStatus] = useState(true);
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null);
  const [documentsOpen, setDocumentsOpen] = useState(false);
  const { toast } = useToast();

  const currentScene = getCurrentScene();

  if (!currentScene) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center space-y-4">
          <h1 className="text-2xl font-narrative text-foreground">Scene not found</h1>
          <Button onClick={newGame}>Start New Game</Button>
        </div>
      </div>
    );
  }

  // Check if current scene ends with "ending_"
  const isEnding = gameState.currentScene.startsWith('ending_');

  const handleSave = async () => {
    if (!userId) {
      toast({
        title: "Sign in required",
        description: "Please sign in to save your progress.",
        variant: "destructive",
      });
      return;
    }
    
    const success = await saveGame(1, `Save - ${currentScene.title}`);
    if (success) {
      toast({
        title: "Game Saved",
        description: "Your progress has been saved.",
      });
    } else {
      toast({
        title: "Save Failed",
        description: "Could not save your game. Please try again.",
        variant: "destructive",
      });
    }
  };

  const unlockedDocs = gameState.unlockedDocuments
    .map(id => getDocument(id))
    .filter((doc): doc is Document => doc !== null);

  // Get current scene's available documents
  const sceneDocIds = currentScene.documents ?? [];

  return (
    <div className="min-h-screen flex bg-background noise-overlay">
      {/* Main Content */}
      <main className="flex-1 flex flex-col">
        {/* Top Bar */}
        <header className="h-14 border-b border-border/30 flex items-center justify-between px-4 md:px-6 bg-card/30">
          <div className="flex items-center gap-2">
            <h1 className="font-narrative text-lg text-primary">
              Chains of Influence
            </h1>
          </div>

          <div className="flex items-center gap-2">
            {/* Documents Button */}
            {unlockedDocs.length > 0 && (
              <Sheet open={documentsOpen} onOpenChange={setDocumentsOpen}>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="sm" className="gap-2">
                    <FileText className="w-4 h-4" />
                    <span className="hidden sm:inline">Documents</span>
                    <span className="text-xs bg-primary/20 text-primary px-1.5 py-0.5 rounded">
                      {unlockedDocs.length}
                    </span>
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-80 bg-card border-border">
                  <SheetHeader>
                    <SheetTitle className="text-foreground">Collected Documents</SheetTitle>
                  </SheetHeader>
                  <div className="mt-6 space-y-3">
                    {unlockedDocs.map((doc) => (
                      <DocumentCard
                        key={doc.id}
                        document={doc}
                        onClick={() => {
                          setSelectedDocument(doc);
                          setDocumentsOpen(false);
                        }}
                        isNew={sceneDocIds.includes(doc.id)}
                      />
                    ))}
                  </div>
                </SheetContent>
              </Sheet>
            )}

            {/* Save Button */}
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={handleSave}
              className="gap-2"
            >
              <Save className="w-4 h-4" />
              <span className="hidden sm:inline">Save</span>
            </Button>

            {/* New Game */}
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={newGame}
              className="gap-2 text-muted-foreground"
            >
              <RotateCcw className="w-4 h-4" />
              <span className="hidden sm:inline">Restart</span>
            </Button>

            {/* Status Toggle (mobile) */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowStatus(!showStatus)}
              className="md:hidden"
            >
              {showStatus ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </Button>
          </div>
        </header>

        {/* Story Area */}
        <div className="flex-1 overflow-y-auto">
          <div className="max-w-3xl mx-auto px-4 md:px-8 py-8 md:py-12">
            <StoryScreen 
              scene={currentScene} 
              onChoice={makeChoice}
            />

            {/* Ending Screen */}
            {isEnding && (
              <div className="mt-12 pt-8 border-t border-border/30 text-center space-y-6 fade-in">
                <p className="text-muted-foreground uppercase tracking-widest text-sm">
                  End of Demo
                </p>
                <h2 className="font-narrative text-3xl text-primary text-glow">
                  To Be Continued...
                </h2>
                <p className="text-foreground/70 max-w-md mx-auto">
                  This concludes the Whistleblower&apos;s Dilemma demo. Your choices have shaped this story.
                </p>
                <Button onClick={newGame} className="mt-4">
                  Play Again
                </Button>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Status Sidebar - Desktop */}
      <div className={cn(
        "hidden md:block transition-all duration-300",
        showStatus ? "w-72" : "w-0"
      )}>
        {showStatus && (
          <StatusDashboard 
            gameState={gameState} 
            onToggle={() => setShowStatus(false)}
          />
        )}
      </div>

      {/* Status Sidebar - Mobile */}
      <Sheet open={showStatus} onOpenChange={setShowStatus}>
        <SheetContent side="right" className="w-72 p-0 md:hidden bg-card border-border">
          <StatusDashboard gameState={gameState} />
        </SheetContent>
      </Sheet>

      {/* Collapsed Status Toggle */}
      {!showStatus && (
        <StatusDashboard 
          gameState={gameState} 
          collapsed 
          onToggle={() => setShowStatus(true)} 
        />
      )}

      {/* Document Viewer Modal */}
      {selectedDocument && (
        <DocumentViewer
          document={selectedDocument}
          open={!!selectedDocument}
          onClose={() => setSelectedDocument(null)}
        />
      )}
    </div>
  );
}
