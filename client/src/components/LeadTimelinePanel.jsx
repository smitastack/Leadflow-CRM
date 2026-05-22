import { useEffect, useState } from 'react';

function LeadTimelinePanel({ lead, onSuccess, darkMode }) {
  const [discussions, setDiscussions] = useState([]);
  const [note, setNote] = useState('');
  const [followUpAt, setFollowUpAt] = useState('');
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(lead.status);
  const [enableFollowUp, setEnableFollowUp] = useState(false);

  const statuses = ['New', 'Contacted', 'Qualified', 'Proposal Sent', 'Won', 'Lost'];

  useEffect(() => { fetchDiscussions(); }, [lead.id]);

  const fetchDiscussions = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/leads/${lead.id}/discussions`);
      const data = await response.json();
      setDiscussions(data);
    } catch (error) { console.error(error); }
  };

  const handleStatusUpdate = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/leads/${lead.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      if (!response.ok) throw new Error('Failed to update status');
      await onSuccess();
      alert('Status updated successfully');
    } catch (error) {
      console.error(error);
      alert('Error updating status');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!note.trim()) return alert('Discussion note is required');
    try {
      setLoading(true);
      const response = await fetch(`http://localhost:5000/api/leads/${lead.id}/discussions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          note,
          follow_up_at: enableFollowUp && followUpAt ? followUpAt : null,
        }),
      });
      if (!response.ok) throw new Error('Failed to save discussion');
      setNote(''); setFollowUpAt(''); setEnableFollowUp(false);
      await fetchDiscussions();
      await onSuccess();
    } catch (error) {
      console.error(error);
      alert('Error saving discussion');
    } finally { setLoading(false); }
  };

  const dateValue = followUpAt ? followUpAt.split('T')[0] : '';
  const timeValue = followUpAt ? followUpAt.split('T')[1] : '';
  const handleDateChange = (date) => setFollowUpAt(`${date}T${timeValue || '09:00'}`);
  const handleTimeChange = (time) => setFollowUpAt(`${dateValue || new Date().toISOString().split('T')[0]}T${time}`);

  const d = darkMode;

  const getStatusColor = (s) => {
    const map = {
      'New': '#64748b', 'Contacted': '#2563eb', 'Qualified': '#7c3aed',
      'Proposal Sent': '#ea580c', 'Won': '#16a34a', 'Lost': '#dc2626',
    };
    return map[s] || '#64748b';
  };

  const initials = lead.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);

  return (
    <div style={{
      height: '100vh', display: 'flex', flexDirection: 'column',
      backgroundColor: d ? '#070d1a' : '#f0f4ff',
      fontFamily: "'DM Sans', 'Segoe UI', sans-serif",
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Syne:wght@700;800&display=swap');
        .discussion-card { transition: box-shadow 0.2s; }
        .discussion-card:hover { box-shadow: 0 6px 24px rgba(37,99,235,0.1) !important; }
        .update-btn:hover { background: #1d4ed8 !important; }
        .update-btn { transition: background 0.2s; }
        .save-btn:hover { transform: translateY(-1px); box-shadow: 0 12px 28px rgba(37,99,235,0.38) !important; }
        .save-btn { transition: all 0.2s; }
        .textarea-focus:focus { border-color: #3b82f6 !important; outline: none; }
      `}</style>

      {/* ── TOP SCROLLABLE AREA ── */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '28px 32px' }}>

        {/* HEADER BAND */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: '14px',
          backgroundColor: d ? '#0d1526' : '#ffffff',
          borderRadius: '20px', padding: '16px 20px',
          marginBottom: '28px',
          border: `1px solid ${d ? '#1a2540' : '#e2e8f7'}`,
          boxShadow: d ? '0 4px 20px rgba(0,0,0,0.2)' : '0 4px 20px rgba(37,99,235,0.06)',
        }}>
          {/* Avatar */}
          <div style={{
            width: '44px', height: '44px', borderRadius: '14px', flexShrink: 0,
            background: 'linear-gradient(135deg, #dbeafe, #ede9fe)',
            display: 'flex', justifyContent: 'center', alignItems: 'center',
            fontSize: '14px', fontWeight: '800', color: '#4f46e5',
            fontFamily: "'Syne', sans-serif",
          }}>
            {initials}
          </div>

          {/* Name + Company */}
          <div style={{ flex: 1 }}>
            <div style={{
              fontWeight: '700', fontSize: '16px',
              color: d ? '#f1f5f9' : '#0f172a',
              fontFamily: "'Syne', sans-serif",
            }}>
              {lead.name}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: '2px' }}>
              {lead.company && (
                <span style={{ fontSize: '12.5px', color: d ? '#64748b' : '#94a3b8', fontWeight: '500' }}>
                  {lead.company}
                </span>
              )}
              {lead.phone && (
                <span style={{
                  fontSize: '12.5px', color: d ? '#64748b' : '#94a3b8',
                  display: 'flex', alignItems: 'center', gap: '4px',
                }}>
                  📞 {lead.phone}
                </span>
              )}
            </div>
          </div>

          {/* Status dropdown + Update */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              style={{
                padding: '8px 12px',
                borderRadius: '12px',
                border: `1.5px solid ${d ? '#1e2d45' : '#e2e8f7'}`,
                backgroundColor: d ? '#111e34' : '#f8faff',
                color: getStatusColor(status),
                fontWeight: '700', fontSize: '13px',
                cursor: 'pointer', outline: 'none',
              }}
            >
              {statuses.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>

            <button
              className="update-btn"
              onClick={handleStatusUpdate}
              style={{
                padding: '8px 18px', borderRadius: '12px', border: 'none',
                backgroundColor: '#2563eb', color: 'white',
                cursor: 'pointer', fontWeight: '700', fontSize: '13px',
                boxShadow: '0 4px 12px rgba(37,99,235,0.25)',
              }}
            >
              Update
            </button>
          </div>
        </div>

        {/* TIMELINE HEADER */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '24px',
        }}>
          <h3 style={{
            margin: 0, fontSize: '18px', fontWeight: '800',
            color: d ? '#f1f5f9' : '#0f172a',
            fontFamily: "'Syne', sans-serif",
          }}>
            Discussion Timeline
          </h3>
          <div style={{
            backgroundColor: d ? '#1a2540' : '#e8eef8',
            color: d ? '#64748b' : '#94a3b8',
            padding: '2px 10px', borderRadius: '9999px',
            fontSize: '12px', fontWeight: '700',
          }}>
            {discussions.length}
          </div>
        </div>

        {/* TIMELINE */}
        {discussions.length === 0 ? (
          <div style={{
            backgroundColor: d ? '#0d1526' : '#ffffff',
            padding: '32px', borderRadius: '20px',
            border: `1px solid ${d ? '#1a2540' : '#e2e8f7'}`,
            textAlign: 'center',
          }}>
            <div style={{ fontSize: '32px', marginBottom: '12px' }}>💬</div>
            <p style={{ margin: 0, color: d ? '#475569' : '#94a3b8', fontSize: '14px' }}>
              No discussions yet. Add the first one below!
            </p>
          </div>
        ) : (
          discussions.map((discussion, index) => (
            <div key={discussion.id} style={{ display: 'flex', gap: '16px', marginBottom: '20px' }}>
              {/* DOT + LINE */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: '6px' }}>
                <div style={{
                  width: '14px', height: '14px', borderRadius: '50%',
                  backgroundColor: '#2563eb',
                  border: '2.5px solid white',
                  boxShadow: '0 0 0 3px rgba(37,99,235,0.18)',
                  flexShrink: 0,
                }} />
                {index !== discussions.length - 1 && (
                  <div style={{
                    width: '2px', flex: 1,
                    background: d
                      ? 'linear-gradient(#1a2540, transparent)'
                      : 'linear-gradient(#cbd5e1, transparent)',
                    minHeight: '50px', marginTop: '4px',
                  }} />
                )}
              </div>

              {/* CARD */}
              <div
                className="discussion-card"
                style={{
                  flex: 1,
                  backgroundColor: d ? '#0d1526' : '#ffffff',
                  border: `1px solid ${d ? '#1a2540' : '#e8eef8'}`,
                  borderRadius: '18px', padding: '16px 20px',
                  boxShadow: d
                    ? '0 4px 16px rgba(0,0,0,0.2)'
                    : '0 2px 12px rgba(15,23,42,0.05)',
                }}
              >
                <p style={{
                  margin: '0 0 10px', lineHeight: 1.7, fontSize: '14px',
                  color: d ? '#e2e8f0' : '#334155',
                }}>
                  {discussion.note}
                </p>
                <div style={{
                  display: 'flex', alignItems: 'center', gap: '6px',
                  paddingTop: '10px', borderTop: `1px solid ${d ? '#1a2540' : '#f1f5f9'}`,
                }}>
                  <div style={{
                    width: '6px', height: '6px', borderRadius: '50%',
                    backgroundColor: '#3b82f6', flexShrink: 0,
                  }} />
                  <span style={{
                    fontSize: '11.5px', color: d ? '#475569' : '#94a3b8', fontWeight: '500',
                  }}>
                    {new Date(discussion.created_at).toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* ── FIXED BOTTOM ADD DISCUSSION ── */}
      <div style={{
        borderTop: `1px solid ${d ? '#1a2540' : '#e2e8f7'}`,
        backgroundColor: d ? '#0d1526' : '#ffffff',
        padding: '20px 32px',
        boxShadow: d
          ? '0 -8px 24px rgba(0,0,0,0.25)'
          : '0 -8px 24px rgba(37,99,235,0.06)',
      }}>
        <div style={{
          display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px',
        }}>
          <h3 style={{
            margin: 0, fontSize: '15px', fontWeight: '800',
            color: d ? '#f1f5f9' : '#0f172a',
            fontFamily: "'Syne', sans-serif",
          }}>
            Add Discussion
          </h3>
        </div>

        <form onSubmit={handleSubmit}>
          <textarea
            className="textarea-focus"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Write a discussion note..."
            rows="3"
            style={{
              width: '100%', padding: '14px 16px',
              borderRadius: '16px',
              border: `1.5px solid ${d ? '#1e2d45' : '#e2e8f7'}`,
              backgroundColor: d ? '#111e34' : '#f8faff',
              color: d ? '#e2e8f0' : '#1e293b',
              marginBottom: '14px', resize: 'none',
              boxSizing: 'border-box', fontSize: '14px',
              lineHeight: '1.6', transition: 'border-color 0.2s',
            }}
          />

          {/* Follow-up checkbox */}
          <div style={{ marginBottom: enableFollowUp ? '14px' : '16px' }}>
            <label style={{
              display: 'flex', alignItems: 'center', gap: '10px',
              cursor: 'pointer', userSelect: 'none',
            }}>
              {/* Custom checkbox */}
              <div
                onClick={() => setEnableFollowUp(!enableFollowUp)}
                style={{
                  width: '20px', height: '20px', borderRadius: '6px',
                  border: `2px solid ${enableFollowUp ? '#2563eb' : d ? '#334155' : '#d1d5db'}`,
                  backgroundColor: enableFollowUp ? '#2563eb' : 'transparent',
                  display: 'flex', justifyContent: 'center', alignItems: 'center',
                  cursor: 'pointer', transition: 'all 0.15s', flexShrink: 0,
                }}
              >
                {enableFollowUp && (
                  <svg width="11" height="9" viewBox="0 0 11 9" fill="none">
                    <path d="M1 4L4 7.5L10 1" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                )}
              </div>
              <span style={{
                fontSize: '13.5px', fontWeight: '600',
                color: d ? '#94a3b8' : '#475569',
              }}>
                Set Follow-up Reminder
              </span>
            </label>
          </div>

          {enableFollowUp && (
            <div style={{
              display: 'flex', gap: '10px', marginBottom: '16px',
              padding: '14px', borderRadius: '14px',
              backgroundColor: d ? '#111e34' : '#f0f4ff',
              border: `1px solid ${d ? '#1e2d45' : '#dbeafe'}`,
            }}>
              <div style={{ flex: 1 }}>
                <label style={{
                  display: 'block', fontSize: '11px', fontWeight: '700',
                  color: d ? '#64748b' : '#94a3b8', marginBottom: '6px',
                  textTransform: 'uppercase', letterSpacing: '0.5px',
                }}>Date</label>
                <input
                  type="date"
                  value={dateValue}
                  onChange={(e) => handleDateChange(e.target.value)}
                  style={{
                    width: '100%', padding: '9px 12px',
                    borderRadius: '10px',
                    border: `1.5px solid ${d ? '#1e2d45' : '#e2e8f7'}`,
                    backgroundColor: d ? '#0d1526' : '#ffffff',
                    color: d ? '#e2e8f0' : '#1e293b',
                    fontSize: '13px', outline: 'none',
                  }}
                />
              </div>
              <div style={{ flex: 1 }}>
                <label style={{
                  display: 'block', fontSize: '11px', fontWeight: '700',
                  color: d ? '#64748b' : '#94a3b8', marginBottom: '6px',
                  textTransform: 'uppercase', letterSpacing: '0.5px',
                }}>Time</label>
                <input
                  type="time"
                  value={timeValue}
                  onChange={(e) => handleTimeChange(e.target.value)}
                  style={{
                    width: '100%', padding: '9px 12px',
                    borderRadius: '10px',
                    border: `1.5px solid ${d ? '#1e2d45' : '#e2e8f7'}`,
                    backgroundColor: d ? '#0d1526' : '#ffffff',
                    color: d ? '#e2e8f0' : '#1e293b',
                    fontSize: '13px', outline: 'none',
                  }}
                />
              </div>
            </div>
          )}

          <button
            type="submit"
            className="save-btn"
            disabled={loading}
            style={{
              width: '100%', padding: '13px',
              borderRadius: '14px', border: 'none',
              background: loading
                ? '#94a3b8'
                : 'linear-gradient(135deg, #2563eb, #4f46e5)',
              color: 'white', cursor: loading ? 'not-allowed' : 'pointer',
              fontWeight: '700', fontSize: '14px',
              boxShadow: loading ? 'none' : '0 8px 20px rgba(37,99,235,0.25)',
              letterSpacing: '0.2px',
            }}
          >
            {loading ? '⏳ Saving...' : '💾 Save Discussion'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default LeadTimelinePanel;
