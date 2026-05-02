import { useState, useEffect, useMemo } from 'react';
import { Routes, Route } from 'react-router-dom';
import { ThemeProvider, CssBaseline, createTheme } from '@mui/material';
import { getDesignTokens } from './theme';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import RecipeDetails from './pages/RecipeDetails';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Profile from './pages/Profile';
import Settings from './pages/Settings';
import Favorites from './pages/Favorites';
import MealPlanner from './pages/MealPlanner';
import { supabase } from './services/supabase';

/**
 * App Component — The root of our application.
 */
function App() {
  const [user, setUser] = useState(null);
  
  // Initialize mode from localStorage
  const [mode, setMode] = useState(() => {
    return localStorage.getItem('themeMode') || 'light';
  });

  // Save mode to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('themeMode', mode);
  }, [mode]);

  // Create the dynamic theme based on our professional tokens
  const theme = useMemo(() => createTheme(getDesignTokens(mode)), [mode]);

  const toggleTheme = () => {
    setMode((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  // Check for active session and listen for auth changes
  useEffect(() => {
    // 1. Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    // 2. Listen for changes (login/logout)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      const currentUser = session?.user ?? null;
      setUser(currentUser);

      // Sync user to profiles table on login
      if (event === 'SIGNED_IN' && currentUser) {
        try {
          await supabase
            .from('profiles')
            .upsert({ 
              id: currentUser.id, 
              email: currentUser.email 
            });
        } catch (err) {
          console.error('Profile sync error:', err);
        }
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {/* Pass user and theme toggle to Navbar */}
      <Navbar user={user} mode={mode} onToggleTheme={toggleTheme} />
      <Routes>
        {/* Home page route */}
        <Route path="/" element={<Home user={user} />} />
        
        {/* Dynamic route for recipe details */}
        <Route path="/recipe/:id" element={<RecipeDetails user={user} />} />

        {/* Auth routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/profile" element={<Profile user={user} />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/favorites" element={<Favorites user={user} />} />
        <Route path="/meal-planner" element={<MealPlanner user={user} />} />
      </Routes>
    </ThemeProvider>
  );
}

export default App;
