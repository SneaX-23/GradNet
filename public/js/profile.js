document.addEventListener('DOMContentLoaded', () => {
    // --- Element References ---
    const body = document.body;
    const form = document.querySelector('.modal-form');

    // Edit Profile Modal
    const editProfileBtn = document.getElementById('editProfileBtn');
    const editProfileModal = document.getElementById('editProfileModal');
    const closeModalBtn = document.getElementById('closeModalBtn');
    
    // Image Inputs and Previews
    const headerImageInput = document.getElementById('headerImageInput');
    const profileImageInput = document.getElementById('profileImageInput');
    const headerPreview = document.getElementById('headerPreview');
    const profilePicPreview = document.getElementById('profilePicPreview');

    // Cropper Modal
    const cropperModal = document.getElementById('cropperModal');
    const imageToCrop = document.getElementById('imageToCrop');
    const cropImageBtn = document.getElementById('cropImageBtn');
    const cancelCropBtn = document.getElementById('cancelCropBtn');

    // --- State Variables ---
    let cropper;
    let croppedImageBlob = null;
    let headerImageFile = null; // Track the header image file

    // --- Modal Handling ---
    function openModal(modal) {
        if (modal) {
            modal.style.display = 'flex';
            body.classList.add('modal-open');
        }
    }

    function closeModal(modal) {
        if (modal) {
            modal.style.display = 'none';
        }
        // Only remove the class if all modals are closed
        if (!document.querySelector('.modal-overlay[style*="display: flex"]')) {
            body.classList.remove('modal-open');
        }
        // Clean up the cropper instance when its modal is closed
        if (modal === cropperModal && cropper) {
            cropper.destroy();
            cropper = null;
        }
    }

    // --- File Handling & Cropping ---

    // 1. Handle Header Image Preview (Direct Preview)
    headerImageInput.addEventListener('change', function(e) {
        const file = e.target.files[0];
        console.log('Header image selected:', file);
        
        if (file) {
            headerImageFile = file; // Store the file reference
            const reader = new FileReader();
            reader.onload = function(event) {
                headerPreview.innerHTML = `<img src="${event.target.result}" alt="Header preview">`;
                console.log('Header image preview updated');
            };
            reader.readAsDataURL(file);
        } else {
            headerImageFile = null;
            console.log('Header image cleared');
        }
    });

    // 2. Handle Profile Picture (Open Cropper)
    profileImageInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        console.log('Profile image selected:', file);
        
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (event) => {
            imageToCrop.src = event.target.result;
            openModal(cropperModal);
            
            // Destroy existing cropper before creating new one
            if (cropper) {
                cropper.destroy();
            }
            
            cropper = new Cropper(imageToCrop, {
                aspectRatio: 1,
                viewMode: 1,
                autoCropArea: 0.9,
                responsive: true,
                background: false,
            });
        };
        reader.readAsDataURL(file);
        // Clear the input value to allow re-selecting the same file
        e.target.value = '';
    });

    // 3. Handle the "Crop" button click
    cropImageBtn.addEventListener('click', () => {
        if (!cropper) return;

        cropper.getCroppedCanvas({
            width: 500,
            height: 500,
            imageSmoothingQuality: 'high',
        }).toBlob((blob) => {
            croppedImageBlob = blob;
            console.log('Profile image cropped, blob size:', blob.size);
            
            const previewUrl = URL.createObjectURL(blob);
            profilePicPreview.innerHTML = `<img src="${previewUrl}" alt="New profile picture preview">`;
            
            closeModal(cropperModal);
        }, 'image/jpeg', 0.9);
    });

    // --- Form Submission ---
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        console.log('Form submission started');
        console.log('Header image file:', headerImageFile);
        console.log('Cropped profile blob:', croppedImageBlob);
        
        // Create FormData manually to ensure proper file handling
        const formData = new FormData();
        
        // Add text fields
        const textInputs = form.querySelectorAll('input[type="text"], input[type="tel"], input[type="url"], textarea');
        textInputs.forEach(input => {
            if (input.name && input.value !== undefined) {
                formData.append(input.name, input.value);
                console.log(`Added text field: ${input.name} = ${input.value}`);
            }
        });
        
        // Add header image if selected
        if (headerImageFile) {
            formData.append('headerImage', headerImageFile, headerImageFile.name);
            console.log('Added header image to FormData:', headerImageFile.name);
        }
        
        // Add cropped profile image if available
        if (croppedImageBlob) {
            formData.append('profileImage', croppedImageBlob, 'profile.jpg');
            console.log('Added cropped profile image to FormData');
        }
        
        // Log FormData contents for debugging
        console.log('FormData contents:');
        for (let [key, value] of formData.entries()) {
            if (value instanceof File || value instanceof Blob) {
                console.log(`${key}:`, value.name || 'blob', `(${value.size} bytes)`);
            } else {
                console.log(`${key}:`, value);
            }
        }
        
        // Submit the form
        fetch('/home/profile/update', {
            method: 'POST',
            body: formData
        })
        .then(response => {
            console.log('Response status:', response.status);
            if (response.ok) {
                console.log('Profile update successful');
                window.location.reload();
            } else {
                console.error('Profile update failed:', response.status);
                alert('Failed to update profile. Please try again.');
            }
        })
        .catch(error => {
            console.error('Error updating profile:', error);
            alert('An error occurred while updating your profile.');
        });
    });

    // --- General Event Listeners ---
    if (editProfileBtn) {
        editProfileBtn.addEventListener('click', () => {
            console.log('Opening edit profile modal');
            openModal(editProfileModal);
        });
    }
    
    if (closeModalBtn) {
        closeModalBtn.addEventListener('click', () => {
            console.log('Closing edit profile modal');
            closeModal(editProfileModal);
        });
    }
    
    if (cancelCropBtn) {
        cancelCropBtn.addEventListener('click', () => {
            console.log('Canceling crop modal');
            closeModal(cropperModal);
        });
    }

    // --- Cleanup on page unload ---
    window.addEventListener('beforeunload', () => {
        if (cropper) {
            cropper.destroy();
        }
    });
});