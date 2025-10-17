import React, { useState, forwardRef } from 'react';
import {
  Box, TextField, Button, Card, Typography, Select, MenuItem,
  InputLabel, FormControl, Fab, Dialog, DialogTitle, DialogContent,
  DialogActions, Slide, useMediaQuery
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { createJob } from '../../services/JobService';
import { useTheme } from '@mui/material/styles';

const Transition = forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const retroFont = "'Courier New', Courier, monospace";

const retroTextFieldStyles = {
  '& label': {
    color: '#ffffff',
    fontFamily: retroFont,
    position: 'relative',
    transform: 'none',
    marginBottom: '4px',
  },
  '& label.Mui-focused': {
    color: '#ffffff',
  },
  '& .MuiInputLabel-shrink': {
    transform: 'none',
    position: 'relative',
  },
  '& .MuiInputBase-root': {
    color: '#ffffff',
    fontFamily: retroFont,
    border: '2px solid #ffffff',
    borderRadius: 0,
    backgroundColor: '#000000',
    marginTop: 0,
  },
  '& .MuiOutlinedInput-root': {
    '& fieldset': {
      border: 'none', 
    },
    '&:hover fieldset': {
      border: 'none',
    },
    '&.Mui-focused fieldset': {
      border: 'none',
    },
  },
  '& .MuiInputBase-input': {
    color: '#ffffff',
  },
  '& .MuiSvgIcon-root': {
    color: '#ffffff',
  }
};


const retroFormControlStyles = {
  ...retroTextFieldStyles,
  '& .MuiInputLabel-root': { 
    color: '#ffffff',
    fontFamily: retroFont,
  }
};


function CreateJob({ onJobPosted }) {
  const [formData, setFormData] = useState({
    title: '',
    company: '',
    location: '',
    job_type: 'Full-time',
    work_location: 'On-site',
    salary_range: '',
    description: '',
    requirements: '',
    application_deadline: '',
    external_link: ''
  });
  const [error, setError] = useState('');
  const [open, setOpen] = useState(false);

  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up('sm'));

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await createJob(formData);
      setFormData({
        title: '',
        company: '',
        location: '',
        job_type: 'Full-time',
        work_location: 'On-site',
        salary_range: '',
        description: '',
        requirements: '',
        application_deadline: '',
        external_link: ''
      });
      setOpen(false);
      if (onJobPosted) onJobPosted();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <>
      <Fab
        color="primary"
        aria-label="add"
        onClick={() => setOpen(true)}
        variant={isDesktop ? 'extended' : 'circular'}
        sx={{
          position: 'fixed',
          bottom: 24,
          right: 24,
          zIndex: 1000,
          borderRadius: 0,
          bgcolor: '#ffffff',
          color: '#000000',
          border: '2px solid #ffffff',
          fontFamily: retroFont,
          fontWeight: 'bold',
          '&:hover': {
            bgcolor: '#000000',
            color: '#ffffff',
          }
        }}
      >
        <AddIcon sx={{ mr: isDesktop ? 1 : 0 }} />
        {isDesktop && 'Post Job'}
      </Fab>

      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        maxWidth="md"
        fullWidth
        TransitionComponent={Transition}
        keepMounted
        PaperProps={{
          sx: {
            bgcolor: '#000000',
            color: '#ffffff',
            border: '2px solid #ffffff',
            borderRadius: 0,
            fontFamily: retroFont,
          }
        }}
      >
        <DialogTitle sx={{ fontFamily: retroFont, fontWeight: 'bold' }}>Create a Job Post</DialogTitle>
        <DialogContent dividers sx={{ borderColor: '#ffffff' }}>
          <Card elevation={0} sx={{ boxShadow: 'none', p: 1, width: '100%', maxWidth: 700, mx: 'auto', bgcolor: '#000000' }}>
            <form onSubmit={handleSubmit}>
              <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
                <TextField name="title" label="Job Title" value={formData.title} onChange={handleChange} required sx={retroTextFieldStyles} InputLabelProps={{ shrink: true }} />
                <TextField name="company" label="Company" value={formData.company} onChange={handleChange} required sx={retroTextFieldStyles} InputLabelProps={{ shrink: true }} />
                <TextField name="location" label="Location" value={formData.location} onChange={handleChange} required sx={retroTextFieldStyles} InputLabelProps={{ shrink: true }} />

                <FormControl sx={retroFormControlStyles} fullWidth>
                  <InputLabel shrink>Job Type</InputLabel>
                  <Select name="job_type" value={formData.job_type} label="Job Type" onChange={handleChange}>
                    <MenuItem value="Full-time">Full-time</MenuItem>
                    <MenuItem value="Part-time">Part-time</MenuItem>
                    <MenuItem value="Contract">Contract</MenuItem>
                    <MenuItem value="Internship">Internship</MenuItem>
                  </Select>
                </FormControl>

                <FormControl sx={retroFormControlStyles} fullWidth>
                  <InputLabel shrink>Work Location</InputLabel>
                  <Select name="work_location" value={formData.work_location} label="Work Location" onChange={handleChange}>
                    <MenuItem value="On-site">On-site</MenuItem>
                    <MenuItem value="Remote">Remote</MenuItem>
                    <MenuItem value="Hybrid">Hybrid</MenuItem>
                  </Select>
                </FormControl>

                <TextField
                  name="salary_range"
                  label="Salary Range"
                  value={formData.salary_range}
                  onChange={handleChange}
                  sx={retroTextFieldStyles}
                  InputLabelProps={{ shrink: true }}
                />

                <TextField
                  name="description"
                  label="Job Description"
                  value={formData.description}
                  onChange={handleChange}
                  required
                  multiline
                  rows={4}
                  sx={{ ...retroTextFieldStyles, gridColumn: 'span 2' }}
                  InputLabelProps={{ shrink: true }}
                />
                <TextField
                  name="requirements"
                  label="Requirements"
                  value={formData.requirements}
                  onChange={handleChange}
                  multiline
                  rows={3}
                  sx={{ ...retroTextFieldStyles, gridColumn: 'span 2' }}
                  InputLabelProps={{ shrink: true }}
                />

                <TextField
                  name="application_deadline"
                  label="Application Deadline"
                  type="date"
                  value={formData.application_deadline}
                  onChange={handleChange}
                  InputLabelProps={{ shrink: true }}
                  sx={retroTextFieldStyles}
                />
                <TextField
                  name="external_link"
                  label="External Application Link"
                  value={formData.external_link}
                  onChange={handleChange}
                  sx={retroTextFieldStyles}
                  InputLabelProps={{ shrink: true }}
                />
              </Box>
              {error && (
                <Typography color="error" sx={{ mt: 2, fontFamily: retroFont }}>
                  {error}
                </Typography>
              )}
            </form>
          </Card>
        </DialogContent>
        <DialogActions sx={{ pr: 3, pb: 2 }}>
          <Button 
            onClick={() => setOpen(false)} 
            sx={{ fontFamily: retroFont, color: '#ffffff', borderColor: '#ffffff', borderRadius: 0, '&:hover': { bgcolor: '#333' }}}
          >
            Cancel
          </Button>
          <Button 
            variant="contained" 
            onClick={handleSubmit}
            sx={{ 
              fontFamily: retroFont, 
              bgcolor: '#ffffff', 
              color: '#000000', 
              borderRadius: 0, 
              border: '2px solid #ffffff',
              '&:hover': { bgcolor: '#000000', color: '#ffffff' }
            }}
          >
            Post Job
          </Button>
        </DialogActions>
      </Dialog>
      
    </>
  );
}

export default CreateJob;