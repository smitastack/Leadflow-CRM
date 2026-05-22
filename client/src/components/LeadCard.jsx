import { useState } from 'react';

function LeadCard({ lead, onClick }) {
  const [isHovered, setIsHovered] = useState(false);

  const now = new Date();
  const followUpTime = lead.follow_up_at ? new Date(lead.follow_up_at) : null;

  const isToday =
    followUpTime &&
    followUpTime.toDateString() === now.toDateString() &&
    followUpTime > now &&
    lead.status !== 'Won' &&
    lead.status !== 'Lost';

  const isOverdue =
    followUpTime &&
    followUpTime < now &&
    lead.status !== 'Won' &&
    lead.status !== 'Lost';

  const getStatusStyle = (status) => {
    const styles = {
      'New':           { bg: '#f1f5f9', color: '#475569', dot: '#94a3b8' },
      'Contacted':     { bg: '#dbeafe', color: '#1d4ed8', dot: '#3b82f6' },
      'Qualified':     { bg: '#ede9fe', color: '#6d28d9', dot: '#8b5cf6' },
      'Proposal Sent': { bg: '#fff7ed', color: '#c2410c', dot: '#f97316' },
      'Won':           { bg: '#dcfce7', color: '#15803d', dot: '#22c55e' },
      'Lost':          { bg: '#fee2e2', color: '#b91c1c', dot: '#ef4444' },
    };
    return styles[status] || { bg: '#f3f4f6', color: '#374151', dot: '#9ca3af' };
  };

  const statusStyle = getStatusStyle(lead.status);

  const initials = lead.name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  const avatarColors = [
    ['#dbeafe', '#1d4ed8'],
    ['#ede9fe', '#6d28d9'],
    ['#dcfce7', '#15803d'],
    ['#fff7ed', '#c2410c'],
    ['#fce7f3', '#be185d'],
    ['#e0f2fe', '#0369a1'],
  ];
  const avatarColor = avatarColors[lead.name.charCodeAt(0) % avatarColors.length];

  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        border: isOverdue
          ? '1.5px solid #fca5a5'
          : isHovered
          ? '1.5px solid #93c5fd'
          : '1.5px solid #e8eef8',
        borderRadius: '16px',
        padding: '14px',
        backgroundColor: isOverdue
          ? '#fff5f5'
          : isHovered
          ? '#f8fbff'
          : '#ffffff',
        boxShadow: isHovered
          ? '0 8px 24px rgba(37,99,235,0.1)'
          : isOverdue
          ? '0 4px 12px rgba(220,38,38,0.08)'
          : '0 2px 8px rgba(15,23,42,0.05)',
        cursor: 'pointer',
        transition: 'all 0.18s ease',
        marginBottom: '10px',
      }}
    >
      {/* TOP ROW */}
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', marginBottom: '10px' }}>
        {/* Avatar */}
        <div style={{
          width: '36px', height: '36px', borderRadius: '10px', flexShrink: 0,
          backgroundColor: avatarColor[0],
          display: 'flex', justifyContent: 'center', alignItems: 'center',
          fontSize: '12px', fontWeight: '700', color: avatarColor[1],
        }}>
          {initials}
        </div>

        {/* Name + Company */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <h3 style={{
            margin: 0, color: '#0f172a', fontSize: '14px',
            fontWeight: '700', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
          }}>
            {lead.name}
          </h3>
          <p style={{
            margin: '2px 0 0', color: '#94a3b8',
            fontSize: '11.5px', fontWeight: '500',
          }}>
            {lead.company || 'No company'}
          </p>
        </div>

        {/* Status badge */}
        <span style={{
          backgroundColor: statusStyle.bg,
          color: statusStyle.color,
          padding: '3px 9px',
          borderRadius: '9999px',
          fontSize: '10.5px',
          fontWeight: '700',
          flexShrink: 0,
          display: 'flex', alignItems: 'center', gap: '4px',
        }}>
          <span style={{
            width: '5px', height: '5px', borderRadius: '50%',
            backgroundColor: statusStyle.dot, display: 'inline-block',
          }} />
          {lead.status}
        </span>
      </div>

      {/* BADGES */}
      {(isOverdue || isToday) && (
        <div style={{ marginBottom: '8px' }}>
          {isOverdue && (
            <span style={{
              display: 'inline-flex', alignItems: 'center', gap: '4px',
              backgroundColor: '#fee2e2', color: '#b91c1c',
              padding: '3px 9px', borderRadius: '9999px',
              fontSize: '10.5px', fontWeight: '700',
            }}>
              ⚠ Overdue Follow-up
            </span>
          )}
          {!isOverdue && isToday && (
            <span style={{
              display: 'inline-flex', alignItems: 'center', gap: '4px',
              backgroundColor: '#dbeafe', color: '#1d4ed8',
              padding: '3px 9px', borderRadius: '9999px',
              fontSize: '10.5px', fontWeight: '700',
            }}>
              📅 Follow-up Today
            </span>
          )}
        </div>
      )}

      {/* LAST DISCUSSION */}
      {lead.last_discussion && (
        <p style={{
          margin: '0 0 8px',
          color: '#64748b',
          fontSize: '12px',
          lineHeight: '1.5',
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
        }}>
          {lead.last_discussion}
        </p>
      )}

      {/* FOOTER */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        paddingTop: '8px',
        borderTop: '1px solid #f1f5f9',
      }}>
        <span style={{ fontSize: '10.5px', color: '#cbd5e1', fontWeight: '500' }}>
          {lead.last_discussion_time
            ? new Date(lead.last_discussion_time).toLocaleString()
            : 'No activity yet'}
        </span>
        <span style={{
          fontSize: '11px', color: isHovered ? '#2563eb' : '#cbd5e1',
          fontWeight: '600', transition: 'color 0.15s',
        }}>
          View →
        </span>
      </div>
    </div>
  );
}

export default LeadCard;
