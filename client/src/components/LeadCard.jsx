import { useState } from 'react';

function LeadCard({ lead, onClick }) {
  const [isHovered, setIsHovered] = useState(false);

  const now = new Date();
  const followUpTime = lead.follow_up_at
    ? new Date(lead.follow_up_at)
    : null;

  // Follow-up is today ONLY if:
  // - same date
  // - time has NOT passed yet
  const isToday =
    followUpTime &&
    followUpTime.toDateString() === now.toDateString() &&
    followUpTime > now &&
    lead.status !== 'Won' &&
    lead.status !== 'Lost';

  // Overdue if:
  // - follow-up time has passed
  // - not Won/Lost
  const isOverdue =
    followUpTime &&
    followUpTime < now &&
    lead.status !== 'Won' &&
    lead.status !== 'Lost';

  const getStatusStyle = (status) => {
    switch (status) {
      case 'New':
        return { backgroundColor: '#e5e7eb', color: '#111111' };

      case 'Contacted':
        return { backgroundColor: '#dbeafe', color: '#1d4ed8' };

      case 'Qualified':
        return { backgroundColor: '#ede9fe', color: '#7c3aed' };

      case 'Proposal Sent':
        return { backgroundColor: '#fed7aa', color: '#ea580c' };

      case 'Won':
        return { backgroundColor: '#dcfce7', color: '#16a34a' };

      case 'Lost':
        return { backgroundColor: '#fee2e2', color: '#dc2626' };

      default:
        return {
          backgroundColor: '#f3f4f6',
          color: '#111111',
        };
    }
  };

  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        border: isOverdue
          ? '1px solid #dc2626'
          : isHovered
          ? '1px solid #2563eb'
          : '1px solid #e5e7eb',

        borderRadius: '12px',
        padding: '12px',

        backgroundColor: isOverdue
          ? '#fef2f2'
          : 'white',

        boxShadow: isHovered
          ? '0 6px 16px rgba(37, 99, 235, 0.12)'
          : '0 1px 2px rgba(0,0,0,0.05)',

        cursor: 'pointer',
        transition: 'all 0.2s ease',
        marginBottom: '10px',
      }}
    >
      {/* TOP SECTION */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          gap: '8px',
          marginBottom: '8px',
        }}
      >
        <div style={{ flex: 1 }}>
          <h3
            style={{
              margin: 0,
              color: '#111827',
              fontSize: '15px',
              fontWeight: '700',
            }}
          >
            {lead.name}
          </h3>

          <p
            style={{
              margin: '4px 0 0 0',
              color: '#6b7280',
              fontSize: '12px',
            }}
          >
            {lead.company || 'No company'}
          </p>
        </div>

        <span
          style={{
            ...getStatusStyle(lead.status),
            padding: '4px 8px',
            borderRadius: '9999px',
            fontSize: '10px',
            fontWeight: '700',
          }}
        >
          {lead.status}
        </span>
      </div>

      {/* FOLLOW-UP BADGES */}
      {isOverdue && (
        <div
          style={{
            display: 'inline-block',
            backgroundColor: '#dc2626',
            color: 'white',
            padding: '4px 8px',
            borderRadius: '9999px',
            fontSize: '10px',
            fontWeight: '600',
            marginBottom: '6px',
          }}
        >
          ⚠ Overdue Follow-up
        </div>
      )}

      {!isOverdue && isToday && (
        <div
          style={{
            display: 'inline-block',
            backgroundColor: '#2563eb',
            color: 'white',
            padding: '4px 8px',
            borderRadius: '9999px',
            fontSize: '10px',
            fontWeight: '600',
            marginBottom: '6px',
          }}
        >
          📅 Follow-up Today
        </div>
      )}

      {/* DISCUSSION */}
      <p
        style={{
          margin: '0 0 6px 0',
          color: '#374151',
          fontSize: '12px',
          lineHeight: '1.4',
        }}
      >
        {lead.last_discussion || 'No discussions yet'}
      </p>

      {/* TIME */}
      <p
        style={{
          margin: 0,
          fontSize: '10px',
          color: '#9ca3af',
        }}
      >
        {lead.last_discussion_time
          ? new Date(
              lead.last_discussion_time
            ).toLocaleString()
          : 'Never'}
      </p>
    </div>
  );
}

export default LeadCard;