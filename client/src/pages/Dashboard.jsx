import { useState, useEffect, useContext } from 'react';
import axios from '../api/axios';
import AuthContext from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { FaPlus, FaTrash, FaSignOutAlt, FaRobot, FaSpinner, FaMagic, FaTimes } from 'react-icons/fa';
import Logo from '../components/Logo';

const Dashboard = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  
  const [notes, setNotes] = useState([]);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  
  // Loading states
  const [loadingAI, setLoadingAI] = useState(null); // For single note summary
  const [loadingPlan, setLoadingPlan] = useState(false); // For daily plan

  const [dailyPlan, setDailyPlan] = useState(''); // Store the generated plan

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

  const handleCreateNote = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('/notes', { title, content });
      setNotes([...notes, res.data]); 
      setTitle(''); setContent('');
      toast.success('Note added!');
    } catch (err) { toast.error('Failed to create note'); }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`/notes/${id}`);
      setNotes(notes.filter((note) => note._id !== id));
      toast.success('Note deleted');
    } catch (err) { toast.error('Failed to delete'); }
  };

  // 1. Single Note Summary (BART Model)
  const handleSummarize = async (noteId, noteContent) => {
    setLoadingAI(noteId);
    try {
      const res = await axios.post('/ai/summarize', { content: noteContent });
      const updatedNotes = notes.map(n => n._id === noteId ? { ...n, summary: res.data.summary } : n);
      setNotes(updatedNotes);
      toast.success('Summary Generated!');
    } catch (err) {
      toast.error('AI Summary failed.');
    } finally { setLoadingAI(null); }
  };

  // 2. Daily Plan Generator (Flan-T5 Model)
  const handleGeneratePlan = async () => {
    if (notes.length === 0) {
      toast.error("Add some notes first!");
      return;
    }
    setLoadingPlan(true);
    setDailyPlan(''); // Clear old plan
    try {
      // Send ALL notes to the backend
      const res = await axios.post('/ai/plan', { notes });
      setDailyPlan(res.data.plan);
      toast.success('Daily Plan Created!', { icon: '📅' });
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || 'Failed to generate plan');
    } finally {
      setLoadingPlan(false);
    }
  };

  const handleLogout = () => { logout(); navigate('/login'); };

  return (
    <div className="min-h-screen bg-gray-900 text-white font-sans">
      {/* Navbar */}
      <nav className="flex justify-between items-center p-6 bg-gray-800 shadow-md">
        <Logo />
        <div className="flex items-center gap-4">
          <span className="text-gray-300 hidden sm:block">Welcome, {user?.name}</span>
          <button onClick={handleLogout} className="text-gray-400 hover:text-white transition"><FaSignOutAlt size={20} /></button>
        </div>
      </nav>

      <div className="container mx-auto p-6 max-w-6xl">
        
        {/* --- FEATURE: AI PLANNER --- */}
        <div className="mb-8 p-6 bg-gradient-to-r from-gray-800 to-gray-800 border border-purple-500/30 rounded-xl relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-500 via-pink-500 to-purple-500"></div>
          
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-purple-300 flex items-center gap-2">
              <FaMagic /> AI Daily Planner
            </h2>
            <button 
              onClick={handleGeneratePlan}
              disabled={loadingPlan}
              className="bg-white text-purple-700 px-4 py-2 rounded-lg font-bold hover:bg-purple-50 transition flex items-center gap-2 disabled:opacity-50 shadow-lg"
            >
              {loadingPlan ? <FaSpinner className="animate-spin" /> : <FaRobot />}
              {loadingPlan ? "Generating Plan..." : "Plan My Day"}
            </button>
          </div>

          <p className="text-gray-400 text-sm mb-4">
            Ask AI to analyze all your notes below and create a prioritized schedule for you.
          </p>

          {/* The Plan Result Box */}
          {dailyPlan && (
            <div className="mt-4 p-4 bg-gray-900/50 rounded-lg border border-green-500/30 text-green-100 animate-fadeIn">
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-bold text-green-400">Your AI Schedule:</h3>
                <button onClick={() => setDailyPlan('')} className="text-gray-500 hover:text-white"><FaTimes /></button>
              </div>
              <p className="whitespace-pre-wrap leading-relaxed">{dailyPlan}</p>
            </div>
          )}
        </div>

        {/* Input Section */}
        <div className="bg-gray-800 p-6 rounded-lg shadow-lg mb-8 border border-gray-700">
          <form onSubmit={handleCreateNote} className="space-y-4">
            <input
              type="text"
              placeholder="Task Title (e.g., 'Finish React Project')"
              className="w-full bg-gray-700 text-white p-3 rounded border border-gray-600 focus:outline-none focus:border-purple-500"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
            <textarea
              placeholder="Details (e.g., 'Fix the API bugs, add new styling, deploy to Vercel')"
              className="w-full bg-gray-700 text-white p-3 rounded border border-gray-600 focus:outline-none focus:border-purple-500 h-20"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
            ></textarea>
            <button type="submit" className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded transition">
              <FaPlus /> Add Task
            </button>
          </form>
        </div>

        {/* Notes Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {notes.map((note) => (
            <div key={note._id} className="bg-gray-800 p-5 rounded-lg border border-gray-700 hover:shadow-lg transition relative group flex flex-col justify-between min-h-[200px]">
              <div>
                <h3 className="text-xl font-bold text-purple-400 mb-2">{note.title}</h3>
                <p className="text-gray-300 whitespace-pre-wrap text-sm">{note.content}</p>
              </div>
              
              <button onClick={() => handleDelete(note._id)} className="absolute top-4 right-4 text-gray-500 hover:text-red-500 opacity-0 group-hover:opacity-100 transition">
                <FaTrash />
              </button>

              {/* Single Note Summary */}
              {note.summary ? (
                <div className="mt-4 p-3 bg-purple-900/30 rounded border border-purple-500/30 text-sm text-purple-200">
                   <strong>✨ Summary:</strong> {note.summary}
                </div>
              ) : (
                <div className="mt-4 pt-4 border-t border-gray-700 flex justify-end">
                   <button 
                     onClick={() => handleSummarize(note._id, note.content)}
                     disabled={loadingAI === note._id}
                     className="text-xs flex items-center gap-1 text-gray-400 hover:text-blue-400 transition disabled:opacity-50"
                   >
                      {loadingAI === note._id ? <FaSpinner className="animate-spin"/> : <FaRobot />} 
                      {loadingAI === note._id ? "Thinking..." : "Summarize"}
                   </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;