document.addEventListener('DOMContentLoaded', function() {
    // Element references
    const form = document.getElementById('postForm');
    const titleInput = document.getElementById('postTitle');
    const descriptionInput = document.getElementById('postDescription');
    const submitBtn = document.getElementById('submitBtn');
    const titleCounter = document.getElementById('titleCounter');
    const descCounter = document.getElementById('descCounter');
    const imageBtn = document.getElementById('imageBtn');
    const imageInput = document.getElementById('imageInput');
    const imageUploadSection = document.querySelector('.image-upload-section');
    const imagePreview = document.getElementById('imagePreview');
    const errorMessages = document.getElementById('errorMessages');
    const btnText = document.querySelector('.btn-text');
    const btnLoader = document.querySelector('.btn-loader');

    // Configuration
    const CONFIG = {
    titleMaxLength: 100,
    descriptionMaxLength: 280,
    maxFileSize: 50 * 1024 * 1024, // 50MB (for videos)
    allowedFileTypes: [
        'image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp',
        'video/mp4', 'video/webm', 'video/ogg'
    ]
};

    // Validation and counter update function
    function updateValidation() {
        const titleValue = titleInput.value.trim();
        const descriptionValue = descriptionInput.value.trim();
        const titleLength = titleValue.length;
        const descriptionLength = descriptionValue.length;
        
        // Update counters
        titleCounter.textContent = `${titleLength}/${CONFIG.titleMaxLength}`;
        descCounter.textContent = `${descriptionLength}/${CONFIG.descriptionMaxLength}`;
        
        // Color coding for counters
        updateCounterColor(titleCounter, titleLength, CONFIG.titleMaxLength);
        updateCounterColor(descCounter, descriptionLength, CONFIG.descriptionMaxLength);
        
        // Validate form
        const isTitleValid = titleLength > 0 && titleLength <= CONFIG.titleMaxLength;
        const isDescValid = descriptionLength > 0 && descriptionLength <= CONFIG.descriptionMaxLength;
        const isFormValid = isTitleValid && isDescValid;
        
        // Update submit button
        submitBtn.disabled = !isFormValid;
        submitBtn.style.opacity = isFormValid ? '1' : '0.5';
        
        // Update help text
        const submitHelp = document.getElementById('submitHelp');
        if (isFormValid) {
            submitHelp.textContent = 'Ready to post!';
            submitHelp.style.color = '#16a34a';
        } else {
            submitHelp.textContent = 'Fill both title and description to post';
            submitHelp.style.color = '#666666';
        }
        
        // Clear any previous validation errors
        clearErrors();
    }

    function updateCounterColor(counter, currentLength, maxLength) {
        const percentage = currentLength / maxLength;
        
        if (percentage > 0.95) {
            counter.style.color = '#dc2626'; // Red
        } else if (percentage > 0.8) {
            counter.style.color = '#f59e0b'; // Orange
        } else {
            counter.style.color = '#666666'; // Default gray
        }
    }

    // Error handling
    function showError(message) {
        errorMessages.textContent = message;
        errorMessages.style.display = 'block';
        errorMessages.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }

    function clearErrors() {
        errorMessages.style.display = 'none';
        errorMessages.textContent = '';
    }

    // File validation
    function validateFile(file) {
        if (!file) return true;

        // Check file size
        if (file.size > CONFIG.maxFileSize) {
            showError(`Image too large. Please choose a file under ${CONFIG.maxFileSize / (1024 * 1024)}MB.`);
            return false;
        }

        // Check file type
        if (!CONFIG.allowedFileTypes.includes(file.type)) {
            showError('Please select a valid image file (JPG, PNG, GIF, WebP).');
            return false;
        }

        return true;
    }

    // Event listeners
    titleInput.addEventListener('input', updateValidation);
    descriptionInput.addEventListener('input', updateValidation);

    // Auto-resize textarea
    descriptionInput.addEventListener('input', function() {
        this.style.height = 'auto';
        this.style.height = Math.min(this.scrollHeight, 200) + 'px';
    });

    // Image upload functionality
    imageBtn.addEventListener('click', function() {
        imageInput.click();
    });

    imageInput.addEventListener('change', function(e) {
        const file = e.target.files[0];
        
        if (file) {
            if (!validateFile(file)) {
                this.value = '';
                return;
            }

            // Show upload section
            imageUploadSection.style.display = 'block';
            
            // Create file preview
        const reader = new FileReader();
        reader.onload = function(e) {
        let previewElement;
        if (file.type.startsWith('image/')) {
            previewElement = `<img src="${e.target.result}" alt="Image preview" style="max-width: 100%; max-height: 200px; border-radius: 8px;">`;
        } else if (file.type.startsWith('video/')) {
            previewElement = `<video src="${e.target.result}" controls muted autoplay style="max-width: 100%; max-height: 200px; border-radius: 8px;"></video>`;
        }

        imagePreview.innerHTML = `
            <div class="image-preview-container">
                ${previewElement}
                <button 
                        type="button" 
                        class="remove-image" 
                        onclick="removeImage()" 
                        aria-label="Remove file"
                        title="Remove file"
                    >✕</button>
                    <div class="image-info">
                        <span class="file-name">${file.name}</span>
                        <span class="file-size">${(file.size / 1024).toFixed(1)}KB</span>
                    </div>
                </div>
            `;
        };
        reader.readAsDataURL(file);
        }
    });

    // Form submission
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Final validation
        if (submitBtn.disabled) {
            showError('Please complete all required fields before submitting.');
            return;
        }

        // Validate file if present
        if (imageInput.files[0] && !validateFile(imageInput.files[0])) {
            return;
        }

        const formData = new FormData(this);
        
        // Show loading state
        btnText.style.display = 'none';
        btnLoader.style.display = 'inline';
        submitBtn.disabled = true;
        clearErrors();

        // Submit form data
        fetch('/home/posts/create', {
            method: 'POST',
            body: formData
        })
        .then(response => {
            if (!response.ok) {
                return response.json().then(err => Promise.reject(err));
            }
            return response.json();
        })
        .then(data => {
            if (data.success) {
                // Reset form
                form.reset();
                imageUploadSection.style.display = 'none';
                imagePreview.innerHTML = '';
                descriptionInput.style.height = 'auto';
                
                // Reset counters
                titleCounter.textContent = '0/100';
                descCounter.textContent = '0/280';
                updateValidation();
                
                // Show success message
                showSuccessMessage('Post created successfully!');
                
                // Reload page after short delay to show new post
                setTimeout(() => {
                    window.location.reload();
                }, 1500);
            } else {
                throw new Error(data.message || 'Failed to create post');
            }
        })
        .catch(error => {
            console.error('Error creating post:', error);
            
            // Handle different error types
            let errorMessage = 'Failed to create post. Please try again.';
            
            if (error.status === 413 || error.message?.includes('413')) {
                errorMessage = 'File too large. Please choose a smaller image.';
            } else if (error.status === 400 || error.message?.includes('400')) {
                errorMessage = error.message || 'Please check your input and try again.';
            } else if (error.status === 401) {
                errorMessage = 'Please log in to create posts.';
            } else if (error.status === 429) {
                errorMessage = 'Too many posts. Please wait before posting again.';
            }
            
            showError(errorMessage);
        })
        .finally(() => {
            // Reset button state
            btnText.style.display = 'inline';
            btnLoader.style.display = 'none';
            updateValidation();
        });
    });

    // Success message function
    function showSuccessMessage(message) {
        const successDiv = document.createElement('div');
        successDiv.className = 'success-message';
        successDiv.textContent = message;
        successDiv.style.cssText = `
            background: #f0fdf4;
            color: #16a34a;
            border: 1px solid #bbf7d0;
            padding: 12px 16px;
            border-radius: 8px;
            margin-top: 12px;
            font-weight: 500;
        `;
        
        form.appendChild(successDiv);
        
        setTimeout(() => {
            successDiv.remove();
        }, 3000);
    }

    // Initialize validation
    updateValidation();
});

// Remove image function (global scope for onclick)
function removeImage() {
    const imageInput = document.getElementById('imageInput');
    const imageUploadSection = document.querySelector('.image-upload-section');
    const imagePreview = document.getElementById('imagePreview');
    
    imageInput.value = '';
    imageUploadSection.style.display = 'none';
    imagePreview.innerHTML = '';
}

// Keyboard navigation for image removal
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        const imageUploadSection = document.querySelector('.image-upload-section');
        if (imageUploadSection.style.display !== 'none') {
            removeImage();
        }
    }
});
