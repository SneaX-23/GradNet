import * as React from 'react';
import { styled } from '@mui/material/styles';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { Box, Card, CardActions, Collapse, Avatar, IconButton, Typography, Button, Link, CardMedia, Modal } from '@mui/material'; 
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

const modalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  bgcolor: 'transparent',
  boxShadow: 24,
  p: 0,
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
};

const MediaGrid = ({ files, onImageClick }) => {
    const fileCount = files.length;

    const renderFile = (file, sxProps = {}) => {
        const fileUrl = file.file_url.startsWith('http') ? file.file_url : `${backendUrl}${file.file_url}`;
        const mimeType = file.file_mime_type;

        if (mimeType?.startsWith('image/')) {
            return (
                <Box
                    onClick={() => onImageClick(fileUrl)}
                    sx={{
                        cursor: 'pointer',
                        width: '100%',
                        height: '100%',
                        backgroundImage: `url(${fileUrl})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        transition: 'filter 0.2s ease-in-out',
                        '&:hover': {
                          filter: 'brightness(0.85)',
                        },
                        ...sxProps,
                    }}
                />
            );
        }
        if (mimeType?.startsWith('video/')) {
            return <CardMedia component="video" controls src={fileUrl} sx={{ width: '100%', height: '100%', objectFit: 'cover' }} />;
        }
        return (
             <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', backgroundColor: '#f0f0f0' }}>
                <Button component={Link} href={fileUrl} target="_blank" startIcon={<ArticleIcon />}>
                    View File
                </Button>
            </Box>
        );
    };

    const gridContainerSx = {
        mt: 1.5,
        height: '350px',
        borderRadius: '16px',
        overflow: 'hidden',
        border: '1px solid #ddd',
        display: 'grid',
        gap: '2px',
        backgroundColor: '#ddd'
    };

    if (fileCount === 1) {
        return <Box sx={gridContainerSx}>{renderFile(files[0])}</Box>;
    }
    if (fileCount === 2) {
        return (
            <Box sx={{ ...gridContainerSx, gridTemplateColumns: '1fr 1fr' }}>
                {renderFile(files[0])}
                {renderFile(files[1])}
            </Box>
        );
    }
    if (fileCount === 3) {
        return (
            <Box sx={{ ...gridContainerSx, gridTemplateColumns: '1fr 1fr', gridTemplateRows: '1fr 1fr' }}>
                {renderFile(files[0], { gridRow: 'span 2' })}
                {renderFile(files[1])}
                {renderFile(files[2])}
            </Box>
        );
    }
    if (fileCount === 4) {
        return (
            <Box sx={{ ...gridContainerSx, gridTemplateColumns: '1fr 1fr', gridTemplateRows: '1fr 1fr' }}>
                {files.map((file, index) => <React.Fragment key={index}>{renderFile(file)}</React.Fragment>)}
            </Box>
        );
    }

    return (
        <Box sx={{...gridContainerSx, gridTemplateColumns: '1fr 1fr'}}>
            {files.map((file, index) => <React.Fragment key={index}>{renderFile(file)}</React.Fragment>)}
        </Box>
    );
};


export default function ShowPostsCard({ post }) { 
  const [expanded, setExpanded] = React.useState(false);
  const [modalOpen, setModalOpen] = React.useState(false);
  const [selectedImage, setSelectedImage] = React.useState('');

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  const handleOpenImage = (imageUrl) => {
    setSelectedImage(imageUrl);
    setModalOpen(true);
  };

  const handleCloseImage = () => {
    setModalOpen(false);
    setSelectedImage('');
  };


  return (
    <>
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
           <MediaGrid files={post.files} onImageClick={handleOpenImage} />
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

    <Modal
        open={modalOpen}
        onClose={handleCloseImage}
        aria-labelledby="image-modal-title"
        aria-describedby="image-modal-description"
      >
        <Box sx={modalStyle} onClick={handleCloseImage}>
          <img src={selectedImage} alt="Enlarged post content" style={{ maxHeight: '90vh', maxWidth: '90vw', objectFit: 'contain' }} />
        </Box>
    </Modal>
    </>
  );
}