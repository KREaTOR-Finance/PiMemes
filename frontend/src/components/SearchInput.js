import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";

export default function SearchInput({ value, onChange, placeholder }) {
  return (
    <div style={{
      position: 'relative',
      width: '100%'
    }}>
      <div style={{
        position: 'absolute',
        left: '16px',
        top: '50%',
        transform: 'translateY(-50%)',
        color: '#9ca3af'
      }}>
        <MagnifyingGlassIcon style={{ width: '20px', height: '20px' }} />
      </div>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        style={{
          width: '100%',
          backgroundColor: 'rgba(0, 0, 0, 0.4)',
          border: '1px solid rgba(106, 13, 173, 0.3)',
          borderRadius: '12px',
          padding: '12px 16px 12px 48px',
          color: '#FFD700',
          fontSize: '16px',
          outline: 'none',
          transition: 'all 0.2s'
        }}
        onFocus={(e) => {
          e.target.style.backgroundColor = 'rgba(0, 0, 0, 0.6)';
          e.target.style.borderColor = 'rgba(106, 13, 173, 0.5)';
        }}
        onBlur={(e) => {
          e.target.style.backgroundColor = 'rgba(0, 0, 0, 0.4)';
          e.target.style.borderColor = 'rgba(106, 13, 173, 0.3)';
        }}
      />
    </div>
  );
} 