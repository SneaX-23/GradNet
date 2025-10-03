import React from 'react';
import {
  Box,
  Card,
  CardActions,
  Collapse,
  Typography,
  Button,
  Avatar,
  IconButton
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

const backendUrl = 'http://localhost:3000';

const getFullUrl = (path) => {
  if (!path) return null;
  return path.startsWith('http') ? path : `${backendUrl}${path}`;
};

export default function JobCard({ job }) {
  const [expanded, setExpanded] = React.useState(false);

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  const authorInitial = job.author_name ? job.author_name.charAt(0).toUpperCase() : '?';
 
  const avatarUrl = getFullUrl(job.profile_picture_url);

  return (
    <Card
      sx={{
        display: 'flex',
        p: 2,
        mb: 2,
        width: '100%',
        maxWidth: 700,
        boxShadow: 'none',
        border: '1px solid #eee',
        borderRadius: '8px'
      }}
    >
      <Box sx={{ width: '100%' }}>
        <Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                {job.title}
              </Typography>
              <Typography variant="body1" color="text.primary" sx={{ mt: 0.5 }}>
                {job.company}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                {job.location} ({job.work_location})
              </Typography>
            </Box>

            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', ml: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
                <Avatar
                  src={avatarUrl || ''} //
                  alt={job.author_name || 'Author'}
                  sx={{ width: 32, height: 32, mr: 1 }}
                >
                  {!avatarUrl && authorInitial}
                </Avatar>
                <Box sx={{ textAlign: 'right' }}>
                  <Typography variant="body2" sx={{ fontWeight: 500 }}>
                    {job.author_name || 'Unknown'}
                  </Typography>
                  {job.handle && (
                    <Typography variant="caption" color="text.secondary">
                      @{job.handle}
                    </Typography>
                  )}
                </Box>
              </Box>
              <Typography variant="caption" color="text.secondary">
                {new Date(job.updated_at).toLocaleDateString()}
              </Typography>
            </Box>
          </Box>

          <Collapse in={expanded} timeout="auto" unmountOnExit sx={{ mt: 2 }}>
            <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
              Job Type:
            </Typography>
            <Typography paragraph sx={{ mb: 1.5 }}>
              {job.job_type}
            </Typography>

            <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
              Salary Range:
            </Typography>
            <Typography paragraph sx={{ mb: 1.5 }}>
              {job.salary_range || 'Not specified'}
            </Typography>

            <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
              Description:
            </Typography>
            <Typography paragraph sx={{ mb: 1.5 }}>
              {job.description}
            </Typography>

            <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
              Requirements:
            </Typography>
            <Typography paragraph sx={{ mb: 1.5 }}>
              {job.requirements || 'Not specified'}
            </Typography>

            {job.application_deadline && (
              <>
                <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                  Deadline:
                </Typography>
                <Typography paragraph sx={{ mb: 1.5 }}>
                  {new Date(job.application_deadline).toLocaleDateString()}
                </Typography>
              </>
            )}

            {job.external_link && (
              <Button
                variant="contained"
                href={job.external_link}
                target="_blank"
                sx={{ mt: 1 }}
              >
                Apply Now
              </Button>
            )}
          </Collapse>

          <CardActions disableSpacing sx={{ pl: 0, pt: 2, justifyContent: 'flex-start' }}>
            <Button
              size="small"
              onClick={handleExpandClick}
              endIcon={
                <ExpandMoreIcon
                  sx={{
                    transform: !expanded ? 'rotate(0deg)' : 'rotate(180deg)',
                    transition: '0.3s'
                  }}
                />
              }
            >
              {expanded ? 'Show less' : 'Show more'}
            </Button>
          </CardActions>
        </Box>
      </Box>
    </Card>
  );
}