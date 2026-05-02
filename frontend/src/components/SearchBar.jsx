import { useState } from 'react';
import {
  Box,
  TextField,
  Button,
  InputAdornment,
  Paper,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import RestaurantMenuIcon from '@mui/icons-material/RestaurantMenu';

/**
 * SearchBar Component
 * 
 * A styled search input with a button.
 * When the user types a recipe name and clicks "Search"
 * (or presses Enter), it calls the onSearch function
 * passed down from the parent component.
 * 
 * Props:
 *   - onSearch(query): function to call with the search text
 *   - loading: boolean to disable the button while fetching
 */
function SearchBar({ onSearch, loading }) {
  // Local state to track what the user is typing
  const [query, setQuery] = useState('');

  // Called when user submits the search
  const handleSubmit = (e) => {
    e.preventDefault();                    // Prevent page reload
    if (query.trim()) {                    // Only search if not empty
      onSearch(query.trim());
    }
  };

  return (
    <Paper
      component="form"
      onSubmit={handleSubmit}
      elevation={0}
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 1.5,
        p: 1,
        borderRadius: 4,
        backgroundColor: 'background.paper',
        border: '1px solid',
        borderColor: 'divider',
        transition: 'all 0.3s ease',
        '&:focus-within': {
          borderColor: 'primary.main',
          boxShadow: (theme) => theme.palette.mode === 'light' 
            ? '0 0 0 4px rgba(255, 107, 53, 0.1)'
            : '0 0 0 4px rgba(255, 107, 53, 0.2)',
        },
        maxWidth: 650,
        mx: 'auto',
        width: '100%',
      }}
    >
      <TextField
        fullWidth
        variant="standard"
        placeholder="Search for recipes... (e.g., pasta, chicken curry)"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        InputProps={{
          disableUnderline: true,
          startAdornment: (
            <InputAdornment position="start">
              <RestaurantMenuIcon sx={{ color: 'text.secondary', ml: 1 }} />
            </InputAdornment>
          ),
          sx: {
            fontSize: '1.05rem',
            pl: 0.5,
            color: 'text.primary',
          },
        }}
        sx={{ flex: 1 }}
      />
      <Button
        type="submit"
        variant="contained"
        disabled={loading || !query.trim()}
        startIcon={<SearchIcon />}
        sx={{
          borderRadius: 3,
          px: 3,
          py: 1.2,
          minWidth: 120,
          fontSize: '0.95rem',
          boxShadow: '0 4px 14px rgba(255, 107, 53, 0.35)',
          '&:hover': {
            boxShadow: '0 6px 20px rgba(255, 107, 53, 0.45)',
          },
        }}
      >
        {loading ? 'Searching...' : 'Search'}
      </Button>
    </Paper>
  );
}

export default SearchBar;
