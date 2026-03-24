import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { Mail, Lock, User, CheckCircle2, ArrowLeft } from 'lucide-react';
import './Auth.css';

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [isForgot, setIsForgot] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    newPassword: '',
    rememberMe: false
  });
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  
  const { login, register, resetPassword } = useAppContext();
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');

    try {
      // IF IN FORGOT PASSWORD MODE
      if (isForgot) {
        if (!formData.email || !formData.newPassword) {
          setError('Please provide your email and new password.');
          return;
        }
        
        const res = await resetPassword(formData.email, formData.newPassword);
        if (res.success) {
          setSuccessMsg('Password beautifully reset! You can now log in.');
          setIsForgot(false);
          setIsLogin(true);
          setFormData(prev => ({ ...prev, newPassword: '', password: '' }));
        } else {
          setError(res.error);
        }
        return;
      }

      // ELSE IF LOGIN OR REGISTER
      if (!formData.email || !formData.password) {
        setError('Please fill in all required fields.');
        return;
      }
      
      if (!isLogin && !formData.name) {
        setError('Please enter your name for registration.');
        return;
      }

      let res;
      if (isLogin) {
        res = await login(formData.email, formData.password);
      } else {
        res = await register(formData.name, formData.email, formData.password);
      }

      if (res.success) {
        navigate(res.data.role === 'admin' ? '/admin' : '/book');
      } else {
        setError(res.error);
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
    }
  };

  return (
    <div className="auth-page container">
      <div className="auth-card card">
        <div className="auth-header">
          {isForgot ? (
            <>
               <h2>Reset Password</h2>
               <p>Enter your email and create a new password instantly.</p>
            </>
          ) : (
            <>
               <h2>{isLogin ? 'Welcome Back' : 'Create Account'}</h2>
               <p>{isLogin ? 'Log in to book your next game slot.' : 'Sign up to start booking turf slots instantly.'}</p>
            </>
          )}
        </div>

        {error && <div className="auth-error">{error}</div>}
        {successMsg && <div className="auth-error" style={{ backgroundColor: 'rgba(0, 255, 136, 0.1)', color: '#00ff88', borderLeftColor: '#00ff88' }}>{successMsg}</div>}

        <form onSubmit={handleSubmit} className="auth-form">
          {/* FORGOT PASSWORD FORM FIELDS */}
          {isForgot && (
             <>
                <div className="input-group">
                  <label htmlFor="email">Email Address</label>
                  <div className="input-wrapper">
                    <Mail size={18} className="input-icon" />
                    <input
                      type="email"
                      id="email"
                      name="email"
                      className="input-field with-icon"
                      placeholder="you@example.com"
                      value={formData.email}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>

                <div className="input-group">
                  <label htmlFor="newPassword">New Password</label>
                  <div className="input-wrapper">
                    <Lock size={18} className="input-icon" />
                    <input
                      type="password"
                      id="newPassword"
                      name="newPassword"
                      className="input-field with-icon"
                      placeholder="Enter new password"
                      value={formData.newPassword}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
             </>
          )}

          {/* NORMAL REGISTRATION/LOGIN FIELDS */}
          {!isForgot && (
             <>
                {!isLogin && (
                  <div className="input-group">
                    <label htmlFor="name">Full Name</label>
                    <div className="input-wrapper">
                      <User size={18} className="input-icon" />
                      <input
                        type="text"
                        id="name"
                        name="name"
                        className="input-field with-icon"
                        placeholder="John Doe"
                        value={formData.name}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>
                )}

                <div className="input-group">
                  <label htmlFor="email">Email Address</label>
                  <div className="input-wrapper">
                    <Mail size={18} className="input-icon" />
                    <input
                      type="email"
                      id="email"
                      name="email"
                      className="input-field with-icon"
                      placeholder="you@example.com"
                      value={formData.email}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>

                <div className="input-group">
                  <label htmlFor="password">Password</label>
                  <div className="input-wrapper">
                    <Lock size={18} className="input-icon" />
                    <input
                      type="password"
                      id="password"
                      name="password"
                      className="input-field with-icon"
                      placeholder="••••••••"
                      value={formData.password}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>

                <div className="form-options">
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      name="rememberMe"
                      checked={formData.rememberMe}
                      onChange={handleInputChange}
                      className="checkbox-input"
                    />
                    <span className="checkbox-custom">
                      {formData.rememberMe && <CheckCircle2 size={14} />}
                    </span>
                    Remember me
                  </label>
                  
                  {isLogin && (
                     <button type="button" className="forgot-password" onClick={() => { setIsForgot(true); setError(''); setSuccessMsg(''); }}>
                        Forgot Password?
                     </button>
                  )}
                </div>
             </>
          )}


          <button type="submit" className="btn-primary auth-submit">
            {isForgot ? 'Reset Password' : (isLogin ? 'Log In' : 'Sign Up')}
          </button>
        </form>

        <div className="auth-footer">
          {isForgot ? (
             <button type="button" className="toggle-auth" onClick={() => { setIsForgot(false); setError(''); }} style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
               <ArrowLeft size={16} /> Back to Login
             </button>
          ) : (
             <p>
               {isLogin ? "Don't have an account?" : "Already have an account?"}
               <button 
                 className="toggle-auth" 
                 onClick={() => { setIsLogin(!isLogin); setError(''); setSuccessMsg(''); }}
               >
                 {isLogin ? 'Sign up here' : 'Log in here'}
               </button>
             </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Auth;
