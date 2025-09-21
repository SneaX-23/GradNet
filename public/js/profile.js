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