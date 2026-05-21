import { useState } from 'react';

function LeadCard({ lead, onClick }) {
  const [isHovered, setIsHovered] = useState(false);

  // CHECK OVERDUE FOLLOW-UP
  const isOverdue =
    lead.follow_up_at &&
    new Date(lead.follow_up_at).getTime() < Date.now() &&
    lead.status !== 'Won' &&
    lead.status !== 'Lost';

  // CHECK IF FOLLOW-UP IS TODAY
  const isToday =
    lead.follow_up_at &&
    new Date(lead.follow_up_at).toDateString() ===
      new Date().toDateString();

  const getStatusStyle = (status) => {
    switch (status) {
      case 'New':
        return {
          backgroundColor: '#e5e7eb',
          color: '#111111',
        };

      case 'Contacted':
        return {
          backgroundColor: '#dbeafe',
          color: '#1d4ed8',
        };

      case 'Qualified':
        return {
          backgroundColor: '#ede9fe',
          color: '#7c3aed',
        };

      case 'Proposal Sent':
        return {
          backgroundColor: '#fed7aa',
          color: '#ea580c',
        };

      case 'Won':
        return {
          backgroundColor: '#dcfce7',
          color: '#16a34a',
        };

      case 'Lost':
        return {
          backgroundColor: '#fee2e2',
          color: '#dc2626',
        };

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
          : '1px solid #ddd',
        borderRadius: '12px',
        padding: '16px',
        marginBottom: '12px',
        backgroundColor: isOverdue
          ? '#fef2f2'
          : 'white',
        boxShadow: isHovered
          ? '0 12px 24px rgba(37, 99, 235, 0.15)'
          : '0 2px 6px rgba(0,0,0,0.05)',
        cursor: 'pointer',
        transform: isHovered
          ? 'translateY(-3px)'
          : 'translateY(0)',
        transition: 'all 0.2s ease',
      }}
    >
      {/* Top Row: Name + Status Badge */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '8px',
        }}
      >
        <h3
          style={{
            margin: 0,
            color: '#000000',
          }}
        >
          {lead.name}
        </h3>

        <span
          style={{
            ...getStatusStyle(lead.status),
            padding: '4px 10px',
            borderRadius: '20px',
            fontSize: '12px',
            fontWeight: 'bold',
          }}
        >
          {lead.status}
        </span>
      </div>

      {/* Company */}
      <p
        style={{
          margin: '0 0 8px 0',
          color: '#000000',
        }}
      >
        {lead.company || 'No company'}
      </p>

      {/* OVERDUE BADGE */}
      {isOverdue && (
        <div
          style={{
            display: 'inline-block',
            backgroundColor: '#dc2626',
            color: 'white',
            padding: '5px 10px',
            borderRadius: '9999px',
            fontSize: '12px',
            fontWeight: '600',
            marginBottom: '10px',
          }}
        >
          ⚠ Overdue Follow-up
        </div>
      )}

      {/* TODAY FOLLOW-UP BADGE */}
      {!isOverdue && isToday && (
        <div
          style={{
            display: 'inline-block',
            backgroundColor: '#2563eb',
            color: 'white',
            padding: '5px 10px',
            borderRadius: '9999px',
            fontSize: '12px',
            fontWeight: '600',
            marginBottom: '10px',
          }}
        >
          📅 Follow-up Today
        </div>
      )}

      {/* Last Discussion */}
      <p
        style={{
          margin: '0 0 4px 0',
          color: '#000000',
          lineHeight: '1.5',
        }}
      >
        {lead.last_discussion || 'No discussions yet'}
      </p>

      <p
        style={{
          margin: 0,
          fontSize: '12px',
          color: '#555',
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