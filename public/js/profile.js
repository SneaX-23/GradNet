document.addEventListener('DOMContentLoaded', () => {
    const editProfileBtn = document.getElementById('editProfileBtn');
    const editProfileModal = document.getElementById('editProfileModal');
    const closeModalBtn = document.getElementById('closeModalBtn');

    // Function to open the modal
    function openModal() {
        if (editProfileModal) {
            editProfileModal.style.display = 'flex';
        }
    }

    // Function to close the modal
    function closeModal() {
        if (editProfileModal) {
            editProfileModal.style.display = 'none';
        }
    }

    // Event listeners
    if (editProfileBtn) {
        editProfileBtn.addEventListener('click', openModal);
    }
    
    if (closeModalBtn) {
        closeModalBtn.addEventListener('click', closeModal);
    }

    // Close modal if user clicks on the overlay
    if (editProfileModal) {
        editProfileModal.addEventListener('click', (event) => {
            if (event.target === editProfileModal) {
                closeModal();
            }
        });
    }
});

document.addEventListener('DOMContentLoaded', () => {
    const editProfileBtn = document.getElementById('editProfileBtn');
    const editProfileModal = document.getElementById('editProfileModal');
    const closeModalBtn = document.getElementById('closeModalBtn');

    // New element references for image previews
    const headerImageInput = document.getElementById('headerImageInput');
    const profileImageInput = document.getElementById('profileImageInput');
    const headerPreview = document.getElementById('headerPreview');
    const profilePicPreview = document.getElementById('profilePicPreview');

    // Function to open the modal
    function openModal() {
        if (editProfileModal) {
            editProfileModal.style.display = 'flex';
        }
    }

    // Function to close the modal
    function closeModal() {
        if (editProfileModal) {
            editProfileModal.style.display = 'none';
        }
    }
    
    // Reusable function to handle file preview
    function handleFilePreview(inputElement, previewContainer) {
        inputElement.addEventListener('change', function(e) {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = function(event) {
                    // Create an img element for the preview
                    const img = document.createElement('img');
                    img.src = event.target.result;
                    
                    // Clear previous preview and add new one
                    previewContainer.innerHTML = ''; 
                    previewContainer.appendChild(img);

                    // Re-add the label and input for future changes
                    const label = document.createElement('label');
                    label.htmlFor = inputElement.id;
                    label.className = 'image-upload-label';
                    label.title = `Change ${inputElement.id.includes('header') ? 'header' : 'profile'} image`;
                    label.innerHTML = '📷';
                    
                    previewContainer.appendChild(label);
                    previewContainer.appendChild(inputElement);
                }
                reader.readAsDataURL(file);
            }
        });
    }

    // Event listeners for modal
    if (editProfileBtn) editProfileBtn.addEventListener('click', openModal);
    if (closeModalBtn) closeModalBtn.addEventListener('click', closeModal);
    if (editProfileModal) {
        editProfileModal.addEventListener('click', (event) => {
            if (event.target === editProfileModal) closeModal();
        });
    }

    // Initialize file preview handlers
    if (headerImageInput && headerPreview) handleFilePreview(headerImageInput, headerPreview);
    if (profileImageInput && profilePicPreview) handleFilePreview(profileImageInput, profilePicPreview);
});