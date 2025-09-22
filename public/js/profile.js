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
    let croppedImageBlob = null; // This will hold the final cropped image data

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
        }
    }

    // --- File Handling & Cropping ---

    // 1. Handle Header Image Preview (Direct Preview)
    headerImageInput.addEventListener('change', function(e) {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(event) {
                headerPreview.innerHTML = `<img src="${event.target.result}" alt="Header preview">`;
            };
            reader.readAsDataURL(file);
        }
    });

    // 2. Handle Profile Picture (Open Cropper)
    profileImageInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (event) => {
            imageToCrop.src = event.target.result;
            openModal(cropperModal);
            
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
            croppedImageBlob = blob; // Store the cropped image data
            
            const previewUrl = URL.createObjectURL(blob);
            profilePicPreview.innerHTML = `<img src="${previewUrl}" alt="New profile picture preview">`;
            
            closeModal(cropperModal);
        }, 'image/jpeg');
    });

    // --- Form Submission ---
    form.addEventListener('submit', (e) => {
        e.preventDefault(); // Stop the default form submission
        
        const formData = new FormData(form);

        // If a new profile image was cropped, replace the original file with the blob
        if (croppedImageBlob) {
            formData.delete('profileImage'); // Remove the original (uncropped) file
            formData.append('profileImage', croppedImageBlob, 'profile.jpg'); // Add the new cropped blob
        }
        
        // Now you would submit the formData using fetch or another method
        // For now, we'll let it submit traditionally after a delay to see the data
        console.log('Submitting form data...');
        for (let [key, value] of formData.entries()) {
            console.log(key, value);
        }
        
        // Example of how you would send it with fetch:
        
        fetch('/home/profile/update', {
            method: 'POST',
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            if(data.success) {
                window.location.reload();
            } else {
                alert('Failed to update profile.');
            }
        })
        .catch(error => console.error('Error:', error));
        

       // For demonstration, we'll just submit the form normally
       form.submit();
    });

    // --- General Event Listeners ---
    if (editProfileBtn) editProfileBtn.addEventListener('click', () => openModal(editProfileModal));
    if (closeModalBtn) closeModalBtn.addEventListener('click', () => closeModal(editProfileModal));
    if (cancelCropBtn) cancelCropBtn.addEventListener('click', () => closeModal(cropperModal));
});