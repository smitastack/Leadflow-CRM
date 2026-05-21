import { useEffect, useState } from 'react';

function LeadTimelineModal({ lead, onClose, onSuccess }) {
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
      console.error('Error fetching discussions:', error);
    }
  };

  const handleStatusUpdate = async () => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/leads/${lead.id}`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            status,
          }),
        }
      );

      if (!response.ok) {
        throw new Error('Failed to update status');
      }

      await onSuccess();
      alert('Status updated successfully');
    } catch (error) {
      console.error(error);
      alert('Error updating status');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!note.trim()) {
      alert('Discussion note is required');
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(
        `http://localhost:5000/api/leads/${lead.id}/discussions`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            note,
            follow_up_at:
              enableFollowUp && followUpAt ? followUpAt : null,
          }),
        }
      );

      if (!response.ok) {
        throw new Error('Failed to save discussion');
      }

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

  const dateValue = followUpAt
    ? followUpAt.split('T')[0]
    : '';

  const timeValue = followUpAt
    ? followUpAt.split('T')[1]
    : '';

  const handleDateChange = (date) => {
    const time = timeValue || '09:00';
    setFollowUpAt(`${date}T${time}`);
  };

  const handleTimeChange = (time) => {
    const date =
      dateValue ||
      new Date().toISOString().split('T')[0];
    setFollowUpAt(`${date}T${time}`);
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
          borderRadius: '20px',
          width: '100%',
          maxWidth: '620px',
          maxHeight: '78vh',
          overflowY: 'auto',
          boxShadow: '0 20px 50px rgba(0,0,0,0.15)',
          padding: '20px',
        }}
      >
        {/* Header */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            marginBottom: '18px',
          }}
        >
          <div>
            <h2
              style={{
                margin: 0,
                fontSize: '22px',
                fontWeight: '700',
                color: '#000000',
              }}
            >
              {lead.name}
            </h2>

            <p
              style={{
                margin: '6px 0 4px 0',
                color: '#000000',
                fontSize: '14px',
              }}
            >
              {lead.company || 'No company'}
            </p>

            {lead.phone && (
              <p
                style={{
                  margin: 0,
                  color: '#000000',
                  fontSize: '13px',
                }}
              >
                📞 {lead.phone}
              </p>
            )}
          </div>

          <button
            onClick={onClose}
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '50%',
              border: '1px solid #d1d5db',
              backgroundColor: 'white',
              fontSize: '18px',
              cursor: 'pointer',
              color: '#000000',
            }}
          >
            ×
          </button>
        </div>

        {/* Status Section */}
        <div
          style={{
            backgroundColor: '#f8fafc',
            border: '1px solid #e2e8f0',
            borderRadius: '14px',
            padding: '16px',
            marginBottom: '20px',
          }}
        >
          <label
            style={{
              display: 'block',
              marginBottom: '8px',
              fontWeight: '600',
              color: '#000000',
              fontSize: '14px',
            }}
          >
            Lead Status
          </label>

          <div
            style={{
              display: 'flex',
              gap: '10px',
              alignItems: 'center',
              flexWrap: 'wrap',
            }}
          >
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              style={{
                flex: 1,
                minWidth: '220px',
                padding: '10px 12px',
                borderRadius: '10px',
                border: '1px solid #d1d5db',
                fontSize: '14px',
                color: '#000000',
                backgroundColor: 'white',
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
                padding: '10px 18px',
                borderRadius: '10px',
                border: 'none',
                backgroundColor: '#2563eb',
                color: 'white',
                cursor: 'pointer',
                fontWeight: '600',
                boxShadow:
                  '0 4px 12px rgba(37, 99, 235, 0.25)',
              }}
            >
              Update Status
            </button>
          </div>
        </div>

        {/* Discussion Timeline */}
        <div style={{ marginBottom: '20px' }}>
          <h3
            style={{
              marginTop: 0,
              marginBottom: '16px',
              fontSize: '18px',
              color: '#000000',
            }}
          >
            Discussion Timeline
          </h3>

          {discussions.length === 0 ? (
            <div
              style={{
                backgroundColor: '#ffffff',
                padding: '16px',
                borderRadius: '12px',
                border: '1px solid #e5e7eb',
                color: '#000000',
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
                  gap: '12px',
                  marginBottom:
                    index === discussions.length - 1
                      ? '0'
                      : '14px',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    flexShrink: 0,
                  }}
                >
                  <div
                    style={{
                      width: '10px',
                      height: '10px',
                      borderRadius: '50%',
                      backgroundColor: '#2563eb',
                      marginTop: '6px',
                    }}
                  />

                  {index !== discussions.length - 1 && (
                    <div
                      style={{
                        width: '2px',
                        flex: 1,
                        backgroundColor: '#d1d5db',
                        marginTop: '4px',
                        minHeight: '35px',
                      }}
                    />
                  )}
                </div>

                <div
                  style={{
                    flex: 1,
                    backgroundColor: '#ffffff',
                    border: '1px solid #e5e7eb',
                    padding: '14px',
                    borderRadius: '14px',
                    boxShadow:
                      '0 2px 8px rgba(0,0,0,0.04)',
                  }}
                >
                  <p
                    style={{
                      margin: '0 0 8px 0',
                      color: '#000000',
                      lineHeight: '1.5',
                      fontSize: '14px',
                    }}
                  >
                    {discussion.note}
                  </p>

                  <p
                    style={{
                      margin: 0,
                      fontSize: '12px',
                      color: '#6b7280',
                    }}
                  >
                    {new Date(
                      discussion.created_at
                    ).toLocaleString()}
                  </p>

                  {discussion.follow_up_at && (
                    <div
                      style={{
                        display: 'inline-block',
                        marginTop: '10px',
                        padding: '6px 10px',
                        borderRadius: '9999px',
                        backgroundColor: '#dbeafe',
                        color: '#1d4ed8',
                        fontSize: '12px',
                        fontWeight: '600',
                      }}
                    >
                      📅 Follow-up:{' '}
                      {new Date(
                        discussion.follow_up_at
                      ).toLocaleString()}
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Add Discussion */}
        <div>
          <h3
            style={{
              marginTop: 0,
              marginBottom: '16px',
              fontSize: '18px',
              color: '#000000',
            }}
          >
            Add Discussion
          </h3>

          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '16px' }}>
              <label
                style={{
                  display: 'block',
                  marginBottom: '8px',
                  fontWeight: '600',
                  color: '#000000',
                  fontSize: '14px',
                }}
              >
                Discussion Note
              </label>

              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Discussed requirements and pricing..."
                rows="4"
                style={{
                  width: '100%',
                  padding: '14px 16px',
                  borderRadius: '12px',
                  border: '1px solid #d1d5db',
                  fontSize: '14px',
                  resize: 'vertical',
                  boxSizing: 'border-box',
                  color: '#000000',
                  backgroundColor: '#ffffff',
                  minHeight: '110px',
                  outline: 'none',
                }}
              />
            </div>

            <div style={{ marginBottom: '16px' }}>
              <label
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  fontWeight: '600',
                  color: '#000000',
                  cursor: 'pointer',
                  fontSize: '14px',
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
                  display: 'grid',
                  gridTemplateColumns:
                    'repeat(auto-fit, minmax(180px, 1fr))',
                  gap: '10px',
                  marginBottom: '20px',
                }}
              >
                <input
                  type="date"
                  value={dateValue}
                  onChange={(e) =>
                    handleDateChange(e.target.value)
                  }
                  style={{
                    padding: '12px 14px',
                    borderRadius: '10px',
                    border: '1px solid #d1d5db',
                    fontSize: '14px',
                    color: '#000000',
                    backgroundColor: '#ffffff',
                    colorScheme: 'light',
                  }}
                />

                <input
                  type="time"
                  value={timeValue}
                  onChange={(e) =>
                    handleTimeChange(e.target.value)
                  }
                  style={{
                    padding: '10px 12px',
                    borderRadius: '10px',
                    border: '1px solid #d1d5db',
                    fontSize: '14px',
                    color: '#000000',
                    backgroundColor: '#ffffff',
                    colorScheme: 'light',
                  }}
                />
              </div>
            )}

            <div
              style={{
                display: 'flex',
                justifyContent: 'flex-end',
                gap: '10px',
              }}
            >
              <button
                type="button"
                onClick={onClose}
                style={{
                  padding: '10px 16px',
                  borderRadius: '10px',
                  border: '1px solid #d1d5db',
                  backgroundColor: 'white',
                  color: '#000000',
                  cursor: 'pointer',
                  fontWeight: '600',
                }}
              >
                Close
              </button>

              <button
                type="submit"
                disabled={loading}
                style={{
                  padding: '10px 18px',
                  borderRadius: '10px',
                  border: 'none',
                  backgroundColor: '#111827',
                  color: 'white',
                  cursor: 'pointer',
                  fontWeight: '600',
                  boxShadow:
                    '0 4px 12px rgba(17, 24, 39, 0.2)',
                  opacity: loading ? 0.7 : 1,
                }}
              >
                {loading ? 'Saving...' : 'Save Note'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default LeadTimelineModal;