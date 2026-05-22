import { useEffect, useState } from 'react';
import AddLeadModal from './components/AddLeadModal';
import LeadCard from './components/LeadCard';
import LeadTimelinePanel from './components/LeadTimelinePanel';
import leadflowLogo from './assets/leadflow-logo.png';

function App() {
  const [leads, setLeads] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [selectedLead, setSelectedLead] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [darkMode, setDarkMode] = useState(false);

  const fetchLeads = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/leads');
      const data = await res.json();
      setLeads(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error(error);
      setLeads([]);
    }
  };

  useEffect(() => {
    fetchLeads();
  }, []);

  const statuses = [
    'All',
    'New',
    'Contacted',
    'Qualified',
    'Proposal Sent',
    'Won',
    'Lost',
  ];

  const filteredLeads = leads.filter((lead) => {
    const matchesStatus =
      selectedStatus === 'All'
        ? true
        : lead.status === selectedStatus;

    const matchesSearch = lead.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());

    return matchesStatus && matchesSearch;
  });

  // ACTIVE FOLLOW-UP ONLY
  const hasActiveFollowUp = (lead) => {
    return (
      lead.follow_up_at &&
      lead.status !== 'Won' &&
      lead.status !== 'Lost'
    );
  };

  // TODAY FOLLOW-UP
  const isTodayFollowUp = (lead) => {
    if (!hasActiveFollowUp(lead)) return false;

    const followUp = new Date(lead.follow_up_at);
    const now = new Date();

    return (
      followUp >= now &&
      followUp.getDate() === now.getDate() &&
      followUp.getMonth() === now.getMonth() &&
      followUp.getFullYear() === now.getFullYear()
    );
  };

  // OVERDUE FOLLOW-UP
  const isOverdue = (lead) => {
    if (!hasActiveFollowUp(lead)) return false;

    const followUp = new Date(lead.follow_up_at);
    const now = new Date();

    return followUp < now;
  };

  // SORTING
  const sortedLeads = [...filteredLeads].sort((a, b) => {
    const aOverdue = isOverdue(a);
    const bOverdue = isOverdue(b);

    const aToday = isTodayFollowUp(a);
    const bToday = isTodayFollowUp(b);

    if (aOverdue && !bOverdue) return -1;
    if (!aOverdue && bOverdue) return 1;

    if (aToday && !bToday) return -1;
    if (!aToday && bToday) return 1;

    return 0;
  });

  // GROUPS
  const todaysFollowUps = sortedLeads.filter((lead) =>
    isTodayFollowUp(lead)
  );

  const overdueLeads = sortedLeads.filter((lead) =>
    isOverdue(lead)
  );

  const otherLeads = sortedLeads.filter(
    (lead) =>
      !isTodayFollowUp(lead) &&
      !isOverdue(lead)
  );

  return (
    <div
      style={{
        height: '100vh',
        backgroundColor: darkMode ? '#0f172a' : '#f8fafc',
        fontFamily: 'Inter, Arial, sans-serif',
      }}
    >
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '390px 1fr',
          height: '100vh',
        }}
      >
        {/* LEFT PANEL */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            padding: '20px',
            backgroundColor: darkMode
              ? '#111827'
              : '#ffffff',
            borderRight: darkMode
              ? '1px solid #1e293b'
              : '1px solid #e5e7eb',
          }}
        >
          {/* HEADER BAND */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '10px 14px',
              borderRadius: '18px',
              background: darkMode
                ? 'linear-gradient(135deg, #1d4ed8, #2563eb)'
                : 'linear-gradient(135deg, #2563eb, #3b82f6)',
              marginBottom: '16px',
              boxShadow:
                '0 8px 20px rgba(37,99,235,0.22)',
            }}
          >
            {/* LEFT SECTION */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
              }}
            >
              <img
                src={leadflowLogo}
                alt="LeadFlow"
                style={{
                  width: '70px',
                  height: '70px',
                  objectFit: 'contain',
                }}
              />

              <h1
                style={{
                  margin: 0,
                  fontSize: '22px',
                  fontWeight: '700',
                  color: 'white',
                }}
              >
                LeadFlow
              </h1>
            </div>

            {/* DARK MODE BUTTON */}
            <button
              onClick={() => setDarkMode(!darkMode)}
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                border:
                  '1px solid rgba(255,255,255,0.25)',
                backgroundColor:
                  'rgba(255,255,255,0.14)',
                color: 'white',
                cursor: 'pointer',
                fontSize: '15px',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              {darkMode ? '☀️' : '🌙'}
            </button>
          </div>

          {/* SCROLLABLE AREA */}
          <div
            style={{
              flexGrow: 1,
              overflowY: 'auto',
              paddingRight: '4px',
            }}
          >
            {/* FILTERS */}
            <div
              style={{
                display: 'flex',
                gap: '8px',
                flexWrap: 'wrap',
                marginBottom: '18px',
              }}
            >
              {statuses.map((status) => (
                <button
                  key={status}
                  onClick={() =>
                    setSelectedStatus(status)
                  }
                  style={{
                    padding: '6px 14px',
                    borderRadius: '9999px',
                    border: darkMode
                      ? '1px solid #334155'
                      : '1px solid #d1d5db',
                    cursor: 'pointer',
                    fontWeight: '500',
                    fontSize: '12px',
                    backgroundColor:
                      selectedStatus === status
                        ? '#2563eb'
                        : darkMode
                        ? '#1e293b'
                        : 'white',
                    color:
                      selectedStatus === status
                        ? 'white'
                        : darkMode
                        ? '#e2e8f0'
                        : '#374151',
                  }}
                >
                  {status}
                </button>
              ))}
            </div>

            {/* SEARCH */}
            <div style={{ marginBottom: '18px' }}>
              <input
                type="text"
                placeholder="Search leads..."
                value={searchTerm}
                onChange={(e) =>
                  setSearchTerm(e.target.value)
                }
                style={{
                  width: '100%',
                  padding: '12px 14px',
                  borderRadius: '14px',
                  border: darkMode
                    ? '1px solid #334155'
                    : '1px solid #d1d5db',
                  fontSize: '14px',
                  backgroundColor: darkMode
                    ? '#1e293b'
                    : 'white',
                  color: darkMode
                    ? 'white'
                    : '#111827',
                  outline: 'none',
                }}
              />
            </div>

            {/* TODAY FOLLOW UPS */}
            {todaysFollowUps.length > 0 && (
              <>
                <h2
                  style={{
                    marginBottom: '14px',
                    color: '#dc2626',
                    fontSize: '16px',
                  }}
                >
                  Today's Follow-Ups (
                  {todaysFollowUps.length})
                </h2>

                {todaysFollowUps.map((lead) => (
                  <LeadCard
                    key={lead.id}
                    lead={lead}
                    onClick={() =>
                      setSelectedLead(lead)
                    }
                  />
                ))}
              </>
            )}

            {/* OVERDUE */}
            {overdueLeads.length > 0 && (
              <>
                <h2
                  style={{
                    marginBottom: '14px',
                    color: '#eab308',
                    fontSize: '16px',
                  }}
                >
                  Overdue ({overdueLeads.length})
                </h2>

                {overdueLeads.map((lead) => (
                  <LeadCard
                    key={lead.id}
                    lead={lead}
                    onClick={() =>
                      setSelectedLead(lead)
                    }
                  />
                ))}
              </>
            )}

            {/* ALL LEADS */}
            <h2
              style={{
                marginTop: '24px',
                marginBottom: '14px',
                color: darkMode
                  ? 'white'
                  : '#111827',
                fontSize: '16px',
              }}
            >
              All Leads ({otherLeads.length})
            </h2>

            {otherLeads.map((lead) => (
              <LeadCard
                key={lead.id}
                lead={lead}
                onClick={() =>
                  setSelectedLead(lead)
                }
              />
            ))}
          </div>

          {/* ADD BUTTON */}
          <button
            onClick={() => setShowModal(true)}
            style={{
              marginTop: '18px',
              width: '100%',
              padding: '14px',
              borderRadius: '16px',
              fontSize: '14px',
              fontWeight: '700',
              color: 'white',
              background:
                'linear-gradient(135deg, #2563eb, #4f46e5)',
              border: 'none',
              cursor: 'pointer',
              boxShadow:
                '0 8px 20px rgba(37,99,235,0.25)',
            }}
          >
            + Add Lead
          </button>
        </div>

        {/* RIGHT PANEL */}
        <div
          style={{
            overflowY: 'auto',
            backgroundColor: darkMode
              ? '#0f172a'
              : '#f8fafc',
          }}
        >
          {selectedLead ? (
            <LeadTimelinePanel
              lead={selectedLead}
              onSuccess={fetchLeads}
              darkMode={darkMode}
            />
          ) : (
            <div
              style={{
                height: '100vh',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                padding: '40px',
              }}
            >
              <div
                style={{
                  width: '100%',
                  maxWidth: '420px',
                  backgroundColor: darkMode
                    ? '#111827'
                    : 'white',
                  border: darkMode
                    ? '1px solid #1e293b'
                    : '1px solid #e5e7eb',
                  borderRadius: '28px',
                  padding: '42px 36px',
                  boxShadow: darkMode
                    ? '0 10px 30px rgba(0,0,0,0.35)'
                    : '0 10px 30px rgba(15,23,42,0.08)',
                }}
              >
                <div
                  style={{
                    width: '72px',
                    height: '72px',
                    borderRadius: '22px',
                    backgroundColor: darkMode
                      ? '#1e293b'
                      : '#f1f5f9',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginBottom: '26px',
                    fontSize: '30px',
                  }}
                >
                  💬
                </div>

                <h2
                  style={{
                    margin: 0,
                    marginBottom: '12px',
                    fontSize: '28px',
                    fontWeight: '700',
                    color: darkMode
                      ? 'white'
                      : '#0f172a',
                  }}
                >
                  No lead selected
                </h2>

                <p
                  style={{
                    margin: 0,
                    lineHeight: '1.7',
                    fontSize: '15px',
                    color: darkMode
                      ? '#94a3b8'
                      : '#64748b',
                    marginBottom: '28px',
                  }}
                >
                  Select a lead from the sidebar to
                  view discussion history,
                  follow-ups, and manage
                  conversations.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {showModal && (
        <AddLeadModal
          onClose={() => setShowModal(false)}
          onSuccess={fetchLeads}
        />
      )}
    </div>
  );
}

export default App;