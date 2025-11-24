import { useState, useEffect, useContext } from 'react';
import axios from '../api/axios';
import AuthContext from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import Logo from '../components/Logo';
import { FaPlus, FaTrash, FaSignOutAlt, FaRobot, FaSpinner, FaMagic, FaTimes, FaEdit, FaLayerGroup, FaStickyNote, FaChevronDown, FaChevronUp } from 'react-icons/fa';

const Dashboard = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  
  const [notes, setNotes] = useState([]);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isEditingId, setIsEditingId] = useState(null);
  const [showDescription, setShowDescription] = useState(false);
  const [activeTab, setActiveTab] = useState('tasks');

  // NEW: Track which notes are expanded (Read More)
  const [expandedIds, setExpandedIds] = useState([]);

  // AI States
  const [loadingAI, setLoadingAI] = useState(null);
  const [loadingPlan, setLoadingPlan] = useState(false);
  const [dailyPlan, setDailyPlan] = useState('');

  useEffect(() => {
    if (!user) { navigate('/login'); return; }
    fetchNotes();
  }, [user, navigate]);

  const fetchNotes = async () => {
    try {
      const res = await axios.get('/notes');
      setNotes(res.data);
    } catch (err) { console.error(err); }
  };

  const handleSaveNote = async (e) => {
    e.preventDefault();
    const isTask = activeTab === 'tasks'; 

    try {
      if (isEditingId) {
        const res = await axios.put(`/notes/${isEditingId}`, { title, content, isTask });
        setNotes(notes.map(n => n._id === isEditingId ? res.data : n));
        toast.success('Updated successfully!');
        setIsEditingId(null);
      } else {
        const res = await axios.post('/notes', { title, content, isTask });
        setNotes([...notes, res.data]); 
        toast.success(isTask ? 'Task added!' : 'Note saved!');
      }
      setTitle(''); setContent('');
      if (activeTab === 'tasks') setShowDescription(false);
    } catch (err) { toast.error('Failed to save'); }
  };

  const startEdit = (note) => {
    setIsEditingId(note._id);
    setTitle(note.title);
    setContent(note.content);
    if (activeTab === 'tasks' && note.content) setShowDescription(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const cancelEdit = () => {
    setIsEditingId(null);
    setTitle('');
    setContent('');
    setShowDescription(false);
  };

  const handleDelete = async (id) => {
    if(!window.confirm("Are you sure?")) return;
    try {
      await axios.delete(`/notes/${id}`);
      setNotes(notes.filter((note) => note._id !== id));
      toast.success('Deleted');
    } catch (err) { toast.error('Failed to delete'); }
  };

  // NEW: Toggle Read More / Show Less
  const toggleExpand = (id) => {
    setExpandedIds(prev => 
      prev.includes(id) ? prev.filter(nId => nId !== id) : [...prev, id]
    );
  };

  const handleSummarize = async (noteId, noteContent) => {
    setLoadingAI(noteId);
    try {
      const res = await axios.post('/ai/summarize', { content: noteContent });
      const updatedNotes = notes.map(n => n._id === noteId ? { ...n, summary: res.data.summary } : n);
      setNotes(updatedNotes);
      toast.success('Summary Generated!');
    } catch (err) { toast.error('AI Summary failed.'); } 
    finally { setLoadingAI(null); }
  };

  const handleGeneratePlan = async () => {
    const tasks = notes.filter(n => n.isTask);
    if (tasks.length === 0) {
      toast.error("No tasks to plan!");
      return;
    }
    setLoadingPlan(true);
    setDailyPlan('');
    try {
      const res = await axios.post('/ai/plan', { notes }); 
      setDailyPlan(res.data.plan);
      toast.success('Plan Ready!', { icon: '📅' });
    } catch (err) { toast.error('Failed to generate plan'); } 
    finally { setLoadingPlan(false); }
  };

  const visibleNotes = notes.filter(n => activeTab === 'tasks' ? n.isTask : !n.isTask);

  return (
    <div className="min-h-screen bg-gray-900 text-white font-sans pb-20">
      <nav className="flex justify-between items-center p-6 bg-gray-800 shadow-md sticky top-0 z-50">
        <Logo />
        <div className="flex items-center gap-4">
          <span className="text-gray-300 hidden sm:block">Hello, {user?.name}</span>
          <button onClick={() => { logout(); navigate('/login'); }} className="text-gray-400 hover:text-white"><FaSignOutAlt size={20} /></button>
        </div>
      </nav>

      <div className="container mx-auto p-4 max-w-5xl">
        {/* TABS SWITCHER */}
        <div className="flex justify-center mb-8">
          <div className="bg-gray-800 p-1 rounded-full border border-gray-700 flex">
            <button 
              onClick={() => { setActiveTab('tasks'); cancelEdit(); }}
              className={`px-6 py-2 rounded-full flex items-center gap-2 transition ${activeTab === 'tasks' ? 'bg-purple-600 text-white shadow-lg' : 'text-gray-400 hover:text-white'}`}
            >
              <FaLayerGroup /> Tasks
            </button>
            <button 
              onClick={() => { setActiveTab('notes'); cancelEdit(); }}
              className={`px-6 py-2 rounded-full flex items-center gap-2 transition ${activeTab === 'notes' ? 'bg-pink-600 text-white shadow-lg' : 'text-gray-400 hover:text-white'}`}
            >
              <FaStickyNote /> Notes
            </button>
          </div>
        </div>

        {/* AI PLANNER */}
        {activeTab === 'tasks' && (
          <div className="mb-6">
             {!dailyPlan ? (
                <button 
                  onClick={handleGeneratePlan}
                  disabled={loadingPlan}
                  className="w-full bg-gradient-to-r from-gray-800 to-gray-800 hover:from-purple-900/20 hover:to-pink-900/20 border border-gray-700 p-4 rounded-xl flex items-center justify-center gap-3 transition group"
                >
                  {loadingPlan ? <FaSpinner className="animate-spin text-purple-400" /> : <FaMagic className="text-purple-400 group-hover:scale-110 transition" />}
                  <span className="font-bold text-gray-300 group-hover:text-white">
                    {loadingPlan ? "AI is Organizing your day..." : "Click to Generate AI Daily Plan"}
                  </span>
                </button>
             ) : (
                <div className="p-6 bg-gray-800 rounded-xl border border-purple-500/30 animate-fadeIn relative">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400 text-lg flex items-center gap-2">
                       <FaRobot /> Your Intelligent Schedule
                    </h3>
                    <button onClick={() => setDailyPlan('')} className="text-gray-500 hover:text-white"><FaTimes/></button>
                  </div>
                  <div className="prose prose-invert prose-p:text-gray-300 max-w-none whitespace-pre-wrap leading-relaxed">
                    {dailyPlan}
                  </div>
                </div>
             )}
          </div>
        )}

        {/* INPUT FORM */}
        <div className={`mb-8 bg-gray-800 p-6 rounded-xl border transition-all ${isEditingId ? 'border-yellow-500/50 shadow-yellow-900/20 shadow-lg' : 'border-gray-700 shadow-lg'}`}>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-gray-300">
              {isEditingId ? '✏️ Editing...' : (activeTab === 'tasks' ? 'Add New Task' : 'Write a Note')}
            </h2>
            {isEditingId && <button onClick={cancelEdit} className="text-xs text-gray-400 hover:text-white underline">Cancel Edit</button>}
          </div>

          <form onSubmit={handleSaveNote} className="space-y-4">
            <input
              type="text"
              placeholder={activeTab === 'tasks' ? "What needs to be done?" : "Note Title"}
              className="w-full bg-gray-900 text-white p-4 rounded-lg border border-gray-700 focus:outline-none focus:border-purple-500 font-medium"
              value={title} onChange={(e) => setTitle(e.target.value)} required
            />
            
            {activeTab === 'notes' ? (
              <textarea
                placeholder="Write your detailed thoughts here..."
                className="w-full bg-gray-900 text-white p-4 rounded-lg border border-gray-700 focus:outline-none focus:border-purple-500 h-40"
                value={content} onChange={(e) => setContent(e.target.value)}
              ></textarea>
            ) : (
              <div>
                {!showDescription && !content && (
                   <button type="button" onClick={() => setShowDescription(true)} className="text-sm text-purple-400 hover:text-purple-300 flex items-center gap-1">
                     <FaChevronDown size={12} /> Add optional description
                   </button>
                )}
                {(showDescription || content) && (
                  <div className="animate-fadeIn">
                     <textarea
                        placeholder="Task details (optional)..."
                        className="w-full bg-gray-900 text-white p-3 rounded-lg border border-gray-700 focus:outline-none focus:border-purple-500 h-20 text-sm mt-2"
                        value={content} onChange={(e) => setContent(e.target.value)}
                      ></textarea>
                  </div>
                )}
              </div>
            )}

            <button type="submit" className={`w-full py-3 rounded-lg font-bold text-white transition flex items-center justify-center gap-2 ${isEditingId ? 'bg-yellow-600 hover:bg-yellow-700' : 'bg-purple-600 hover:bg-purple-700'}`}>
              {isEditingId ? 'Update Changes' : <><FaPlus /> {activeTab === 'tasks' ? 'Add Task' : 'Save Note'}</>}
            </button>
          </form>
        </div>

        {/* CONTENT GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {visibleNotes.map((note) => {
            const isExpanded = expandedIds.includes(note._id);
            const isLongText = note.content && note.content.length > 150;

            return (
              <div key={note._id} className={`bg-gray-800 p-5 rounded-xl border border-gray-700 hover:border-gray-600 transition group flex flex-col justify-between ${note.isTask ? 'border-l-4 border-l-purple-500' : 'border-l-4 border-l-pink-500'}`}>
                
                <div className="flex justify-between items-start mb-2">
                   <h3 className={`font-bold text-lg leading-tight ${note.isTask ? 'text-gray-200' : 'text-pink-200'}`}>{note.title}</h3>
                   <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition">
                      <button onClick={() => startEdit(note)} className="text-gray-500 hover:text-yellow-400 p-1"><FaEdit /></button>
                      <button onClick={() => handleDelete(note._id)} className="text-gray-500 hover:text-red-500 p-1"><FaTrash /></button>
                   </div>
                </div>

                {/* --- READ MORE LOGIC --- */}
                {note.content && (
                  <div className="mb-4">
                    <p className={`text-gray-400 text-sm whitespace-pre-wrap transition-all ${isExpanded ? '' : 'line-clamp-4'}`}>
                      {note.content}
                    </p>
                    
                    {/* Only show 'Read More' if text is long */}
                    {isLongText && (
                      <button 
                        onClick={() => toggleExpand(note._id)}
                        className="text-xs text-purple-400 hover:text-white mt-2 font-semibold focus:outline-none"
                      >
                        {isExpanded ? 'Show Less' : 'Read More...'}
                      </button>
                    )}
                  </div>
                )}

                <div className="mt-auto pt-3 border-t border-gray-700/50 flex justify-between items-center">
                   <span className="text-xs text-gray-600 uppercase font-bold tracking-wider">{activeTab === 'tasks' ? 'Task' : 'Note'}</span>
                   
                   {!note.isTask && isLongText && (
                     <button 
                        onClick={() => handleSummarize(note._id, note.content)}
                        disabled={loadingAI === note._id}
                        className="text-xs text-pink-400 hover:text-pink-300 flex items-center gap-1"
                     >
                        {loadingAI === note._id ? <FaSpinner className="animate-spin"/> : <FaRobot />} Summarize
                     </button>
                   )}
                </div>

                {note.summary && (
                  <div className="mt-3 p-3 bg-pink-900/20 rounded-lg text-xs text-pink-200 border border-pink-500/20">
                     <strong>✨ AI Summary:</strong> {note.summary}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;