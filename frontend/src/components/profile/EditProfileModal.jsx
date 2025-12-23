import React, { useState, useEffect } from 'react';
import { X, Camera, Loader2, User, FileText, Linkedin, Github, Twitter, Briefcase } from 'lucide-react';
import ImageCropper from '../imageOptions/ImageCropper.jsx';
import { API_BASE_URL } from '../../config.js';

const getFullUrl = (path) => {
    if (!path) return null;
    if (path.startsWith('http')) return path;
    return `${API_BASE_URL}${path}`;
};

function EditProfileModal({ open, onClose, profileData, onSave }) {
    const [formData, setFormData] = useState({});
    const [profileImage, setProfileImage] = useState(null);
    const [bannerImage, setBannerImage] = useState(null);
    const [profilePreview, setProfilePreview] = useState(null);
    const [bannerPreview, setBannerPreview] = useState(null);

    // Cropper State
    const [cropperOpen, setCropperOpen] = useState(false);
    const [imageToCrop, setImageToCrop] = useState(null);
    const [cropAspect, setCropAspect] = useState(1);
    const [croppingType, setCroppingType] = useState(null);

    //
    const [shouldRender, setShouldRender] = useState(open);
    const [isAnimate, setIsAnimate] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (open) {
            setShouldRender(true);
            const timer = setTimeout(() => setIsAnimate(true), 10);

            if (profileData) {
                setFormData({
                    name: profileData.name || '',
                    position: profileData.position || '',
                    bio: profileData.bio || '',
                    linkedin_url: profileData.linkedin_url || '',
                    github_url: profileData.github_url || '',
                    twitter_url: profileData.twitter_url || '',
                });
                setProfilePreview(getFullUrl(profileData.profile_picture_url));
                setBannerPreview(getFullUrl(profileData.profile_banner_url));
                setProfileImage(null);
                setBannerImage(null);
            }
            return () => clearTimeout(timer);
        } else {
            setIsAnimate(false);
            const timer = setTimeout(() => setShouldRender(false), 300);
            return () => clearTimeout(timer);
        }
    }, [profileData, open]);

    const handleFileChange = (e, type) => {
        const file = e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = () => {
            setImageToCrop(reader.result);
            setCroppingType(type);
            setCropAspect(type === 'profile' ? 1 / 1 : 16 / 5);
            setCropperOpen(true);
        };
        reader.readAsDataURL(file);
        e.target.value = null;
    };

    const handleCropComplete = (croppedFile) => {
        const previewUrl = URL.createObjectURL(croppedFile);
        if (croppingType === 'profile') {
            setProfileImage(croppedFile);
            setProfilePreview(previewUrl);
        } else if (croppingType === 'banner') {
            setBannerImage(croppedFile);
            setBannerPreview(previewUrl);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        const data = new FormData();
        Object.keys(formData).forEach(key => data.append(key, formData[key]));
        if (profileImage) data.append('profileImage', profileImage);
        if (bannerImage) data.append('bannerImage', bannerImage);

        try {
            const response = await fetch(`${API_BASE_URL}/api/profile/update`, {
                method: 'POST',
                body: data,
                credentials: 'include',
            });
            const result = await response.json();
            if (!response.ok) throw new Error(result.message || 'Failed to update.');
            onSave();
            onClose();
        } catch (error) {
            console.error("Failed to update profile:", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!shouldRender) return null;

    return (
        <>
            <div className={`fixed inset-0 z-150 flex items-center justify-center p-4 transition-opacity duration-300 ${isAnimate ? 'opacity-100' : 'opacity-0'}`}>
                {/* Backdrop */}
                <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

                {/* Modal Container */}
                <div className={`relative w-full max-w-xl bg-card border border-border rounded-2xl shadow-2xl flex flex-col max-h-[90vh] transition-all duration-300 ease-out transform ${isAnimate ? 'translate-y-0 scale-100' : 'translate-y-10 scale-95'
                    }`}>

                    {/* Header */}
                    <div className="flex items-center justify-between p-4 border-b border-border">
                        <div className="flex items-center gap-2">
                            <button onClick={onClose} className="p-2 hover:bg-foreground/5 rounded-full text-muted transition-colors">
                                <X size={20} />
                            </button>
                            <h2 className="text-xl font-bold text-foreground">Edit profile</h2>
                        </div>
                        <button
                            onClick={handleSubmit}
                            disabled={isSubmitting}
                            className="px-6 py-1.5 bg-primary text-background rounded-full font-bold text-sm hover:opacity-90 disabled:opacity-50 transition-all flex items-center gap-2"
                        >
                            {isSubmitting ? <Loader2 size={16} className="animate-spin" /> : 'Save'}
                        </button>
                    </div>

                    <div className="overflow-y-auto">
                        {/* Images Section */}
                        <div className="relative">
                            {/* Banner Upload */}
                            <div
                                className="h-40 sm:h-48 bg-muted/20 border-b border-border relative flex items-center justify-center overflow-hidden"
                                style={{ backgroundImage: `url(${bannerPreview})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
                            >
                                <label className="absolute inset-0 flex items-center justify-center cursor-pointer bg-black/20 hover:bg-black/40 transition-colors group">
                                    <div className="p-3 bg-black/50 rounded-full text-white group-hover:scale-110 transition-transform">
                                        <Camera size={24} />
                                    </div>
                                    <input type="file" hidden accept="image/*" onChange={(e) => handleFileChange(e, 'banner')} />
                                </label>
                            </div>

                            <div className="absolute -bottom-12 left-4">
                                <div
                                    className="w-24 h-24 sm:w-32 sm:h-32 bg-card border-4 border-background rounded-2xl overflow-hidden relative shadow-lg"
                                >
                                    <img src={profilePreview} className="w-full h-full object-cover" alt="" />
                                    <label className="absolute inset-0 flex items-center justify-center cursor-pointer bg-black/20 hover:bg-black/40 transition-colors group">
                                        <div className="p-2 bg-black/50 rounded-full text-white group-hover:scale-110 transition-transform">
                                            <Camera size={20} />
                                        </div>
                                        <input type="file" hidden accept="image/*" onChange={(e) => handleFileChange(e, 'profile')} />
                                    </label>
                                </div>
                            </div>
                        </div>

                        {/* Fields Section */}
                        <div className="p-6 pt-16 space-y-5">
                            {/* Name */}
                            <div className="space-y-1">
                                <label className="text-xs font-bold text-muted uppercase tracking-wider flex items-center gap-2">
                                    <User size={14} /> Name
                                </label>
                                <input name="name" value={formData.name || ''} onChange={handleChange}
                                    className="w-full bg-transparent border-b border-border py-2 focus:outline-none focus:border-primary transition-colors text-foreground"
                                />
                            </div>

                            {/* Position (Conditional) */}
                            {(profileData.role === 'admin' || profileData.role === 'faculty') && (
                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-muted uppercase tracking-wider flex items-center gap-2">
                                        <Briefcase size={14} /> Position / Title
                                    </label>
                                    <input name="position" value={formData.position || ''} onChange={handleChange}
                                        placeholder="e.g. HOD Computer Science"
                                        className="w-full bg-transparent border-b border-border py-2 focus:outline-none focus:border-primary transition-colors text-foreground"
                                    />
                                </div>
                            )}

                            {/* Bio */}
                            <div className="space-y-1">
                                <label className="text-xs font-bold text-muted uppercase tracking-wider flex items-center gap-2">
                                    <FileText size={14} /> Bio
                                </label>
                                <textarea name="bio" value={formData.bio || ''} onChange={handleChange} rows={3}
                                    className="w-full bg-transparent border-b border-border py-2 focus:outline-none focus:border-primary transition-colors text-foreground resize-none"
                                />
                            </div>

                            {/* Social URLs */}
                            <div className="grid grid-cols-1 gap-4 pt-2">
                                <div className="flex items-center gap-3 group">
                                    <Linkedin size={20} className="text-muted group-focus-within:text-primary" />
                                    <input name="linkedin_url" value={formData.linkedin_url || ''} onChange={handleChange} placeholder="LinkedIn URL"
                                        className="flex-1 bg-transparent border-b border-border py-2 focus:outline-none focus:border-primary transition-colors text-sm"
                                    />
                                </div>
                                <div className="flex items-center gap-3 group">
                                    <Github size={20} className="text-muted group-focus-within:text-primary" />
                                    <input name="github_url" value={formData.github_url || ''} onChange={handleChange} placeholder="GitHub URL"
                                        className="flex-1 bg-transparent border-b border-border py-2 focus:outline-none focus:border-primary transition-colors text-sm"
                                    />
                                </div>
                                <div className="flex items-center gap-3 group">
                                    <Twitter size={20} className="text-muted group-focus-within:text-primary" />
                                    <input name="twitter_url" value={formData.twitter_url || ''} onChange={handleChange} placeholder="X (Twitter) URL"
                                        className="flex-1 bg-transparent border-b border-border py-2 focus:outline-none focus:border-primary transition-colors text-sm"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {cropperOpen && (
                <ImageCropper
                    image={imageToCrop}
                    aspect={cropAspect}
                    onCropComplete={handleCropComplete}
                    onClose={() => setCropperOpen(false)}
                />
            )}
        </>
    );
}

export default EditProfileModal;