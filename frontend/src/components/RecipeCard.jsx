import {
  Card,
  CardMedia,
  CardContent,
  Typography,
  Box,
  Chip,
  Tooltip,
  IconButton
} from '@mui/material';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import PeopleIcon from '@mui/icons-material/People';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import AddIcon from '@mui/icons-material/Add';

/**
 * RecipeCard Component (Upgraded UI with Favorites & Planner)
 */
function RecipeCard({ recipe, onClick, onFavorite, isFavorite, onAddToPlan }) {
  return (
    <Card
      onClick={() => onClick(recipe.id)}
      sx={{
        cursor: 'pointer',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        borderRadius: 4,
        overflow: 'hidden',
        border: '1px solid',
        borderColor: 'divider',
        backgroundColor: 'background.paper',
        boxShadow: (theme) => theme.palette.mode === 'light' 
          ? '0 4px 12px rgba(0,0,0,0.05)' 
          : '0 4px 20px rgba(0,0,0,0.4)',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        '&:hover': {
          transform: 'translateY(-8px)',
          boxShadow: (theme) => theme.palette.mode === 'light' 
            ? '0 12px 30px rgba(0,0,0,0.12)' 
            : '0 12px 40px rgba(0,0,0,0.6)',
          '& .recipe-image': {
            transform: 'scale(1.1)',
          },
        },
      }}
    >
      <Box sx={{ position: 'relative', overflow: 'hidden' }}>
        {/* Favorite Button */}
        <IconButton
          onClick={(e) => {
            e.stopPropagation();
            onFavorite(recipe);
          }}
          sx={{
            position: 'absolute',
            top: 10,
            right: 10,
            zIndex: 10,
            backgroundColor: (theme) => theme.palette.mode === 'light' 
              ? 'rgba(255, 255, 255, 0.8)' 
              : 'rgba(0, 0, 0, 0.4)',
            backdropFilter: 'blur(4px)',
            color: 'white',
            '&:hover': {
              backgroundColor: (theme) => theme.palette.mode === 'light' 
                ? 'white' 
                : 'rgba(0, 0, 0, 0.6)',
              transform: 'scale(1.1)',
            },
            transition: 'all 0.2s ease',
          }}
        >
          {isFavorite ? (
            <FavoriteIcon sx={{ color: '#FF6B35' }} />
          ) : (
            <FavoriteBorderIcon sx={{ color: 'white' }} />
          )}
        </IconButton>

        {/* Add to Meal Plan Button */}
        <IconButton
          onClick={(e) => {
            e.stopPropagation();
            onAddToPlan(recipe);
          }}
          sx={{
            position: 'absolute',
            top: 10,
            left: 10,
            zIndex: 10,
            backgroundColor: (theme) => theme.palette.mode === 'light' 
              ? 'rgba(255, 255, 255, 0.8)' 
              : 'rgba(0, 0, 0, 0.4)',
            backdropFilter: 'blur(4px)',
            color: (theme) => theme.palette.mode === 'light' ? 'text.primary' : 'white',
            '&:hover': {
              backgroundColor: (theme) => theme.palette.mode === 'light' 
                ? 'white' 
                : 'rgba(0, 0, 0, 0.6)',
              transform: 'scale(1.1)',
            },
            transition: 'all 0.2s ease',
          }}
        >
          <Tooltip title="Add to Meal Plan">
            <AddIcon />
          </Tooltip>
        </IconButton>

        <CardMedia
          component="img"
          className="recipe-image"
          height="200"
          image={recipe.image || 'https://via.placeholder.com/300x200?text=No+Image'}
          alt={recipe.title}
          sx={{
            transition: 'transform 0.5s ease',
          }}
        />
      </Box>

      <CardContent sx={{ flexGrow: 1, p: 2.5 }}>
        <Tooltip title={recipe.title} arrow>
          <Typography
            variant="h6"
            sx={{
              fontSize: '1.1rem',
              fontWeight: 700,
              lineHeight: 1.3,
              mb: 1.5,
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
              minHeight: '2.8rem',
              color: 'text.primary'
            }}
          >
            {recipe.title}
          </Typography>
        </Tooltip>

        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
          {recipe.readyInMinutes && (
            <Chip
              icon={<AccessTimeIcon sx={{ fontSize: '14px !important' }} />}
              label={`${recipe.readyInMinutes} min`}
              size="small"
              variant="outlined"
              sx={{ borderRadius: 1.5, borderColor: 'divider' }}
            />
          )}
          {recipe.servings && (
            <Chip
              icon={<PeopleIcon sx={{ fontSize: '14px !important' }} />}
              label={`${recipe.servings} portions`}
              size="small"
              variant="outlined"
              sx={{ borderRadius: 1.5, borderColor: 'divider' }}
            />
          )}
        </Box>
      </CardContent>
    </Card>
  );
}

export default RecipeCard;
