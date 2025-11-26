import React, { useState } from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button,
  Box, Typography, IconButton, Slide, Select, MenuItem, InputLabel, FormControl
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { API_BASE_URL } from '../../config';

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

function EditJobModal({ open, onClose, job, onSave }) {
  const [formData, setFormData] = useState({
    title: job?.title || '',
    company: job?.company || '',
    location: job?.location || '',
    job_type: job?.job_type || 'Full-time',
    work_location: job?.work_location || 'On-site',
    salary_range: job?.salary_range || '',
    description: job?.description || '',
    requirements: job?.requirements || '',
    application_deadline: job?.application_deadline?.split('T')[0] || '',
    external_link: job?.external_link || ''
  });
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      const submitData = { ...formData };
      if (submitData.application_deadline === '') {
        submitData.application_deadline = null;
      }

      const response = await fetch(`${API_BASE_URL}/api/jobs/update-job/${job.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(submitData),
        credentials: 'include',
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to update job.');
      }

      onSave(data.job);
      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      TransitionComponent={Transition}
    >
      <DialogTitle>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          Edit Job Post
          <IconButton onClick={onClose} size="small" sx={{ color: '#ffffff' }}>
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>
      <DialogContent dividers>
        <Box component="form" onSubmit={handleSubmit}>
          <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
            <TextField name="title" label="Job Title" value={formData.title} onChange={handleChange} required InputLabelProps={{ shrink: true }} />
            <TextField name="company" label="Company" value={formData.company} onChange={handleChange} required InputLabelProps={{ shrink: true }} />
            <TextField name="location" label="Location" value={formData.location} onChange={handleChange} required InputLabelProps={{ shrink: true }} />

            <FormControl fullWidth>
              <InputLabel shrink>Job Type</InputLabel>
              <Select name="job_type" value={formData.job_type} label="Job Type" onChange={handleChange}>
                <MenuItem value="Full-time">Full-time</MenuItem>
                <MenuItem value="Part-time">Part-time</MenuItem>
                <MenuItem value="Contract">Contract</MenuItem>
                <MenuItem value="Internship">Internship</MenuItem>
              </Select>
            </FormControl>

            <FormControl fullWidth>
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
              sx={{ gridColumn: 'span 2' }} 
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              name="requirements"
              label="Requirements"
              value={formData.requirements}
              onChange={handleChange}
              multiline
              rows={3}
              sx={{ gridColumn: 'span 2' }}
              InputLabelProps={{ shrink: true }}
            />

            <TextField
              name="application_deadline"
              label="Application Deadline"
              type="date"
              value={formData.application_deadline}
              onChange={handleChange}
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              name="external_link"
              label="External Application Link"
              value={formData.external_link}
              onChange={handleChange}
              InputLabelProps={{ shrink: true }}
            />
          </Box>
          {error && (
            <Typography color="error" sx={{ mt: 2 }}>
              {error}
            </Typography>
          )}
        </Box>
      </DialogContent>
      <DialogActions sx={{ pr: 3, pb: 2 }}>
        <Button 
          onClick={onClose} 
          disabled={isSubmitting} 
        >
          Cancel
        </Button>
        <Button 
          variant="contained" 
          onClick={handleSubmit}
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Saving...' : 'Save Changes'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default EditJobModal;