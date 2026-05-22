import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  BookOpen, 
  Compass, 
  Search, 
  CheckSquare, 
  Trash2, 
  Copy, 
  Check, 
  MessageSquare, 
  Plus, 
  ExternalLink,
  Loader2,
  RefreshCw,
  FileText,
  Briefcase,
  Layers,
  ChevronRight,
  Info
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface ChecklistItem {
  id: string;
  text: string;
  phase: string;
  subtasks: string[];
  completedSubtasks?: string[]; 
  completed?: boolean;
}

interface ChatMessage {
  role: 'user' | 'model';
  text: string;
  timestamp: string;
}

export default function App() {
  // Navigation Tabs
  const [activeTab, setActiveTab] = useState<'bench' | 'checklist' | 'chat' | 'research'>('bench');

  // Text Editor State
  const [editorText, setEditorText] = useState(() => {
    return localStorage.getItem('ai_ws_editor_text') || 
      '# Project Catalyst\n\nGoals for my new application:\n1. Create a fast and secure file converter.\n2. Needs to handle drag-and-drop file uploads up to 50MB.\n3. Implement a modern desktop-first dashboard layout with responsive mobile drawers.\n4. Design a dark visual style with micro-animations.';
  });
  
  const [refinedOutput, setRefinedOutput] = useState(() => {
    return localStorage.getItem('ai_ws_refined_output') || '';
  });

  const [isRefining, setIsRefining] = useState(false);

  // Checklist State
  const [checklist, setChecklist] = useState<ChecklistItem[]>(() => {
    const saved = localStorage.getItem('ai_ws_checklist');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { return []; }
    }
    // Default initial template
    return [
      {
        id: 'setup-env',
        text: 'Configure workspace environments and system dependencies',
        phase: 'Phase 1: Foundation',
        subtasks: [
          'Verify Node.js version and package configurations',
          'Create initial Vite project using TypeScript',
          'Import tailwindcss and configure style theme variables'
        ],
        completedSubtasks: [],
        completed: false
      },
      {
        id: 'build-ui',
        text: 'Implement primary core workspace views and layout containers',
        phase: 'Phase 2: Core Interface',
        subtasks: [
          'Design elegant responsive layout grids',
          'Create visual interaction states and interactive sidebar tabs',
          'Enable local state sync triggers with standard browser storage'
        ],
        completedSubtasks: [],
        completed: false
      }
    ];
  });

  const [newPhase, setNewPhase] = useState('Phase 1: Foundation');
  const [newGoal, setNewGoal] = useState('');
  const [newSubtasksString, setNewSubtasksString] = useState('');

  // Persona Chat State
  const [selectedPersona, setSelectedPersona] = useState<'architect' | 'aesthetic' | 'copywriter' | 'strategist'>('strategist');
  const [chatHistory, setChatHistory] = useState<Record<string, ChatMessage[]>>(() => {
    const saved = localStorage.getItem('ai_ws_chats');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { return {}; }
    }
    return {
      architect: [],
      aesthetic: [],
      copywriter: [],
      strategist: []
    };
  });
  const [chatInput, setChatInput] = useState('');
  const [isChatting, setIsChatting] = useState(false);

  // Grounded Research State
  const [searchQuery, setSearchQuery] = useState(() => {
    return localStorage.getItem('ai_ws_search_query') || 'What are the core architecture upgrades introduced in React 19?';
  });
  const [researchResult, setResearchResult] = useState(() => {
    return localStorage.getItem('ai_ws_research_result') || '';
  });
  const [researchSources, setResearchSources] = useState<Array<{ title: string; url: string }>>(() => {
    const saved = localStorage.getItem('ai_ws_research_sources');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { return []; }
    }
    return [];
  });
  const [isResearching, setIsResearching] = useState(false);

  // General Status Notifications
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Local Storage Synchronizations
  useEffect(() => {
    localStorage.setItem('ai_ws_editor_text', editorText);
  }, [editorText]);

  useEffect(() => {
    localStorage.setItem('ai_ws_refined_output', refinedOutput);
  }, [refinedOutput]);

  useEffect(() => {
    localStorage.setItem('ai_ws_checklist', JSON.stringify(checklist));
  }, [checklist]);

  useEffect(() => {
    localStorage.setItem('ai_ws_chats', JSON.stringify(chatHistory));
  }, [chatHistory]);

  useEffect(() => {
    localStorage.setItem('ai_ws_search_query', searchQuery);
    localStorage.setItem('ai_ws_research_result', researchResult);
    localStorage.setItem('ai_ws_research_sources', JSON.stringify(researchSources));
  }, [searchQuery, researchResult, researchSources]);

  // Toast helper
  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  // Copy helper
  const handleCopyText = (text: string) => {
    navigator.clipboard.writeText(text);
    triggerToast('Content successfully copied to clipboard!');
  };

  // 1. Core API calls
  const handleTextRefinement = async (action: 'expand' | 'summarize' | 'simplify' | 'checklist') => {
    if (!editorText.trim()) {
      triggerToast('Please write some thoughts inside the editor first.');
      return;
    }

    setIsRefining(true);
    try {
      const response = await fetch('/api/refine', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: editorText, action }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Server error during refinement');
      }

      if (action === 'checklist') {
        if (data.checklist && Array.isArray(data.checklist)) {
          const formatted: ChecklistItem[] = data.checklist.map((item: any, i: number) => ({
            id: item.id || `ai-item-${Date.now()}-${i}`,
            text: item.text || 'Unlabeled Step',
            phase: item.phase || 'AI Generated Phase',
            subtasks: Array.isArray(item.subtasks) ? item.subtasks : [],
            completedSubtasks: [],
            completed: false
          }));
          setChecklist(formatted);
          setActiveTab('checklist');
          triggerToast('Successfully generated structured checklist milestones!');
        } else {
          throw new Error('Incomplete structure in check-plan return');
        }
      } else {
        setRefinedOutput(data.text);
        triggerToast('Prose successfully refined by model.');
      }
    } catch (err: any) {
      console.error(err);
      triggerToast(`Refinement failed: ${err.message}`);
    } finally {
      setIsRefining(false);
    }
  };

  // Checklist Actions
  const toggleSubtask = (itemId: string, subtask: string) => {
    setChecklist(prev => prev.map(item => {
      if (item.id === itemId) {
        const completedSubtasks = item.completedSubtasks || [];
        const isCompleted = completedSubtasks.includes(subtask);
        const updated = isCompleted 
          ? completedSubtasks.filter(s => s !== subtask)
          : [...completedSubtasks, subtask];
        
        // If all subtasks are finished, check the parent
        const parentCompleted = updated.length === item.subtasks.length && item.subtasks.length > 0;

        return { ...item, completedSubtasks: updated, completed: parentCompleted };
      }
      return item;
    }));
  };

  const toggleParentItem = (itemId: string) => {
    setChecklist(prev => prev.map(item => {
      if (item.id === itemId) {
        const targetState = !item.completed;
        return {
          ...item,
          completed: targetState,
          completedSubtasks: targetState ? [...item.subtasks] : []
        };
      }
      return item;
    }));
  };

  const deleteChecklistItem = (itemId: string) => {
    setChecklist(prev => prev.filter(item => item.id !== itemId));
    triggerToast('Item removed from your workspace list.');
  };

  const handleAddManualItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGoal.trim()) return;

    const subs = newSubtasksString
      .split('\n')
      .map(s => s.trim())
      .filter(s => s.length > 0);

    const newItem: ChecklistItem = {
      id: `manual-${Date.now()}`,
      text: newGoal,
      phase: newPhase || 'General Work',
      subtasks: subs,
      completedSubtasks: [],
      completed: false
    };

    setChecklist(prev => [...prev, newItem]);
    setNewGoal('');
    setNewSubtasksString('');
    triggerToast('Added custom checklist item successfully.');
  };

  // Draft a detailed AI guide based on checklist item context
  const draftDetailFromGoal = async (item: ChecklistItem) => {
    setActiveTab('bench');
    setEditorText(prev => `${prev}\n\n## Deep Dive Guide: ${item.text}\n*Phase: ${item.phase}*\n`);
    triggerToast('Prompting specialist to draft custom guide in your editor...');

    setIsRefining(true);
    try {
      const prompt = `Write a pristine, detailed technical guide, execution steps, and best practices focusing specifically on:
Goal: "${item.text}"
Contextual phase: "${item.phase}"
Subtasks of focus: ${JSON.stringify(item.subtasks)}

Please format your response in elegant, clear markdown with clear structural headers and clean bullet/code points.`;

      const response = await fetch('/api/refine', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: prompt, action: 'expand' }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Server error generating deep dive');
      }

      setEditorText(prev => `${prev}\n${data.text}`);
      triggerToast('AI Guide appended to editor!');
    } catch (err: any) {
      console.error(err);
      triggerToast(`Drafting guide failed: ${err.message}`);
    } finally {
      setIsRefining(false);
    }
  };

  // 2. Chat Persona
  const submitChat = async (presetPrompt?: string) => {
    const textToSubmit = presetPrompt || chatInput;
    if (!textToSubmit.trim()) return;

    const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const userMsg: ChatMessage = { role: 'user', text: textToSubmit, timestamp };

    // Append user message immediately
    setChatHistory(prev => ({
      ...prev,
      [selectedPersona]: [...(prev[selectedPersona] || []), userMsg]
    }));
    
    if (!presetPrompt) setChatInput('');
    setIsChatting(true);

    try {
      // Gather relevant history for the request
      const activeHistory = chatHistory[selectedPersona] || [];
      const historyPayload = activeHistory.slice(-6).map(h => ({
        role: h.role,
        text: h.text
      }));

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          message: textToSubmit, 
          history: historyPayload, 
          persona: selectedPersona 
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Failed to brainstorm');
      }

      const modelMsg: ChatMessage = { 
        role: 'model', 
        text: data.text, 
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) 
      };

      setChatHistory(prev => ({
        ...prev,
        [selectedPersona]: [...(prev[selectedPersona] || []), modelMsg]
      }));
    } catch (err: any) {
      console.error(err);
      triggerToast(`Chat error: ${err.message}`);
    } finally {
      setIsChatting(false);
    }
  };

  const clearChatHistory = () => {
    setChatHistory(prev => ({
      ...prev,
      [selectedPersona]: []
    }));
    triggerToast('Conversation cleared.');
  };

  // 3. Grounded web research
  const queryWebGroundedDetails = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!searchQuery.trim()) return;

    setIsResearching(true);
    try {
      const response = await fetch('/api/grounding', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: searchQuery }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Grounded searching failed');
      }

      setResearchResult(data.text);
      setResearchSources(data.sources || []);
      triggerToast('Grounded web references retrieved successfully!');
    } catch (err: any) {
      console.error(err);
      triggerToast(`Research error: ${err.message}`);
    } finally {
      setIsResearching(false);
    }
  };

  // Calculate Overall checklist progress
  const totalSubtasks = checklist.reduce((acc, curr) => acc + curr.subtasks.length, 0);
  const completedSubtasksCount = checklist.reduce((acc, curr) => acc + (curr.completedSubtasks?.length || 0), 0);
  const percentComplete = totalSubtasks > 0 ? Math.round((completedSubtasksCount / totalSubtasks) * 100) : 0;

  // Checklist phases list
  const activePhases = Array.from(new Set(checklist.map(item => item.phase))) as string[];

  return (
    <div className="min-h-screen bg-neutral-50 text-neutral-800 font-sans antialiased flex flex-col selection:bg-neutral-900 selection:text-white" id="workspace_root">
      
      {/* Header Panel */}
      <header className="border-b border-neutral-200/80 bg-white sticky top-0 z-40 backdrop-blur-md" id="main_header">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-neutral-900 rounded-xl text-white shadow-sm flex items-center justify-center">
              <Layers className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight text-neutral-900">AI Workspace</h1>
              <p className="text-xs text-neutral-500 font-mono flex items-center gap-1.5 mt-0.5">
                <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                Vite + React 19 Full-Stack Server Ready
              </p>
            </div>
          </div>

          {/* Tab Navigation */}
          <nav className="flex bg-neutral-100 p-1 rounded-xl w-full sm:w-auto" id="navigation_tabs">
            <button
              onClick={() => setActiveTab('bench')}
              className={`flex-1 sm:flex-initial flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                activeTab === 'bench' 
                  ? 'bg-white text-neutral-900 shadow-sm' 
                  : 'text-neutral-600 hover:text-neutral-950'
              }`}
              id="tab_bench"
            >
              <BookOpen className="h-4 w-4" />
              <span>AI Bench</span>
            </button>
            <button
              onClick={() => setActiveTab('checklist')}
              className={`flex-1 sm:flex-initial flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 relative ${
                activeTab === 'checklist' 
                  ? 'bg-white text-neutral-900 shadow-sm' 
                  : 'text-neutral-600 hover:text-neutral-950'
              }`}
              id="tab_checklist"
            >
              <CheckSquare className="h-4 w-4" />
              <span>Project Checklist</span>
              {percentComplete > 0 && (
                <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-neutral-900 text-[10px] font-bold text-white">
                  {percentComplete}%
                </span>
              )}
            </button>
            <button
              onClick={() => setActiveTab('chat')}
              className={`flex-1 sm:flex-initial flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                activeTab === 'chat' 
                  ? 'bg-white text-neutral-900 shadow-sm' 
                  : 'text-neutral-600 hover:text-neutral-950'
              }`}
              id="tab_chat"
            >
              <MessageSquare className="h-4 w-4" />
              <span>Persona Chat</span>
            </button>
            <button
              onClick={() => setActiveTab('research')}
              className={`flex-1 sm:flex-initial flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                activeTab === 'research' 
                  ? 'bg-white text-neutral-900 shadow-sm' 
                  : 'text-neutral-600 hover:text-neutral-950'
              }`}
              id="tab_research"
            >
              <Search className="h-4 w-4" />
              <span>Grounded Research</span>
            </button>
          </nav>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col relative" id="layout_main">
        
        {/* Toast Toast Alert */}
        <AnimatePresence>
          {toastMessage && (
            <motion.div
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              className="absolute top-4 left-1/2 -translate-x-1/2 z-50 bg-neutral-950 text-white font-medium text-xs px-4 py-3 rounded-xl shadow-lg border border-neutral-800 flex items-center gap-2.5 max-w-md"
              id="toast_container"
            >
              <Sparkles className="h-4 w-4 text-amber-400 shrink-0" />
              <span>{toastMessage}</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Outer Grid content mapping based on tabs */}
        <div className="flex-1" id="tab_contents">
          
          {/* TAB 1: AI BENCH / EDITOR */}
          {activeTab === 'bench' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start" id="bench_view">
              
              {/* Writer Field */}
              <div className="lg:col-span-7 flex flex-col h-full bg-white border border-neutral-200/80 rounded-2xl shadow-sm overflow-hidden" id="editor_card">
                <div className="px-6 py-4 border-b border-neutral-100 flex items-center justify-between bg-neutral-50/50">
                  <div className="flex items-center gap-2">
                    <FileText className="h-4, w-4 text-neutral-500" />
                    <span className="text-sm font-semibold text-neutral-800">Workspace Editor Draft</span>
                  </div>
                  <span className="text-[11px] font-mono text-neutral-400 bg-white border border-neutral-150 px-2 py-0.5 rounded-md">
                    {editorText.length} characters
                  </span>
                </div>
                
                <div className="p-6 flex-1 flex flex-col">
                  <textarea
                    value={editorText}
                    onChange={(e) => setEditorText(e.target.value)}
                    placeholder="Enter your thoughts, checklist drafts, or plan outline here..."
                    className="w-full flex-1 min-h-[350px] lg:min-h-[450px] resize-none border-0 p-0 focus:ring-0 text-sm leading-relaxed text-neutral-800 bg-transparent placeholder-neutral-400 outline-none font-sans"
                    id="main_text_editor"
                  />
                  
                  {/* Form Action Controls */}
                  <div className="mt-6 pt-4 border-t border-neutral-150 flex flex-wrap gap-2.5">
                    <button
                      onClick={() => handleTextRefinement('expand')}
                      disabled={isRefining || !editorText.trim()}
                      className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-neutral-700 bg-neutral-100 hover:bg-neutral-200 active:bg-neutral-300 rounded-lg transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                      title="Generates complete background content to expand concepts"
                    >
                      <Sparkles className="h-3.5 w-3.5 text-neutral-500" />
                      Expand Points
                    </button>
                    <button
                      onClick={() => handleTextRefinement('simplify')}
                      disabled={isRefining || !editorText.trim()}
                      className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-neutral-700 bg-neutral-100 hover:bg-neutral-200 active:bg-neutral-300 rounded-lg transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                      title="Simplify technical descriptions down to direct prose"
                    >
                      <Layers className="h-3.5 w-3.5 text-neutral-500" />
                      Simplification
                    </button>
                    <button
                      onClick={() => handleTextRefinement('summarize')}
                      disabled={isRefining || !editorText.trim()}
                      className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-neutral-700 bg-neutral-100 hover:bg-neutral-200 active:bg-neutral-300 rounded-lg transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                      title="Boil details down into elegant highlights"
                    >
                      <BookOpen className="h-3.5 w-3.5 text-neutral-500" />
                      Highlight Summary
                    </button>
                    <div className="ml-auto w-full sm:w-auto mt-2 sm:mt-0">
                      <button
                        onClick={() => handleTextRefinement('checklist')}
                        disabled={isRefining || !editorText.trim()}
                        className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-4.5 py-2 text-xs font-bold text-white bg-neutral-950 hover:bg-neutral-900 active:bg-neutral-800 rounded-lg shadow-sm transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                        title="Analyze content to automatically structure action milestones"
                      >
                        {isRefining ? (
                          <Loader2 className="h-3.5 w-3.5 animate-spin" />
                        ) : (
                          <CheckSquare className="h-3.5 w-3.5 text-amber-400" />
                        )}
                        <span>Structure Checklist</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Output & Guidelines Side */}
              <div className="lg:col-span-5 flex flex-col gap-6" id="editor_sidebar">
                
                {/* Processed output card */}
                <div className="bg-white border border-neutral-200/80 rounded-2xl shadow-sm overflow-hidden flex flex-col" id="refined_output_panel">
                  <div className="px-6 py-4 border-b border-neutral-100 flex items-center justify-between bg-neutral-50/50">
                    <span className="text-sm font-semibold text-neutral-800">AI Refined Content</span>
                    {refinedOutput && (
                      <button 
                        onClick={() => handleCopyText(refinedOutput)}
                        className="p-1 px-2.5 bg-neutral-100 hover:bg-neutral-200 active:bg-neutral-300 rounded-md text-neutral-600 hover:text-neutral-800 text-[11px] font-medium flex items-center gap-1 transition-all cursor-pointer"
                      >
                        <Copy className="h-3 w-3" />
                        Copy text
                      </button>
                    )}
                  </div>
                  
                  <div className="p-6 min-h-[220px] flex flex-col justify-between">
                    {isRefining ? (
                      <div className="flex-1 flex flex-col items-center justify-center text-center p-8">
                        <Loader2 className="h-8 w-8 animate-spin text-neutral-800 mb-2" />
                        <p className="text-xs font-medium text-neutral-500">Gemini 3.5 is analyzing and refining your workspace content...</p>
                      </div>
                    ) : refinedOutput ? (
                      <div className="prose prose-sm text-neutral-700 max-w-none whitespace-pre-line leading-relaxed text-sm">
                        {refinedOutput}
                      </div>
                    ) : (
                      <div className="flex-1 flex flex-col items-center justify-center text-center p-8 border-2 border-dashed border-neutral-200/50 rounded-xl bg-neutral-50/30">
                        <Sparkles className="h-6 w-6 text-neutral-300 mb-2" />
                        <p className="text-xs text-neutral-400 max-w-[260px] leading-relaxed">
                          Your refined prose will appear here. Select one of the refinement actions to transform your draft.
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Integration Info widget */}
                <div className="bg-neutral-900 text-neutral-100 rounded-2xl p-6 shadow-sm border border-neutral-800 relative overflow-hidden" id="tip_card">
                  <div className="absolute right-0 top-0 translate-x-1/4 -translate-y-1/4 w-32 h-32 bg-white/2 rounded-full blur-2xl"></div>
                  <div className="flex items-start gap-3">
                    <Info className="h-5 w-5 text-amber-300 shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-semibold text-sm text-neutral-50">Checklist Bridge Concept</h4>
                      <p className="text-xs text-neutral-400 mt-1.5 leading-relaxed">
                        When you write detailed goals or guidelines in the draft editor, click <strong className="text-neutral-200 font-medium">Structure Checklist</strong>. Gemini automatically parses your points, categories milestones, and designs a multi-phase checkbox plan.
                      </p>
                      <p className="text-xs text-neutral-400 mt-2.5 leading-relaxed">
                        In the checklist tab, clicking <strong className="text-neutral-200 font-medium">Draft execution guide</strong> will trigger Gemini to expand on that specific step and append the rich architectural steps right back into this workspace editor.
                      </p>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          )}

          {/* TAB 2: PROJECT CHECKLIST */}
          {activeTab === 'checklist' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start" id="checklist_view">
              
              {/* Checklist list panel */}
              <div className="lg:col-span-8 flex flex-col gap-6" id="checklist_list_container">
                
                {/* Dynamic master progress header */}
                <div className="bg-white border border-neutral-200/80 rounded-2xl p-6 shadow-sm flex flex-col md:flex-row items-center md:justify-between gap-6" id="progress_card">
                  <div className="flex items-center gap-4">
                    <div className="relative flex items-center justify-center">
                      {/* Round Progress Ring placeholder or clean bar */}
                      <div className="h-14 w-14 rounded-full border-[3.5px] border-neutral-150 flex items-center justify-center font-mono font-bold text-sm text-neutral-800 relative">
                        {percentComplete}%
                        <div 
                          className="absolute inset-0 rounded-full border-[3.5px] border-neutral-900 transition-all duration-300"
                          style={{ clipPath: `inset(0 0 0 0)` }} // optional fine decoration
                        ></div>
                      </div>
                    </div>
                    <div>
                      <h3 className="font-bold text-neutral-900">Project Workspace Progress</h3>
                      <p className="text-xs text-neutral-500 mt-0.5">
                        {completedSubtasksCount} of {totalSubtasks} granular milestones achieved complete.
                      </p>
                    </div>
                  </div>
                  
                  {/* Wide Horizontal Progress slider */}
                  <div className="w-full md:w-60 flex flex-col gap-1.5">
                    <div className="flex justify-between items-center text-[10px] text-neutral-400 font-mono">
                      <span>PLAN INTEGRATION</span>
                      <span>{percentComplete}% COMPLETE</span>
                    </div>
                    <div className="h-2 bg-neutral-100 rounded-full overflow-hidden border border-neutral-200/40">
                      <motion.div 
                        className="h-full bg-neutral-900 rounded-full"
                        initial={{ width: 0 }}
                        animate={{ width: `${percentComplete}%` }}
                        transition={{ duration: 0.4, ease: 'easeOut' }}
                      />
                    </div>
                  </div>
                </div>

                {/* Checklist grouped rendering */}
                {checklist.length === 0 ? (
                  <div className="bg-white border border-neutral-200/80 rounded-2xl p-12 text-center flex flex-col items-center justify-center" id="empty_list">
                    <CheckSquare className="h-10 w-10 text-neutral-300 mb-3" />
                    <p className="font-semibold text-neutral-700">No active milestones in checklist</p>
                    <p className="text-xs text-neutral-400 max-w-sm mt-1 leading-relaxed">
                      Write an idea or paste task outlines in the <strong className="text-neutral-600 font-medium">Text Bench</strong> tab and click <strong className="text-neutral-600 font-medium">Structure Checklist</strong>, or add items manually on the side.
                    </p>
                  </div>
                ) : (
                  <div className="flex flex-col gap-6" id="checkpoints_grouped">
                    {/* Unique Category phases */}
                    {activePhases.map((phaseName) => {
                      const phaseItems = checklist.filter(item => item.phase === phaseName);
                      return (
                        <div key={phaseName} className="flex flex-col gap-3" id={`phase_group_${phaseName.replace(/\s+/g, '_')}`}>
                          <div className="flex items-center gap-2 px-1">
                            <span className="text-xs font-mono font-bold tracking-wider text-neutral-400 uppercase">{phaseName}</span>
                            <div className="flex-1 h-[1px] bg-neutral-200/60"></div>
                          </div>

                          <div className="flex flex-col gap-3">
                            <AnimatePresence initial={false}>
                              {phaseItems.map((item) => (
                                <motion.div
                                  key={item.id}
                                  initial={{ opacity: 0, y: 10 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  exit={{ opacity: 0, scale: 0.95 }}
                                  transition={{ duration: 0.2 }}
                                  className={`bg-white border rounded-xl overflow-hidden shadow-sm transition-all duration-300 ${
                                    item.completed 
                                      ? 'border-neutral-200/60 opacity-80 bg-neutral-50/20' 
                                      : 'border-neutral-200/80'
                                  }`}
                                  id={`checklist_item_${item.id}`}
                                >
                                  
                                  {/* Item Header bar */}
                                  <div className="px-5 py-4 flex items-start justify-between gap-4">
                                    <div className="flex items-start gap-3">
                                      <button 
                                        onClick={() => toggleParentItem(item.id)}
                                        className={`mt-0.5 h-5 w-5 rounded border flex items-center justify-center cursor-pointer transition-all ${
                                          item.completed 
                                            ? 'bg-neutral-900 border-neutral-900 text-white'
                                            : 'border-neutral-300 hover:border-neutral-800'
                                        }`}
                                      >
                                        {item.completed && <Check className="h-3 w-3" />}
                                      </button>
                                      <div>
                                        <p className={`text-sm font-semibold leading-relaxed ${
                                          item.completed ? 'text-neutral-500 line-through' : 'text-neutral-800'
                                        }`}>
                                          {item.text}
                                        </p>
                                        
                                        {/* Actions bar inline */}
                                        <div className="flex items-center gap-4 mt-2">
                                          <button
                                            onClick={() => draftDetailFromGoal(item)}
                                            className="text-xs text-neutral-500 hover:text-neutral-900 font-medium inline-flex items-center gap-1 transition-all cursor-pointer"
                                            title="Generates complete background content step-by-step and appends to the editor"
                                          >
                                            <Sparkles className="h-3 w-3 text-amber-500" />
                                            <span>Draft execution guide</span>
                                          </button>
                                        </div>
                                      </div>
                                    </div>
                                    
                                    <button 
                                      onClick={() => deleteChecklistItem(item.id)}
                                      className="p-1 bg-transparent hover:bg-neutral-100 rounded-lg text-neutral-400 hover:text-red-500 transition-colors cursor-pointer"
                                      title="Remove from list"
                                    >
                                      <Trash2 className="h-4 w-4" />
                                    </button>
                                  </div>

                                  {/* Render Subtasks Sub List elements */}
                                  {item.subtasks && item.subtasks.length > 0 && (
                                    <div className="bg-neutral-50/50 border-t border-neutral-100 px-5 py-3.5 flex flex-col gap-2.5">
                                      {item.subtasks.map((sub, index) => {
                                        const isSubCompleted = (item.completedSubtasks || []).includes(sub);
                                        return (
                                          <div key={index} className="flex items-center gap-3 pl-3 text-xs">
                                            <button 
                                              onClick={() => toggleSubtask(item.id, sub)}
                                              className={`h-4 w-4 rounded border flex items-center justify-center transition-all cursor-pointer ${
                                                isSubCompleted 
                                                  ? 'bg-neutral-800 border-neutral-800 text-white'
                                                  : 'border-neutral-350 hover:border-neutral-850'
                                              }`}
                                            >
                                              {isSubCompleted && <Check className="h-2.5 w-2.5" />}
                                            </button>
                                            <span className={`leading-relaxed text-neutral-600 ${
                                              isSubCompleted ? 'text-neutral-400 line-through' : 'text-neutral-700'
                                            }`}>
                                              {sub}
                                            </span>
                                          </div>
                                        );
                                      })}
                                    </div>
                                  )}

                                </motion.div>
                              ))}
                            </AnimatePresence>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Add custom element panel */}
              <div className="lg:col-span-4" id="add_item_panel">
                <div className="bg-white border border-neutral-200/80 rounded-2xl p-6 shadow-sm sticky top-24" id="creative_man_editor">
                  <h4 className="font-bold text-neutral-900 border-b border-neutral-100 pb-3">Append Custom Action</h4>
                  
                  <form onSubmit={handleAddManualItem} className="flex flex-col gap-4 mt-4">
                    
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[11px] font-mono uppercase tracking-wider text-neutral-400 font-semibold">Phase / Category</label>
                      <input
                        type="text"
                        value={newPhase}
                        onChange={(e) => setNewPhase(e.target.value)}
                        placeholder="Phase 1: Environment Setup"
                        list="phases_autocomplete"
                        className="w-full px-3.5 py-2 text-sm border border-neutral-200 hover:border-neutral-300 focus:border-neutral-900 rounded-lg outline-none transition-all"
                        id="input_phase"
                      />
                      <datalist id="phases_autocomplete">
                        {activePhases.map(p => <option key={p} value={p} />)}
                      </datalist>
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="text-[11px] font-mono uppercase tracking-wider text-neutral-400 font-semibold">Goal Description</label>
                      <input
                        type="text"
                        value={newGoal}
                        onChange={(e) => setNewGoal(e.target.value)}
                        placeholder="e.g., Integrate custom API routers in Express server"
                        className="w-full px-3.5 py-2 text-sm border border-neutral-200 hover:border-neutral-300 focus:border-neutral-900 rounded-lg outline-none transition-all"
                        id="input_goal"
                        required
                      />
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="text-[11px] font-mono uppercase tracking-wider text-neutral-400 font-semibold">Subtasks (One per line)</label>
                      <textarea
                        value={newSubtasksString}
                        onChange={(e) => setNewSubtasksString(e.target.value)}
                        placeholder="Configure port mapping&#10;Write server router tests&#10;Expose request validation schema"
                        rows={3}
                        className="w-full px-3.5 py-2 text-sm border border-neutral-200 hover:border-neutral-300 focus:border-neutral-900 rounded-lg outline-none transition-all resize-none leading-relaxed"
                        id="input_subtasks"
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full inline-flex items-center justify-center gap-1.5 px-4 py-2.5 text-xs font-bold text-white bg-neutral-950 hover:bg-neutral-900 active:bg-neutral-800 rounded-lg transition-all shadow-sm cursor-pointer mt-2"
                    >
                      <Plus className="h-4, w-4" />
                      Add Checklist Milestone
                    </button>
                  </form>
                </div>
              </div>

            </div>
          )}

          {/* TAB 3: PERSONA CHAT / THEME BRAINSTORM */}
          {activeTab === 'chat' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start" id="chat_view">
              
              {/* Persona selector sidebar */}
              <div className="lg:col-span-4 flex flex-col gap-3" id="persona_picker">
                
                <h3 className="font-bold text-neutral-900 px-1 mb-1">Creative AI Specialists</h3>
                
                <button
                  onClick={() => setSelectedPersona('strategist')}
                  className={`p-4 text-left border rounded-xl transition-all flex items-start gap-3 w-full cursor-pointer ${
                    selectedPersona === 'strategist'
                      ? 'border-neutral-900 bg-white shadow-sm ring-1 ring-neutral-900'
                      : 'border-neutral-200 bg-white hover:bg-neutral-50'
                  }`}
                  id="picker_strategist"
                >
                  <div className="p-2 bg-neutral-100 rounded-lg shrink-0 mt-0.5">
                    <Briefcase className="h-4 w-4 text-neutral-700" />
                  </div>
                  <div>
                    <h5 className="font-bold text-sm text-neutral-900">Product Milestones</h5>
                    <p className="text-xs text-neutral-500 mt-1 leading-relaxed">
                      MVP scoping, lean feature prioritizations, work division strategies, and scoping metrics.
                    </p>
                  </div>
                </button>

                <button
                  onClick={() => setSelectedPersona('architect')}
                  className={`p-4 text-left border rounded-xl transition-all flex items-start gap-3 w-full cursor-pointer ${
                    selectedPersona === 'architect'
                      ? 'border-neutral-900 bg-white shadow-sm ring-1 ring-neutral-900'
                      : 'border-neutral-200 bg-white hover:bg-neutral-50'
                  }`}
                  id="picker_architect"
                >
                  <div className="p-2 bg-neutral-100 rounded-lg shrink-0 mt-0.5">
                    <Layers className="h-4 w-4 text-neutral-700" />
                  </div>
                  <div>
                    <h5 className="font-bold text-sm text-neutral-900">Technical Architect</h5>
                    <p className="text-xs text-neutral-500 mt-1 leading-relaxed">
                      API endpoint schemas, databases, file system maps, and infrastructure choices.
                    </p>
                  </div>
                </button>

                <button
                  onClick={() => setSelectedPersona('aesthetic')}
                  className={`p-4 text-left border rounded-xl transition-all flex items-start gap-3 w-full cursor-pointer ${
                    selectedPersona === 'aesthetic'
                      ? 'border-neutral-900 bg-white shadow-sm ring-1 ring-neutral-900'
                      : 'border-neutral-200 bg-white hover:bg-neutral-50'
                  }`}
                  id="picker_aesthetic"
                >
                  <div className="p-2 bg-neutral-100 rounded-lg shrink-0 mt-0.5">
                    <Sparkles className="h-4 w-4 text-neutral-700" />
                  </div>
                  <div>
                    <h5 className="font-bold text-sm text-neutral-900">Design &amp; Styling</h5>
                    <p className="text-xs text-neutral-500 mt-1 leading-relaxed">
                      Tailwind utility values, pristine spacing alignments, interactions, and eye-safe palettes.
                    </p>
                  </div>
                </button>

                <button
                  onClick={() => setSelectedPersona('copywriter')}
                  className={`p-4 text-left border rounded-xl transition-all flex items-start gap-3 w-full cursor-pointer ${
                    selectedPersona === 'copywriter'
                      ? 'border-neutral-900 bg-white shadow-sm ring-1 ring-neutral-900'
                      : 'border-neutral-200 bg-white hover:bg-neutral-50'
                  }`}
                  id="picker_copywriter"
                >
                  <div className="p-2 bg-neutral-100 rounded-lg shrink-0 mt-0.5">
                    <FileText className="h-4 w-4 text-neutral-700" />
                  </div>
                  <div>
                    <h5 className="font-bold text-sm text-neutral-900">Brand Storyteller</h5>
                    <p className="text-xs text-neutral-500 mt-1 leading-relaxed">
                      Editorial prose review, copy clear-ups, taglines, hooks, and content summarization.
                    </p>
                  </div>
                </button>

              </div>

              {/* Chat Timeline Terminal */}
              <div className="lg:col-span-8 flex flex-col bg-white border border-neutral-200/80 rounded-2xl shadow-sm overflow-hidden min-h-[480px]" id="chat_terminal">
                
                {/* Visual Status headers */}
                <div className="px-6 py-4 border-b border-neutral-100 flex items-center justify-between bg-neutral-50/50">
                  <div className="flex items-center gap-2">
                    <span className="capitalize font-bold text-sm text-neutral-800">
                      {selectedPersona} Consultation Session
                    </span>
                  </div>
                  <button 
                    onClick={clearChatHistory}
                    disabled={(!chatHistory[selectedPersona] || chatHistory[selectedPersona].length === 0)}
                    className="text-xs text-neutral-400 hover:text-neutral-700 active:text-neutral-900 font-mono transition-colors disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                  >
                    CLEAR SESSION
                  </button>
                </div>

                {/* Timeline Messages Area */}
                <div className="flex-1 p-6 overflow-y-auto max-h-[350px] flex flex-col gap-4" id="chat_messages_scroll">
                  {(!chatHistory[selectedPersona] || chatHistory[selectedPersona].length === 0) ? (
                    <div className="flex-1 flex flex-col items-center justify-center p-8 text-center" id="empty_conversation">
                      <Compass className="h-8 w-8 text-neutral-300 mb-2 rotate-12" />
                      <p className="text-sm font-semibold text-neutral-600">No active brainstorm points recorded.</p>
                      <p className="text-xs text-neutral-400 mt-0.5 max-w-xs leading-relaxed">
                        Query the model with your custom question below or click one of our contextual conversation starter presets to kickstart creative suggestions.
                      </p>
                    </div>
                  ) : (
                    chatHistory[selectedPersona].map((msg, i) => (
                      <div 
                        key={i} 
                        className={`flex flex-col max-w-[85%] ${
                          msg.role === 'user' ? 'ml-auto items-end' : 'mr-auto items-start'
                        }`}
                        id={`chat_bubble_${i}`}
                      >
                        <div className={`px-4 py-3 rounded-xl text-sm leading-relaxed border ${
                          msg.role === 'user'
                            ? 'bg-neutral-950 border-neutral-950 text-white shadow-sm'
                            : 'bg-white border-neutral-200 text-neutral-800'
                        }`}>
                          <p className="whitespace-pre-line font-sans">{msg.text}</p>
                        </div>
                        <span className="text-[10px] text-neutral-400 font-mono mt-1.5 px-1">{msg.timestamp}</span>
                      </div>
                    ))
                  )}

                  {isChatting && (
                    <div className="flex flex-col mr-auto max-w-[85%] items-start animate-pulse" id="chat_bubble_loading">
                      <div className="px-4 py-3 rounded-xl text-xs bg-neutral-100 border border-neutral-200 text-neutral-500 flex items-center gap-2">
                        <Loader2 className="h-3 w-3 animate-spin text-neutral-600" />
                        <span>Analysing message flow...</span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Quick Presets row */}
                <div className="px-6 py-3 border-t border-b border-neutral-100 bg-neutral-50/20 flex flex-wrap gap-2" id="preset_triggers">
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-neutral-400 self-center mr-1">PRESETS:</span>
                  {selectedPersona === 'strategist' && (
                    <button 
                      onClick={() => submitChat("Scrutinize my scope: what features should I trim from standard first-version MVPs to focus on speed?")}
                      className="px-2.5 py-1 bg-white hover:bg-neutral-100 border border-neutral-200 rounded-lg text-neutral-650 hover:text-neutral-800 text-[10.5px] font-medium leading-normal transition-all cursor-pointer"
                    >
                      "Trim product scope"
                    </button>
                  )}
                  {selectedPersona === 'architect' && (
                    <button 
                      onClick={() => submitChat("Design a modern, robust, full-stack tech architecture structure using node endpoints, TS, and schema definitions.")}
                      className="px-2.5 py-1 bg-white hover:bg-neutral-100 border border-neutral-200 rounded-lg text-neutral-650 hover:text-neutral-800 text-[10.5px] font-medium leading-normal transition-all cursor-pointer"
                    >
                      "Recommend robust architecture Stack"
                    </button>
                  )}
                  {selectedPersona === 'aesthetic' && (
                    <button 
                      onClick={() => submitChat("Help me map a beautiful high-contrast UI theme color scheme, focusing on accessible pairing details.")}
                      className="px-2.5 py-1 bg-white hover:bg-neutral-100 border border-neutral-200 rounded-lg text-neutral-650 hover:text-neutral-800 text-[10.5px] font-medium leading-normal transition-all cursor-pointer"
                    >
                      "Draft aesthetic color system"
                    </button>
                  )}
                  {selectedPersona === 'copywriter' && (
                    <button 
                      onClick={() => submitChat("Write three variations of a crisp, inspiring hook and elevator pitch for a productivity application.")}
                      className="px-2.5 py-1 bg-white hover:bg-neutral-100 border border-neutral-200 rounded-lg text-neutral-650 hover:text-neutral-800 text-[10.5px] font-medium leading-normal transition-all cursor-pointer"
                    >
                      "Formulate hook hooks and taglines"
                    </button>
                  )}
                </div>

                {/* Question Input Form terminal */}
                <div className="p-4 bg-neutral-50/40 border-t border-neutral-100 flex items-center gap-3">
                  <input
                    type="text"
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && submitChat()}
                    disabled={isChatting}
                    placeholder={`Bounce an idea off your target ${selectedPersona}...`}
                    className="flex-1 px-4 py-2.5 text-sm border border-neutral-200 hover:border-neutral-300 focus:border-neutral-900 rounded-xl outline-none bg-white transition-all min-w-0"
                    id="chat_keyboard_input"
                  />
                  
                  <button
                    onClick={() => submitChat()}
                    disabled={isChatting || !chatInput.trim()}
                    className="px-4 py-2.5 text-xs font-bold text-white bg-neutral-950 hover:bg-neutral-900 active:bg-neutral-800 rounded-xl transition-all shadow-sm flex items-center justify-center gap-1.5 shrink-0 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                  >
                    <span>Consult AI</span>
                    <ChevronRight className="h-3.5 w-3.5" />
                  </button>
                </div>

              </div>

            </div>
          )}

          {/* TAB 4: RESEARCH GROUNDING SEARCH */}
          {activeTab === 'research' && (
            <div className="flex flex-col gap-6" id="research_view">
              
              {/* Query bar box */}
              <div className="bg-white border border-neutral-200/80 rounded-2xl p-6 shadow-sm" id="search_control_card">
                <h3 className="font-bold text-neutral-900">Google Grounded Research Dock</h3>
                <p className="text-xs text-neutral-550 mt-1 leading-relaxed">
                  Query the model using actual live google search grounding. The system returns answers containing accurate, citation links back to official pages contextually, eliminating speculative developer guesswork.
                </p>

                <form onSubmit={queryWebGroundedDetails} className="mt-5 flex gap-3 flex-col sm:flex-row">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Ask anything currently online: updates, APIs, docs, frameworks..."
                    className="flex-1 px-4 py-3 text-sm border border-neutral-200 hover:border-neutral-300 focus:border-neutral-900 bg-neutral-50/[15] rounded-xl outline-none transition-all"
                    id="search_query_input"
                    required
                  />
                  <button
                    type="submit"
                    disabled={isResearching}
                    className="px-5 py-3 text-xs font-bold text-white bg-neutral-950 hover:bg-neutral-900 active:bg-neutral-800 rounded-xl shadow-sm cursor-pointer transition-all flex items-center justify-center gap-1.5 shrink-0"
                  >
                    {isResearching ? (
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    ) : (
                      <Search className="h-3.5 w-3.5" />
                    )}
                    <span>Research Grounding</span>
                  </button>
                </form>
              </div>

              {/* Research Layout view outputs */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start" id="grounding_outputs">
                
                {/* Result box text markdown content */}
                <div className="lg:col-span-8 bg-white border border-neutral-200/80 rounded-2xl p-6 shadow-sm min-h-[300px] flex flex-col justify-between" id="research_summary_card">
                  <div>
                    <h4 className="font-bold text-neutral-800 border-b border-neutral-100 pb-3 flex items-center gap-2">
                      <Sparkles className="h-4 w-4 text-emerald-500" />
                      Grounded Response Outline
                    </h4>

                    {isResearching ? (
                      <div className="flex flex-col items-center justify-center p-12 text-center h-[220px]">
                        <Loader2 className="h-8 w-8 animate-spin text-neutral-800 mb-2" />
                        <p className="text-xs font-medium text-neutral-500">Retrieving search components and synthesizing cited references...</p>
                      </div>
                    ) : researchResult ? (
                      <div className="prose prose-sm text-neutral-700 whitespace-pre-line leading-relaxed text-sm mt-4">
                        {researchResult}
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center p-12 border-2 border-dashed border-neutral-200/50 rounded-xl bg-neutral-50/40 text-center h-[200px] mt-4">
                        <Search className="h-6 w-6 text-neutral-300 mb-2" />
                        <p className="text-xs text-neutral-400 max-w-[280px]">Your grounded results will populate here upon launching a google search query.</p>
                      </div>
                    )}
                  </div>

                  {researchResult && (
                    <div className="mt-6 pt-4 border-t border-neutral-100 flex justify-end">
                      <button 
                        onClick={() => handleCopyText(researchResult)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-neutral-100 hover:bg-neutral-200 rounded-lg text-neutral-600 hover:text-neutral-850 text-xs font-semibold cursor-pointer transition-colors"
                      >
                        <Copy className="h-3 w-3" />
                        Copy full report
                      </button>
                    </div>
                  )}
                </div>

                {/* Grounding Source references citing index lists */}
                <div className="lg:col-span-4 bg-white border border-neutral-250 rounded-2xl p-6 shadow-sm sticky top-24" id="citations_list">
                  <h4 className="font-bold text-neutral-900 border-b border-neutral-100 pb-3 uppercase text-xs tracking-wider font-mono text-neutral-500">Cited Web Sources</h4>
                  
                  {isResearching ? (
                    <div className="animate-pulse flex flex-col gap-3 mt-4">
                      <div className="h-10 bg-neutral-100 rounded-lg"></div>
                      <div className="h-10 bg-neutral-100 rounded-lg"></div>
                    </div>
                  ) : researchSources.length > 0 ? (
                    <div className="flex flex-col gap-2.5 mt-4" id="sources_renderer">
                      {researchSources.map((src, idx) => (
                        <a
                          key={idx}
                          href={src.url}
                          target="_blank"
                          rel="noreferrer"
                          className="p-3 border border-neutral-200/70 hover:border-neutral-900 rounded-xl bg-neutral-50/30 hover:bg-white transition-all flex items-start justify-between gap-3 group text-left cursor-pointer"
                          id={`source_link_${idx}`}
                        >
                          <div className="flex flex-col gap-0.5 min-w-0">
                            <span className="text-xs font-bold text-neutral-800 truncate leading-normal pr-1 group-hover:text-black">
                              {src.title}
                            </span>
                            <span className="text-[10px] text-neutral-400 font-mono truncate leading-normal">
                              {src.url}
                            </span>
                          </div>
                          <ExternalLink className="h-3.5 w-3.5 text-neutral-400 group-hover:text-neutral-800 shrink-0 mt-0.5" />
                        </a>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-neutral-400 mt-4 leading-normal font-sans italic text-center p-4">
                      No web citations linked yet. Grounded links will display here as active anchor paths.
                    </p>
                  )}
                </div>

              </div>

            </div>
          )}

        </div>

      </main>

      {/* Footer copyright */}
      <footer className="border-t border-neutral-200/70 bg-white mt-auto py-5" id="main_footer">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-xs text-neutral-400 font-sans tracking-wide">
            AI Workspace is powered server-side by the Google Gemini 3.5 API.
          </p>
        </div>
      </footer>

    </div>
  );
}
