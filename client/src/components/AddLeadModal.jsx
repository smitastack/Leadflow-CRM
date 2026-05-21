import { useState } from 'react';

function AddLeadModal({ onClose, onSuccess }) {
  const [name, setName] = useState('');
  const [company, setCompany] = useState('');
  const [phone, setPhone] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name.trim()) {
      alert('Name is required');
      return;
    }

    await fetch('http://localhost:5000/api/leads', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },

      body: JSON.stringify({
        name,
        company,
        phone,
      }),
    });

    onSuccess();
    onClose();
  };

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(15, 23, 42, 0.45)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1000,
        padding: '20px',
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          backgroundColor: 'white',
          borderRadius: '24px',
          padding: '28px',
          width: '100%',
          maxWidth: '520px',
          boxShadow: '0 20px 50px rgba(0,0,0,0.15)',
        }}
      >
        {/* Header */}
        <div
          style={{
            marginBottom: '28px',
            textAlign: 'center',
          }}
        >
          <h2
            style={{
              margin: 0,
              fontSize: '38px',
              fontWeight: '700',
              color: '#0f172a',
              marginBottom: '10px',
            }}
          >
            Add New Lead
          </h2>

          <p
            style={{
              margin: 0,
              color: '#64748b',
              fontSize: '17px',
              lineHeight: '1.5',
            }}
          >
            Create a new lead to start tracking discussions
            and follow-ups.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          {/* Name */}
          <div style={{ marginBottom: '22px' }}>
            <label
              style={{
                display: 'block',
                marginBottom: '10px',
                fontWeight: '700',
                color: '#334155',
                fontSize: '15px',
              }}
            >
              Name *
            </label>

            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              placeholder="Enter lead name"
              style={{
                width: '100%',
                padding: '14px 16px',
                borderRadius: '14px',
                border: '1px solid #d1d5db',
                fontSize: '15px',
                boxSizing: 'border-box',
                backgroundColor: 'white',
                color: '#000000',
                outline: 'none',
              }}
            />
          </div>

          {/* Company */}
          <div style={{ marginBottom: '22px' }}>
            <label
              style={{
                display: 'block',
                marginBottom: '10px',
                fontWeight: '700',
                color: '#334155',
                fontSize: '15px',
              }}
            >
              Company
            </label>

            <input
              type="text"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              placeholder="Enter company name"
              style={{
                width: '100%',
                padding: '14px 16px',
                borderRadius: '14px',
                border: '1px solid #d1d5db',
                fontSize: '15px',
                boxSizing: 'border-box',
                backgroundColor: 'white',
                color: '#000000',
                outline: 'none',
              }}
            />
          </div>

          {/* Phone */}
          <div style={{ marginBottom: '22px' }}>
            <label
              style={{
                display: 'block',
                marginBottom: '10px',
                fontWeight: '700',
                color: '#334155',
                fontSize: '15px',
              }}
            >
              Phone
            </label>

            <input
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="Enter phone number"
              style={{
                width: '100%',
                padding: '14px 16px',
                borderRadius: '14px',
                border: '1px solid #d1d5db',
                fontSize: '15px',
                boxSizing: 'border-box',
                backgroundColor: 'white',
                color: '#000000',
                outline: 'none',
              }}
            />
          </div>

          {/* Buttons */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'flex-end',
              gap: '14px',
            }}
          >
            <button
              type="button"
              onClick={onClose}
              style={{
                padding: '14px 22px',
                borderRadius: '14px',
                border: '1px solid #d1d5db',
                backgroundColor: 'white',
                color: '#374151',
                cursor: 'pointer',
                fontWeight: '600',
                fontSize: '15px',
              }}
            >
              Cancel
            </button>

            <button
              type="submit"
              style={{
                padding: '14px 24px',
                borderRadius: '14px',
                border: 'none',
                backgroundColor: '#4f46e5',
                color: 'white',
                cursor: 'pointer',
                fontWeight: '700',
                fontSize: '15px',
                boxShadow:
                  '0 10px 20px rgba(79, 70, 229, 0.25)',
              }}
            >
              Save Lead
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddLeadModal;