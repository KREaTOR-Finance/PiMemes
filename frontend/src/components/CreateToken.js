import { useState } from "react";
import useTokenStore from "../context/tokenStore";
import { XMarkIcon, ArrowRightIcon, ArrowLeftIcon } from '@heroicons/react/24/outline';
import Card from "./Card";

/** @type {import('../types/token').TokenFormData} */
const initialFormData = {
  name: "",
  symbol: "",
  decimals: 18,
  totalSupply: "",
  description: "",
  network: "Pi Network",
  contractAddress: "",
  launchDate: new Date().toISOString().split('T')[0],
  socials: {
    website: "",
    twitter: "",
    telegram: "",
    discord: "",
    github: "",
    medium: ""
  },
  contact: {
    email: "",
    team: "",
    location: ""
  },
  tags: [],
  initialPrice: "",
  liquidityLocked: false,
  liquidityLockPeriod: 180, // 6 months default
};

const FormInput = ({ label, name, type = "text", value, onChange, required = false, placeholder = "", section = null, min, pattern }) => (
  <div>
    <label style={{ color: '#9ca3af', fontSize: '14px', display: 'block', marginBottom: '8px' }}>{label}</label>
    <div className="relative">
      <input
        type={type}
        name={name}
        value={value}
        onChange={(e) => onChange(e, section)}
        style={{
          width: '100%',
          backgroundColor: 'rgba(0, 0, 0, 0.4)',
          color: '#FFD700',
          padding: '16px',
          borderRadius: '12px',
          border: 'none',
          outline: 'none',
          fontSize: '16px'
        }}
        required={required}
        placeholder={placeholder}
        min={min}
        pattern={pattern}
      />
      {required && (
        <span style={{ position: 'absolute', top: '16px', right: '16px', color: '#FFD700', fontSize: '16px' }}>*</span>
      )}
    </div>
  </div>
);

