import { useState } from "react";
import { useNavigate } from "react-router-dom";
import useStore from "../context/store";

export default function CreateProfile() {
  const { updateProfile } = useStore();
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    bio: "",
    avatar: null
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const navigate = useNavigate();
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when user types
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };
  
  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({ ...prev, avatar: file }));
      
      // Create preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };
  
  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.username.trim()) {
      newErrors.username = "Username is required";
    } else if (formData.username.length < 3) {
      newErrors.username = "Username must be at least 3 characters";
    }
    
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      setIsSubmitting(true);
      try {
        // Update the global store with the profile data
        await updateProfile({
          username: formData.username,
          email: formData.email,
          bio: formData.bio,
          avatar: avatarPreview
        });
        navigate("/home");
      } catch (error) {
        console.error("Error creating profile:", error);
        setErrors({ submit: "Failed to create profile. Please try again." });
      } finally {
        setIsSubmitting(false);
      }
    }
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-md">
          <div className="bg-dark border border-royalPurple rounded-lg p-6 shadow-lg">
            <div className="text-center mb-6">
              <h1 className="text-2xl font-bold text-gold mb-2">Create Your Profile</h1>
              <p className="text-lightGray">Set up your PiMemes profile</p>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Avatar Upload */}
              <div className="flex flex-col items-center mb-6">
                <div 
                  className="w-24 h-24 rounded-full bg-royalPurple bg-opacity-30 flex items-center justify-center overflow-hidden border-2 border-royalPurple mb-2"
                  style={{ 
                    backgroundImage: avatarPreview ? `url(${avatarPreview})` : 'none',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center'
                  }}
                >
                  {!avatarPreview && (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-royalPurple" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  )}
                </div>
                <label className="bg-royalPurple text-gold text-sm py-1 px-3 rounded-full cursor-pointer hover:bg-opacity-90 transition-all">
                  Upload Avatar
                  <input 
                    type="file" 
                    accept="image/*" 
                    className="hidden" 
                    onChange={handleAvatarChange}
                  />
                </label>
              </div>
              
              {/* Username */}
              <div>
                <label htmlFor="username" className="block text-sm font-medium text-lightGray mb-1">
                  Username <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="username"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  className={`w-full bg-dark border ${errors.username ? 'border-red-500' : 'border-gray-700'} rounded-lg p-3 text-lightGray focus:outline-none focus:ring-1 focus:ring-royalPurple`}
                  placeholder="Enter a unique username"
                />
                {errors.username && (
                  <p className="mt-1 text-xs text-red-500">{errors.username}</p>
                )}
              </div>
              
              {/* Email */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-lightGray mb-1">
                  Email <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`w-full bg-dark border ${errors.email ? 'border-red-500' : 'border-gray-700'} rounded-lg p-3 text-lightGray focus:outline-none focus:ring-1 focus:ring-royalPurple`}
                  placeholder="Enter your email"
                />
                {errors.email && (
                  <p className="mt-1 text-xs text-red-500">{errors.email}</p>
                )}
              </div>
              
              {/* Bio */}
              <div>
                <label htmlFor="bio" className="block text-sm font-medium text-lightGray mb-1">
                  Bio (Optional)
                </label>
                <textarea
                  id="bio"
                  name="bio"
                  value={formData.bio}
                  onChange={handleChange}
                  rows="3"
                  className="w-full bg-dark border border-gray-700 rounded-lg p-3 text-lightGray focus:outline-none focus:ring-1 focus:ring-royalPurple"
                  placeholder="Tell us about yourself"
                ></textarea>
              </div>
              
              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-royalPurple text-gold py-3 px-4 rounded-lg flex items-center justify-center hover:bg-opacity-90 transition-all disabled:opacity-70 mt-6"
              >
                {isSubmitting ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-gold" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Creating Profile...
                  </>
                ) : (
                  "Create Profile"
                )}
              </button>
              
              {/* Skip Link */}
              <div className="text-center mt-4">
                <button 
                  type="button" 
                  onClick={() => navigate("/home")}
                  className="text-sm text-gray-400 hover:text-gold"
                >
                  Skip for now
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
} 