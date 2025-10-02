import * as React from 'react';
import { styled } from '@mui/material/styles';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { Box, Card, CardActions, Collapse, Avatar, IconButton, Typography, Button, Link, CardMedia, Grid } from '@mui/material'; 
import { Document, Page } from 'react-pdf';
import ArticleIcon from '@mui/icons-material/Article';

const backendUrl = 'http://localhost:3000';

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

export default function ShowPostsCard({ post }) { 
  const [expanded, setExpanded] = React.useState(false);

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  const renderFile = (file) => {
    const fileUrl = file.file_url.startsWith('http') ? file.file_url : `${backendUrl}${file.file_url}`;
    const mimeType = file.file_mime_type;

    if (mimeType?.startsWith('image/')) {
        return <CardMedia component="img" image={fileUrl} sx={{ width: '100%', height: '100%', objectFit: 'cover' }} />;
    }
    if (mimeType?.startsWith('video/')) {
        return <CardMedia component="video" controls src={fileUrl} sx={{ width: '100%', height: '100%' }} />;
    }
    return (
        <Button component={Link} href={fileUrl} target="_blank" startIcon={<ArticleIcon />}>
            View File
        </Button>
    );
  };

  return (
    <Card sx={{ display: 'flex', p: 2, mb: 2, width: '100%', maxWidth: 600, boxShadow: 'none', borderBottom: '1px solid #eee' }}>
      <Box sx={{ mr: 2, flexShrink: 0 }}>
        <Avatar
          src={post.profile_picture_url} 
          sx={{ bgcolor: 'primary.main' }}
          aria-label="profile-avatar"
        >
          {!post.profile_picture_url && (post.author_name ? post.author_name.charAt(0).toUpperCase() : 'U')}
        </Avatar>
      </Box>
      
      <Box sx={{ width: '100%' }}>
      
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
              <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                {post.author_name}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                @{post.handle} &middot; {new Date(post.created_at).toLocaleDateString()}
              </Typography>
            </Box>
          </Box>
          <IconButton size="small" sx={{ mt: -1, ml: 1 }}>
            <MoreVertIcon />
          </IconButton>
        </Box>

        <Typography variant="h6" sx={{ mt: 1, fontWeight: 'normal', fontSize: '1.1rem' }}>
          {post.title}
        </Typography>

        <Collapse in={expanded} timeout="auto" unmountOnExit>
          <Typography paragraph sx={{ mt: 1 }}>
            {post.description}
          </Typography>
        </Collapse>

        {post.files && post.files.length > 0 && (
            <Grid container spacing={0.5} sx={{ mt: 1, borderRadius: '16px', overflow: 'hidden', border: '1px solid #ddd' }}>
                {post.files.map((file, index) => (
                    <Grid item xs={post.files.length > 1 ? 6 : 12} key={index} sx={{ height: post.files.length > 2 ? '150px' : '300px' }}>
                        {renderFile(file)}
                    </Grid>
                ))}
            </Grid>
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