export default function CreateToken() {
  const createNewToken = useTokenStore((state) => state.createNewToken);
  const [formData, setFormData] = useState(initialFormData);
  const [errors, setErrors] = useState({});
  const [logoImage, setLogoImage] = useState(null);
  const [bannerImage, setBannerImage] = useState(null);
  const [currentStep, setCurrentStep] = useState(1);
  
  const handleImageUpload = async (file, type) => {
    if (file) {
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('File size must be less than 5MB');
        return;
      }
      // Validate file type
      if (!file.type.startsWith('image/')) {
        alert('File must be an image');
        return;
      }
      const imageUrl = URL.createObjectURL(file);
      if (type === 'logo') {
        setLogoImage(imageUrl);
      } else {
        setBannerImage(imageUrl);
      }
    }
  };

  const handleChange = (e, section = null) => {
    const { name, value, type, checked } = e.target;
    
    // Clear error when field is modified
    setErrors(prev => ({ ...prev, [name]: '' }));
    
    if (section) {
      setFormData(prev => ({
        ...prev,
        [section]: {
          ...prev[section],
          [name]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      }));
    }
  };

  const validateStep = (step) => {
    const newErrors = {};
    
    if (step === 1) {
      if (!formData.name) newErrors.name = 'Token name is required';
      if (!formData.symbol) newErrors.symbol = 'Token symbol is required';
      if (!formData.totalSupply) newErrors.totalSupply = 'Total supply is required';
      if (formData.symbol && !/^[A-Z0-9]+$/.test(formData.symbol)) {
        newErrors.symbol = 'Symbol must be uppercase letters and numbers only';
      }
    }
    
    if (step === 2 && !logoImage) {
      newErrors.logo = 'Token logo is required';
    }
    
    if (step === 3) {
      if (formData.socials.website && !/^https?:\/\//.test(formData.socials.website)) {
        newErrors.website = 'Website must start with http:// or https://';
      }
      if (formData.contact.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.contact.email)) {
        newErrors.email = 'Invalid email format';
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, 4));
    }
  };

  const handleBack = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateStep(currentStep)) return;
    
    try {
      // First validate all steps
      for (let step = 1; step <= 4; step++) {
        if (!validateStep(step)) {
          setCurrentStep(step);
          return;
        }
      }

      // Handle image uploads first (this would be implemented in a real storage solution)
      const tokenData = {
        ...formData,
        logoImage: logoImage ? await handleImageUpload(logoImage, 'logo') : null,
        bannerImage: bannerImage ? await handleImageUpload(bannerImage, 'banner') : null,
      };
      
      // Create the token using the store action
      const result = await createNewToken(tokenData);
      
      if (result.error) {
        throw new Error(result.error);
      }

      // Success! Reset form or redirect
      alert('Token created successfully!');
      setFormData(initialFormData);
      setLogoImage(null);
      setBannerImage(null);
      setCurrentStep(1);
    } catch (error) {
      console.error('Error creating token:', error);
      setErrors({ submit: error.message || 'Failed to create token. Please try again.' });
    }
  };

  return (
    <Card>
      <div style={{ marginBottom: '32px' }}>
        <h2 style={{ color: '#FFD700', fontWeight: 'bold', fontSize: '24px', marginBottom: '8px' }}>Create Your Token</h2>
        <p style={{ color: '#9ca3af' }}>Fill in the details to create your meme token</p>
      </div>
      
      {/* Progress Steps */}
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '32px' }}>
        {['Basic Info', 'Images & Media', 'Social & Contact', 'Launch Details'].map((step, index) => (
          <div 
            key={step}
            style={{
              flex: 1,
              textAlign: 'center',
              color: currentStep > index + 1 ? '#FFD700' : currentStep === index + 1 ? '#FFD700' : '#6b7280'
            }}
          >
            <div style={{
              width: '32px',
              height: '32px',
              margin: '0 auto 8px',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: '2px solid',
              borderColor: currentStep > index + 1 ? '#FFD700' : currentStep === index + 1 ? '#FFD700' : '#6b7280',
              backgroundColor: currentStep > index + 1 ? '#FFD700' : 'transparent',
              color: currentStep > index + 1 ? '#000000' : 'inherit',
              transition: 'all 0.2s'
            }}>
              {index + 1}
            </div>
            <div style={{ fontSize: '14px', fontWeight: '500' }}>{step}</div>
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit}>
        {/* Step 1: Basic Info */}
        {currentStep === 1 && (
          <div style={{ display: 'grid', gap: '24px' }}>
            <FormInput
              label="Token Name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              placeholder="e.g., PiMeme Token"
            />
            {errors.name && <p style={{ color: '#ef4444', fontSize: '14px', marginTop: '-16px' }}>{errors.name}</p>}
            
            <FormInput
              label="Token Symbol"
              name="symbol"
              value={formData.symbol}
              onChange={handleChange}
              required
              placeholder="e.g., PMEME"
              pattern="[A-Z0-9]+"
            />
            {errors.symbol && <p style={{ color: '#ef4444', fontSize: '14px', marginTop: '-16px' }}>{errors.symbol}</p>}
            
            <div>
              <label style={{ color: '#9ca3af', fontSize: '14px', display: 'block', marginBottom: '8px' }}>Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows="4"
                style={{
                  width: '100%',
                  backgroundColor: 'rgba(0, 0, 0, 0.4)',
                  color: '#FFD700',
                  padding: '16px',
                  borderRadius: '12px',
                  border: 'none',
                  outline: 'none',
                  fontSize: '16px',
                  resize: 'none'
                }}
                required
                placeholder="Describe your token and its purpose..."
              />
            </div>
            
            <FormInput
              label="Total Supply"
              name="totalSupply"
              type="number"
              value={formData.totalSupply}
              onChange={handleChange}
              required
              min="1"
              placeholder="e.g., 1000000"
            />
            {errors.totalSupply && <p style={{ color: '#ef4444', fontSize: '14px', marginTop: '-16px' }}>{errors.totalSupply}</p>}
          </div>
        )}

        {/* Step 2: Images & Media */}
        {currentStep === 2 && (
          <div style={{ display: 'grid', gap: '24px' }}>
            <div>
              <label style={{ color: '#9ca3af', fontSize: '14px', display: 'block', marginBottom: '8px' }}>Token Logo (Required)</label>
              <div style={{
                border: '2px dashed rgba(106, 13, 173, 0.5)',
                borderRadius: '12px',
                padding: '32px',
                textAlign: 'center',
                transition: 'border-color 0.2s'
              }}
              onMouseOver={(e) => e.currentTarget.style.borderColor = '#FFD700'}
              onMouseOut={(e) => e.currentTarget.style.borderColor = 'rgba(106, 13, 173, 0.5)'}
              >
                {logoImage ? (
                  <div style={{ position: 'relative', width: '128px', height: '128px', margin: '0 auto' }}>
                    <img
                      src={logoImage}
                      alt="Token Logo Preview"
                      style={{ width: '100%', height: '100%', objectFit: 'contain', borderRadius: '12px' }}
                    />
                    <button
                      type="button"
                      onClick={() => setLogoImage(null)}
                      style={{
                        position: 'absolute',
                        top: '-8px',
                        right: '-8px',
                        backgroundColor: '#ef4444',
                        color: 'white',
                        borderRadius: '50%',
                        padding: '4px',
                        transition: 'background-color 0.2s'
                      }}
                      onMouseOver={(e) => e.target.style.backgroundColor = '#dc2626'}
                      onMouseOut={(e) => e.target.style.backgroundColor = '#ef4444'}
                    >
                      <XMarkIcon style={{ width: '20px', height: '20px' }} />
                    </button>
                  </div>
                ) : (
                  <div>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleImageUpload(e.target.files[0], 'logo')}
                      style={{ display: 'none' }}
                      id="logo-upload"
                    />
                    <label
                      htmlFor="logo-upload"
                      style={{
                        backgroundColor: '#FFD700',
                        color: '#000000',
                        padding: '12px 24px',
                        borderRadius: '12px',
                        cursor: 'pointer',
                        display: 'inline-block',
                        fontWeight: '500',
                        transition: 'background-color 0.2s'
                      }}
                      onMouseOver={(e) => e.target.style.backgroundColor = '#f7c600'}
                      onMouseOut={(e) => e.target.style.backgroundColor = '#FFD700'}
                    >
                      Upload Logo
                    </label>
                    <p style={{ color: '#9ca3af', marginTop: '12px', fontSize: '14px' }}>Recommended: 200x200px PNG (Max 5MB)</p>
                  </div>
                )}
              </div>
              {errors.logo && <p style={{ color: '#ef4444', fontSize: '14px', marginTop: '8px' }}>{errors.logo}</p>}
            </div>

            <div>
              <label style={{ color: '#9ca3af', fontSize: '14px', display: 'block', marginBottom: '8px' }}>Banner Image (Optional)</label>
              <div style={{
                border: '2px dashed rgba(106, 13, 173, 0.5)',
                borderRadius: '12px',
                padding: '32px',
                textAlign: 'center',
                transition: 'border-color 0.2s'
              }}
              onMouseOver={(e) => e.currentTarget.style.borderColor = '#FFD700'}
              onMouseOut={(e) => e.currentTarget.style.borderColor = 'rgba(106, 13, 173, 0.5)'}
              >
                {bannerImage ? (
                  <div style={{ position: 'relative', width: '100%', height: '192px' }}>
                    <img
                      src={bannerImage}
                      alt="Banner Preview"
                      style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '12px' }}
                    />
                    <button
                      type="button"
                      onClick={() => setBannerImage(null)}
                      style={{
                        position: 'absolute',
                        top: '-8px',
                        right: '-8px',
                        backgroundColor: '#ef4444',
                        color: 'white',
                        borderRadius: '50%',
                        padding: '4px',
                        transition: 'background-color 0.2s'
                      }}
                      onMouseOver={(e) => e.target.style.backgroundColor = '#dc2626'}
                      onMouseOut={(e) => e.target.style.backgroundColor = '#ef4444'}
                    >
                      <XMarkIcon style={{ width: '20px', height: '20px' }} />
                    </button>
                  </div>
                ) : (
                  <div>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleImageUpload(e.target.files[0], 'banner')}
                      style={{ display: 'none' }}
                      id="banner-upload"
                    />
                    <label
                      htmlFor="banner-upload"
                      style={{
                        backgroundColor: '#FFD700',
                        color: '#000000',
                        padding: '12px 24px',
                        borderRadius: '12px',
                        cursor: 'pointer',
                        display: 'inline-block',
                        fontWeight: '500',
                        transition: 'background-color 0.2s'
                      }}
                      onMouseOver={(e) => e.target.style.backgroundColor = '#f7c600'}
                      onMouseOut={(e) => e.target.style.backgroundColor = '#FFD700'}
                    >
                      Upload Banner
                    </label>
                    <p style={{ color: '#9ca3af', marginTop: '12px', fontSize: '14px' }}>Recommended: 1400x400px PNG (Max 5MB)</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Social & Contact */}
        {currentStep === 3 && (
          <div style={{ display: 'grid', gap: '24px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '24px' }}>
              <FormInput
                label="Website"
                name="website"
                value={formData.socials.website}
                onChange={handleChange}
                section="socials"
                placeholder="https://"
              />
              <FormInput
                label="Twitter"
                name="twitter"
                value={formData.socials.twitter}
                onChange={handleChange}
                section="socials"
                placeholder="@username"
              />
              <FormInput
                label="Telegram"
                name="telegram"
                value={formData.socials.telegram}
                onChange={handleChange}
                section="socials"
                placeholder="t.me/"
              />
              <FormInput
                label="Discord"
                name="discord"
                value={formData.socials.discord}
                onChange={handleChange}
                section="socials"
                placeholder="discord.gg/"
              />
            </div>

            <div style={{ height: '1px', backgroundColor: 'rgba(106, 13, 173, 0.3)', margin: '16px 0' }}></div>

            <div style={{ display: 'grid', gap: '24px' }}>
              <FormInput
                label="Contact Email"
                name="email"
                type="email"
                value={formData.contact.email}
                onChange={handleChange}
                section="contact"
                placeholder="team@project.com"
              />
              <FormInput
                label="Team Name"
                name="team"
                value={formData.contact.team}
                onChange={handleChange}
                section="contact"
                placeholder="Project Team"
              />
              <FormInput
                label="Location"
                name="location"
                value={formData.contact.location}
                onChange={handleChange}
                section="contact"
                placeholder="Global"
              />
            </div>
            {errors.email && <p style={{ color: '#ef4444', fontSize: '14px' }}>{errors.email}</p>}
          </div>
        )}

        {/* Step 4: Launch Details */}
        {currentStep === 4 && (
          <div style={{ display: 'grid', gap: '24px' }}>
            <FormInput
              label="Initial Price (in Pi)"
              name="initialPrice"
              type="number"
              value={formData.initialPrice}
              onChange={handleChange}
              required
              min="0"
              placeholder="0.00"
            />
            
            <div>
              <label style={{ color: '#9ca3af', fontSize: '14px', display: 'block', marginBottom: '8px' }}>Launch Date</label>
              <input
                type="date"
                name="launchDate"
                value={formData.launchDate}
                onChange={handleChange}
                style={{
                  width: '100%',
                  backgroundColor: 'rgba(0, 0, 0, 0.4)',
                  color: '#FFD700',
                  padding: '16px',
                  borderRadius: '12px',
                  border: 'none',
                  outline: 'none',
                  fontSize: '16px'
                }}
                required
                min={new Date().toISOString().split('T')[0]}
              />
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <input
                type="checkbox"
                name="liquidityLocked"
                checked={formData.liquidityLocked}
                onChange={handleChange}
                style={{
                  width: '20px',
                  height: '20px',
                  borderRadius: '6px',
                  border: 'none',
                  backgroundColor: formData.liquidityLocked ? '#FFD700' : 'rgba(0, 0, 0, 0.4)',
                  cursor: 'pointer'
                }}
              />
              <label style={{ color: '#FFD700', fontWeight: '500' }}>Lock Liquidity</label>
            </div>

            {formData.liquidityLocked && (
              <div>
                <label style={{ color: '#9ca3af', fontSize: '14px', display: 'block', marginBottom: '8px' }}>Lock Period (days)</label>
                <input
                  type="number"
                  name="liquidityLockPeriod"
                  value={formData.liquidityLockPeriod}
                  onChange={handleChange}
                  style={{
                    width: '100%',
                    backgroundColor: 'rgba(0, 0, 0, 0.4)',
                    color: '#FFD700',
                    padding: '16px',
                    borderRadius: '12px',
                    border: 'none',
                    outline: 'none',
                    fontSize: '16px'
                  }}
                  min="1"
                  required
                />
              </div>
            )}
          </div>
        )}

        {/* Navigation Buttons */}
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '32px' }}>
          {currentStep > 1 && (
            <button
              type="button"
              onClick={handleBack}
              style={{
                display: 'flex',
                alignItems: 'center',
                padding: '12px 24px',
                backgroundColor: 'rgba(0, 0, 0, 0.4)',
                color: '#FFD700',
                borderRadius: '12px',
                border: 'none',
                transition: 'background-color 0.2s',
                cursor: 'pointer'
              }}
              onMouseOver={(e) => e.target.style.backgroundColor = 'rgba(0, 0, 0, 0.6)'}
              onMouseOut={(e) => e.target.style.backgroundColor = 'rgba(0, 0, 0, 0.4)'}
            >
              <ArrowLeftIcon style={{ width: '20px', height: '20px', marginRight: '8px' }} />
              Back
            </button>
          )}
          
          {currentStep < 4 ? (
            <button
              type="button"
              onClick={handleNext}
              style={{
                display: 'flex',
                alignItems: 'center',
                padding: '12px 24px',
                backgroundColor: '#FFD700',
                color: '#000000',
                borderRadius: '12px',
                border: 'none',
                fontWeight: '500',
                marginLeft: 'auto',
                transition: 'background-color 0.2s',
                cursor: 'pointer'
              }}
              onMouseOver={(e) => e.target.style.backgroundColor = '#f7c600'}
              onMouseOut={(e) => e.target.style.backgroundColor = '#FFD700'}
            >
              Next
              <ArrowRightIcon style={{ width: '20px', height: '20px', marginLeft: '8px' }} />
            </button>
          ) : (
            <button
              type="submit"
              style={{
                display: 'flex',
                alignItems: 'center',
                padding: '12px 32px',
                backgroundColor: '#FFD700',
                color: '#000000',
                borderRadius: '12px',
                border: 'none',
                fontWeight: '500',
                marginLeft: 'auto',
                transition: 'background-color 0.2s',
                cursor: 'pointer'
              }}
              onMouseOver={(e) => e.target.style.backgroundColor = '#f7c600'}
              onMouseOut={(e) => e.target.style.backgroundColor = '#FFD700'}
            >
              Create Token
            </button>
          )}
        </div>

        {errors.submit && (
          <p style={{ color: '#ef4444', textAlign: 'center', marginTop: '16px' }}>{errors.submit}</p>
        )}
      </form>
    </Card>
  );
} 