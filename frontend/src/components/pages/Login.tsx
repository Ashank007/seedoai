import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios, { AxiosError } from 'axios';
import { motion } from 'framer-motion';
import { ToastContainer, toast } from 'react-toastify';
import { Eye, EyeOff } from 'lucide-react'; // Import icons from Lucide
import 'react-toastify/dist/ReactToastify.css'; // Import styles

const BACKEND_URI = import.meta.env.VITE_BACKEND_URL;

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState('admin');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  document.title = 'Seedo AI - Login';

  const handleLogin = async () => {
    if (!email || !password) {
      toast.error('Please enter both email and password.');
      return;
    }

    setLoading(true);
    try {
      const apiUrl =
        role === 'admin' ? `${BACKEND_URI}/admin/login` : `${BACKEND_URI}/faculty/login`;

      const response = await axios.post(apiUrl, { email, password });
      const { token } = response.data.message;

      if (token) {
        localStorage.setItem('token', token);
        localStorage.setItem('role', role);
        
        toast.success('Login successful! Redirecting...', { autoClose: 2000 });

        // Delay navigation by 2 seconds
        setTimeout(() => {
          navigate(role === 'admin' ? '/admin' : '/faculty-dashboard');
        }, 2000);
      } else {
        toast.error('Login failed: Invalid credentials.');
      }
    } catch (error) {
      const axiosError = error as AxiosError<{ message?: string }>;
      toast.error(axiosError.response?.data?.message || 'An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Toast Container for notifications */}
      <ToastContainer position="top-right" autoClose={3000} />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: 'easeOut' }}
        className="bg-white/10 backdrop-blur-xl rounded-3xl shadow-2xl p-8 w-full max-w-md border border-white/20 relative z-10"
      >
        <div className="text-center mb-8">
          <h1 className="text-4xl font-extrabold text-white tracking-tight">Seedo AI</h1>
          <p className="text-white/70 mt-2 text-sm font-medium">Intelligence Meets Innovation</p>
        </div>

        <div className="flex mb-6 bg-white/20 rounded-full p-1 shadow-inner">
          <motion.button
            whileHover={{ scale: 1.05 }}
            className={`flex-1 py-2 text-sm font-semibold rounded-full transition-all duration-300 ${
              role === 'admin'
                ? 'bg-white text-indigo-700 shadow-md'
                : 'text-white hover:text-white/90'
            }`}
            onClick={() => setRole('admin')}
          >
            Admin
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            className={`flex-1 py-2 text-sm font-semibold rounded-full transition-all duration-300 ${
              role === 'faculty'
                ? 'bg-white text-indigo-700 shadow-md'
                : 'text-white hover:text-white/90'
            }`}
            onClick={() => setRole('faculty')}
          >
            Faculty
          </motion.button>
        </div>

        <div className="space-y-6">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-3 bg-white/10 border border-white/30 text-white placeholder-white/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-400 transition-all duration-300"
          />

	<div className="relative w-full">
	  <input
	    type={showPassword ? 'text' : 'password'}
	    placeholder="Password"
	    value={password}
	    onChange={(e) => setPassword(e.target.value)}
	    className="w-full p-3 pr-10 bg-white/10 border border-white/30 text-white placeholder-white/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-400 transition-all duration-300"
	  />
	  
	  {/* Eye Icon */}
	  <button
	    type="button"
	    onClick={() => setShowPassword(!showPassword)}
	    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white opacity-70 hover:opacity-100 transition"
	  >
	    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
	  </button>
	</div>
		</div>

        <motion.button
          whileHover={{ scale: 1.03, boxShadow: '0 0 15px rgba(255, 255, 255, 0.3)' }}
          whileTap={{ scale: 0.97 }}
          onClick={handleLogin}
          disabled={loading}
          className="w-full mt-8 bg-white text-indigo-700 py-3 rounded-xl font-semibold hover:bg-white/95 disabled:bg-white/60 transition-all duration-300 flex items-center justify-center"
        >
          {loading ? 'Signing in...' : 'Sign In'}
        </motion.button>
      </motion.div>
    </div>
  );
};

export default Login;


