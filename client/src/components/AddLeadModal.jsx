import { useState } from 'react';

function AddLeadModal({ onClose, onSuccess }) {
  const [name, setName] = useState('');
  const [company, setCompany] = useState('');
  const [phone, setPhone] = useState('');
  const [focusedField, setFocusedField] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) { alert('Name is required'); return; }

    await fetch('http://localhost:5000/api/leads', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, company, phone }),
    });

    onSuccess();
    onClose();
  };

  const inputStyle = (field) => ({
    width: '100%', padding: '12px 16px',
    borderRadius: '14px',
    border: `1.5px solid ${focusedField === field ? '#3b82f6' : '#e2e8f7'}`,
    fontSize: '14.5px', boxSizing: 'border-box',
    backgroundColor: focusedField === field ? '#f8fbff' : '#f8faff',
    color: '#0f172a', outline: 'none',
    transition: 'all 0.18s ease',
    boxShadow: focusedField === field ? '0 0 0 4px rgba(59,130,246,0.1)' : 'none',
  });

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0,
        backgroundColor: 'rgba(7,13,26,0.5)',
        display: 'flex', justifyContent: 'center', alignItems: 'center',
        zIndex: 1000, padding: '20px',
        backdropFilter: 'blur(4px)',
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          backgroundColor: 'white',
          borderRadius: '28px', padding: '32px',
          width: '100%', maxWidth: '480px',
          boxShadow: '0 24px 60px rgba(7,13,26,0.18)',
          border: '1px solid #e8eef8',
        }}
      >
        {/* Header */}
        <div style={{ marginBottom: '28px' }}>
          <div style={{
            width: '48px', height: '48px', borderRadius: '14px',
            background: 'linear-gradient(135deg, #dbeafe, #ede9fe)',
            display: 'flex', justifyContent: 'center', alignItems: 'center',
            fontSize: '22px', marginBottom: '16px',
          }}>
            👤
          </div>
          <h2 style={{
            margin: '0 0 6px', fontSize: '24px', fontWeight: '800',
            color: '#0f172a', fontFamily: "'Syne', sans-serif",
          }}>
            Add New Lead
          </h2>
          <p style={{ margin: 0, color: '#94a3b8', fontSize: '14px', lineHeight: '1.5' }}>
            Create a new lead to start tracking discussions and follow-ups.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          {[
            { label: 'Name', value: name, setter: setName, placeholder: 'Enter lead name', required: true, field: 'name' },
            { label: 'Company', value: company, setter: setCompany, placeholder: 'Enter company name', required: false, field: 'company' },
            { label: 'Phone', value: phone, setter: setPhone, placeholder: 'Enter phone number', required: false, field: 'phone' },
          ].map(({ label, value, setter, placeholder, required, field }) => (
            <div key={field} style={{ marginBottom: '20px' }}>
              <label style={{
                display: 'flex', alignItems: 'center', gap: '6px',
                marginBottom: '8px', fontWeight: '700',
                color: '#334155', fontSize: '13.5px',
              }}>
                {label}
                {required && (
                  <span style={{
                    fontSize: '10px', fontWeight: '700', color: '#2563eb',
                    backgroundColor: '#dbeafe', padding: '1px 6px', borderRadius: '9999px',
                  }}>required</span>
                )}
              </label>
              <input
                type="text"
                value={value}
                onChange={(e) => setter(e.target.value)}
                required={required}
                placeholder={placeholder}
                onFocus={() => setFocusedField(field)}
                onBlur={() => setFocusedField(null)}
                style={inputStyle(field)}
              />
            </div>
          ))}

          {/* Buttons */}
          <div style={{ display: 'flex', gap: '12px', marginTop: '28px' }}>
            <button
              type="button"
              onClick={onClose}
              style={{
                flex: 1, padding: '13px',
                borderRadius: '14px',
                border: '1.5px solid #e2e8f7',
                backgroundColor: '#f8faff',
                color: '#64748b', cursor: 'pointer',
                fontWeight: '600', fontSize: '14px',
                transition: 'all 0.18s',
              }}
              onMouseEnter={e => { e.target.style.borderColor = '#cbd5e1'; e.target.style.color = '#334155'; }}
              onMouseLeave={e => { e.target.style.borderColor = '#e2e8f7'; e.target.style.color = '#64748b'; }}
            >
              Cancel
            </button>

            <button
              type="submit"
              style={{
                flex: 2, padding: '13px',
                borderRadius: '14px', border: 'none',
                background: 'linear-gradient(135deg, #2563eb, #4f46e5)',
                color: 'white', cursor: 'pointer',
                fontWeight: '700', fontSize: '14px',
                boxShadow: '0 8px 20px rgba(37,99,235,0.28)',
                transition: 'all 0.18s',
              }}
              onMouseEnter={e => { e.target.style.transform = 'translateY(-1px)'; e.target.style.boxShadow = '0 12px 28px rgba(37,99,235,0.38)'; }}
              onMouseLeave={e => { e.target.style.transform = 'none'; e.target.style.boxShadow = '0 8px 20px rgba(37,99,235,0.28)'; }}
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
