import * as React from 'react';
import { styled } from '@mui/material/styles';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { Box, Card, CardMedia, CardActions, Collapse, Avatar, IconButton, Typography, Button } from '@mui/material';
const ExpandMore = styled((props) => {
  const { expand, ...other } = props;
  return <IconButton {...other} />;
})(({ theme, expand }) => ({
  transform: !expand ? 'rotate(0deg)' : 'rotate(180deg)',
  marginLeft: 'auto',
  transition: theme.transitions.create('transform', {
    duration: theme.transitions.duration.shortest,
  }),
}));

export default function ShowPostsCard(props) {
  const [expanded, setExpanded] = React.useState(false);

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  return (
    <Card sx={{ display: 'flex', p: 2, mb: 2, width: '100%', maxWidth: 600, boxShadow: 'none', borderBottom: '1px solid #eee' }}>

      <Box sx={{ mr: 2, flexShrink: 0 }}>
        <Avatar
          src={props.author_profile_picture} 
          sx={{ bgcolor: 'primary.main' }} aria-label="profile-avatar">
          {props.author_name ? props.author_name.charAt(0).toUpperCase() : 'U'}
        </Avatar>
      </Box>
      
      <Box sx={{ width: '100%' }}>
      
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
              <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                {props.author_name} {/* Author Name */}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                @{props.handle} &middot; {new Date(props.created_at).toLocaleDateString()}
              </Typography>
            </Box>
          </Box>
          <IconButton size="small" sx={{ mt: -1, ml: 1 }}>
            <MoreVertIcon />
          </IconButton>
        </Box>

        <Typography variant="h6" sx={{ mt: 1, fontWeight: 'normal', fontSize: '1.1rem' }}>
          {props.post_title}
        </Typography>

        <Collapse in={expanded} timeout="auto" unmountOnExit>
          <Typography paragraph sx={{ mt: 1 }}>
            {props.description}
          </Typography>
        </Collapse>

        {props.image && (
          <CardMedia
            component="img"
            image={props.image}
            alt={props.post_title}
            sx={{ mt: 1, borderRadius: '16px', border: '1px solid #ddd' }}
          />
        )}

        <CardActions disableSpacing sx={{ pl: 0, justifyContent: 'flex-end' }}>
          <Button
            size="small"
            onClick={handleExpandClick}
            endIcon={<ExpandMoreIcon sx={{ transform: !expanded ? 'rotate(0deg)' : 'rotate(180deg)', transition: '0.3s' }} />}
          >
            {expanded ? 'Show less' : 'Show more'}
          </Button>
        </CardActions>
      </Box>
    </Card>
  );
}