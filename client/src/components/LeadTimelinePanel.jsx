import { useEffect, useState } from 'react';

function LeadTimelinePanel({ lead, onSuccess, darkMode }) {
  const [discussions, setDiscussions] = useState([]);
  const [note, setNote] = useState('');
  const [followUpAt, setFollowUpAt] = useState('');
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(lead.status);
  const [enableFollowUp, setEnableFollowUp] = useState(false);

  const statuses = [
    'New',
    'Contacted',
    'Qualified',
    'Proposal Sent',
    'Won',
    'Lost',
  ];

  useEffect(() => {
    fetchDiscussions();
  }, [lead.id]);

  const fetchDiscussions = async () => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/leads/${lead.id}/discussions`
      );
      const data = await response.json();
      setDiscussions(data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleStatusUpdate = async () => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/leads/${lead.id}`,
        {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ status }),
        }
      );

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
      const response = await fetch(
        `http://localhost:5000/api/leads/${lead.id}/discussions`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            note,
            follow_up_at: enableFollowUp && followUpAt ? followUpAt : null,
          }),
        }
      );

      if (!response.ok) throw new Error('Failed to save discussion');

      setNote('');
      setFollowUpAt('');
      setEnableFollowUp(false);

      await fetchDiscussions();
      await onSuccess();
    } catch (error) {
      console.error(error);
      alert('Error saving discussion');
    } finally {
      setLoading(false);
    }
  };

  const dateValue = followUpAt ? followUpAt.split('T')[0] : '';
  const timeValue = followUpAt ? followUpAt.split('T')[1] : '';

  const handleDateChange = (date) => {
    const time = timeValue || '09:00';
    setFollowUpAt(`${date}T${time}`);
  };

  const handleTimeChange = (time) => {
    const date = dateValue || new Date().toISOString().split('T')[0];
    setFollowUpAt(`${date}T${time}`);
  };

  return (
    <div
      style={{
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: darkMode ? '#0f172a' : '#f8fafc',
        color: darkMode ? 'white' : '#111827',
      }}
    >
      {/* TOP SCROLLABLE AREA */}
      <div
        style={{
          flex: 1,
          overflowY: 'auto',
          padding: '28px',
        }}
      >
        {/* HEADER BAND */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
            backgroundColor: darkMode ? '#1e293b' : '#f1f5f9',
            borderRadius: '16px',
            padding: '12px 16px',
            marginBottom: '24px',
            border: `1px solid ${darkMode ? '#334155' : '#e5e7eb'}`,
          }}
        >
          <div style={{ fontWeight: '600', fontSize: '16px' }}>
            {lead.name}
          </div>

          {lead.company && (
            <div
              style={{
                fontSize: '14px',
                color: darkMode ? '#94a3b8' : '#475569',
              }}
            >
              {lead.company}
            </div>
          )}

          {lead.phone && (
            <div
              style={{
                fontSize: '14px',
                color: darkMode ? '#94a3b8' : '#64748b',
              }}
            >
              📞 {lead.phone}
            </div>
          )}

          {/* Lead Status Dropdown */}
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            style={{
              marginLeft: 'auto',
              padding: '6px 12px',
              borderRadius: '12px',
              border: `1px solid ${
                darkMode ? '#334155' : '#d1d5db'
              }`,
              backgroundColor: darkMode ? '#1e293b' : 'white',
              color: darkMode ? 'white' : '#111827',
            }}
          >
            {statuses.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>

          <button
            onClick={handleStatusUpdate}
            style={{
              marginLeft: '8px',
              padding: '6px 12px',
              borderRadius: '12px',
              border: 'none',
              backgroundColor: '#2563eb',
              color: 'white',
              cursor: 'pointer',
              fontWeight: '600',
            }}
          >
            Update
          </button>
        </div>

        {/* DISCUSSION TIMELINE */}
        <h3
          style={{
            marginBottom: '20px',
            fontSize: '20px',
          }}
        >
          Discussion Timeline
        </h3>

        {discussions.length === 0 ? (
          <div
            style={{
              backgroundColor: darkMode ? '#1e293b' : 'white',
              padding: '24px',
              borderRadius: '20px',
              border: `1px solid ${
                darkMode ? '#334155' : '#e5e7eb'
              }`,
              color: darkMode ? '#94a3b8' : '#64748b',
            }}
          >
            No discussions yet.
          </div>
        ) : (
          discussions.map((discussion, index) => (
            <div
              key={discussion.id}
              style={{
                display: 'flex',
                gap: '16px',
                marginBottom: '22px',
              }}
            >
              {/* TIMELINE DOT */}
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                }}
              >
                <div
                  style={{
                    width: '12px',
                    height: '12px',
                    borderRadius: '50%',
                    backgroundColor: '#2563eb',
                  }}
                />

                {index !== discussions.length - 1 && (
                  <div
                    style={{
                      width: '2px',
                      flex: 1,
                      backgroundColor: darkMode
                        ? '#334155'
                        : '#cbd5e1',
                      minHeight: '60px',
                    }}
                  />
                )}
              </div>

              {/* CARD */}
              <div
                style={{
                  flex: 1,
                  backgroundColor: darkMode
                    ? '#111827'
                    : 'white',
                  border: `1px solid ${
                    darkMode ? '#334155' : '#e5e7eb'
                  }`,
                  borderRadius: '20px',
                  padding: '18px',
                  boxShadow: darkMode
                    ? '0 4px 16px rgba(0,0,0,0.25)'
                    : '0 4px 16px rgba(15,23,42,0.04)',
                  color: darkMode ? 'white' : '#111827',
                }}
              >
                <p
                  style={{
                    margin: '0 0 12px 0',
                    lineHeight: 1.7,
                  }}
                >
                  {discussion.note}
                </p>

                <p
                  style={{
                    margin: 0,
                    fontSize: '12px',
                    color: darkMode
                      ? '#94a3b8'
                      : '#64748b',
                  }}
                >
                  {new Date(
                    discussion.created_at
                  ).toLocaleString()}
                </p>
              </div>
            </div>
          ))
        )}
      </div>

      {/* FIXED BOTTOM ADD DISCUSSION */}
      <div
        style={{
          borderTop: `1px solid ${
            darkMode ? '#334155' : '#e5e7eb'
          }`,
          backgroundColor: darkMode ? '#111827' : 'white',
          padding: '22px',
          boxShadow: darkMode
            ? '0 -4px 20px rgba(0,0,0,0.25)'
            : '0 -4px 20px rgba(15,23,42,0.05)',
        }}
      >
        <h3
          style={{
            marginTop: 0,
            marginBottom: '16px',
          }}
        >
          Add Discussion
        </h3>

        <form onSubmit={handleSubmit}>
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Write discussion note..."
            rows="4"
            style={{
              width: '100%',
              padding: '14px',
              borderRadius: '16px',
              border: `1px solid ${
                darkMode ? '#334155' : '#d1d5db'
              }`,
              backgroundColor: darkMode
                ? '#1e293b'
                : 'white',
              color: darkMode ? 'white' : '#111827',
              marginBottom: '16px',
              resize: 'none',
              boxSizing: 'border-box',
              fontSize: '14px',
            }}
          />

          <div style={{ marginBottom: '16px' }}>
            <label
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                fontSize: '14px',
                color: darkMode ? 'white' : '#334155',
              }}
            >
              <input
                type="checkbox"
                checked={enableFollowUp}
                onChange={(e) =>
                  setEnableFollowUp(e.target.checked)
                }
              />
              Set Follow-up Reminder
            </label>
          </div>

          {enableFollowUp && (
            <div
              style={{
                display: 'flex',
                gap: '10px',
                marginBottom: '18px',
              }}
            >
              <input
                type="date"
                value={dateValue}
                onChange={(e) =>
                  handleDateChange(e.target.value)
                }
                style={{
                  padding: '12px',
                  borderRadius: '12px',
                  border: `1px solid ${
                    darkMode ? '#334155' : '#d1d5db'
                  }`,
                }}
              />

              <input
                type="time"
                value={timeValue}
                onChange={(e) =>
                  handleTimeChange(e.target.value)
                }
                style={{
                  padding: '12px',
                  borderRadius: '12px',
                  border: `1px solid ${
                    darkMode ? '#334155' : '#d1d5db'
                  }`,
                }}
              />
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              padding: '14px',
              borderRadius: '16px',
              border: 'none',
              background:
                'linear-gradient(135deg, #2563eb, #4f46e5)',
              color: 'white',
              cursor: 'pointer',
              fontWeight: '700',
              fontSize: '14px',
              boxShadow:
                '0 8px 20px rgba(37,99,235,0.25)',
            }}
          >
            {loading ? 'Saving...' : 'Save Discussion'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default LeadTimelinePanel;