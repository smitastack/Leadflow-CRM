import { useEffect, useState } from 'react';
import AddLeadModal from './components/AddLeadModal';
import LeadCard from './components/LeadCard';
import LeadTimelineModal from './components/LeadTimelineModal';

function App() {
  const [leads, setLeads] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [selectedLead, setSelectedLead] = useState(null);

  // SEARCH STATE
  const [searchTerm, setSearchTerm] = useState('');

  // DARK MODE STATE
  const [darkMode, setDarkMode] = useState(false);


  // FETCH LEADS
  const fetchLeads = async () => {
  try {
    const res = await fetch(
      'http://localhost:5000/api/leads'
    );

    const data = await res.json();

    setLeads(Array.isArray(data) ? data : []);

  } catch (error) {
    console.error(error);
    setLeads([]);
  }
};


  // LOAD LEADS 
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

  // FILTER LEADS
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

  // CHECK IF FOLLOW-UP IS TODAY
  const isToday = (dateString) => {
    if (!dateString) return false;

    const date = new Date(dateString);
    const today = new Date();

    return (
      date.getFullYear() === today.getFullYear() &&
      date.getMonth() === today.getMonth() &&
      date.getDate() === today.getDate()
    );
  };

  // SORT LEADS
  const sortedLeads = [...filteredLeads].sort((a, b) => {
    const aToday = isToday(a.follow_up_at);
    const bToday = isToday(b.follow_up_at);

    if (aToday && !bToday) return -1;
    if (!aToday && bToday) return 1;

    return 0;
  });

  // TODAY'S FOLLOW-UPS
  const todaysFollowUps = sortedLeads.filter((lead) =>
    isToday(lead.follow_up_at)
  );

  // OTHER LEADS
  const otherLeads = sortedLeads.filter(
    (lead) => !isToday(lead.follow_up_at)
  );

  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: darkMode ? '#0f172a' : '#f8fafc',
        padding: '40px 20px',
        fontFamily: 'Arial, sans-serif',
        transition: 'all 0.3s ease',
      }}
    >
      <div
        style={{
          maxWidth: '900px',
          margin: '0 auto',
        }}
      >
        {/* HEADER */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '30px',
          }}
        >
          <div>
            <h1
              style={{
                margin: 0,
                fontSize: '36px',
                fontWeight: 'bold',
                color: darkMode ? 'white' : '#0f172a',
              }}
            >
              LeadFlow
            </h1>

            <p
              style={{
                margin: '8px 0 0 0',
                color: darkMode ? '#cbd5e1' : '#64748b',
              }}
            >
              Manage leads, discussions, and follow-ups
            </p>
          </div>

          {/* RIGHT SIDE BUTTONS */}
          <div
            style={{
              display: 'flex',
              gap: '12px',
              alignItems: 'center',
            }}
          >
            
            {/* DARK MODE BUTTON */}
            <button
              onClick={() => setDarkMode(!darkMode)}
              style={{
                border: 'none',
                padding: '12px 16px',
                borderRadius: '10px',
                cursor: 'pointer',
                fontWeight: '600',
                backgroundColor: darkMode
                  ? '#334155'
                  : '#111827',
                color: 'white',
              }}
            >
              {darkMode ? '☀️ Light' : '🌙 Dark'}
            </button>

            {/* ADD LEAD BUTTON */}
            <button
              onClick={() => setShowModal(true)}
              style={{
                backgroundColor: '#2563eb',
                color: 'white',
                border: 'none',
                padding: '12px 20px',
                borderRadius: '10px',
                fontSize: '14px',
                fontWeight: '600',
                cursor: 'pointer',
                boxShadow:
                  '0 4px 12px rgba(37, 99, 235, 0.25)',
              }}
            >
              + Add Lead
            </button>
          </div>
        </div>

        {/* STATUS FILTERS */}
        <div
          style={{
            display: 'flex',
            gap: '10px',
            flexWrap: 'wrap',
            marginBottom: '25px',
          }}
        >
          {statuses.map((status) => (
            <button
              key={status}
              onClick={() => setSelectedStatus(status)}
              style={{
                padding: '8px 16px',
                borderRadius: '9999px',
                border: darkMode
                  ? '1px solid #334155'
                  : '1px solid #d1d5db',
                cursor: 'pointer',
                fontWeight: '500',
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

        {/* SEARCH BAR */}
        <div style={{ marginBottom: '25px' }}>
          <input
            type="text"
            placeholder="Search leads by name..."
            value={searchTerm}
            onChange={(e) =>
              setSearchTerm(e.target.value)
            }
            style={{
              width: '100%',
              padding: '14px 16px',
              borderRadius: '12px',
              border: darkMode
                ? '1px solid #334155'
                : '1px solid #d1d5db',
              fontSize: '14px',
              backgroundColor: darkMode
                ? '#1e293b'
                : 'white',
              color: darkMode ? 'white' : '#000000',
              outline: 'none',
              boxSizing: 'border-box',
              boxShadow: '0 2px 6px rgba(0,0,0,0.05)',
            }}
          />
        </div>

        {/* TODAY FOLLOW UPS */}
        {todaysFollowUps.length > 0 && (
          <>
            <h2
              style={{
                marginBottom: '20px',
                color: '#dc2626',
              }}
            >
              📅 Today's Follow-Ups (
              {todaysFollowUps.length})
            </h2>

            {todaysFollowUps.map((lead) => (
              <LeadCard
                key={lead.id}
                lead={lead}
                onClick={() => setSelectedLead(lead)}
              />
            ))}
          </>
        )}

        {/* ALL LEADS */}
        <h2
          style={{
            marginTop:
              todaysFollowUps.length > 0
                ? '40px'
                : '0',
            marginBottom: '20px',
            color: darkMode ? 'white' : '#1e293b',
          }}
        >
          All Leads ({otherLeads.length})
        </h2>

        {otherLeads.length === 0 ? (
          <div
            style={{
              backgroundColor: darkMode
                ? '#1e293b'
                : 'white',
              padding: '40px',
              borderRadius: '16px',
              textAlign: 'center',
              color: darkMode
                ? '#cbd5e1'
                : '#64748b',
              boxShadow:
                '0 4px 12px rgba(0,0,0,0.05)',
            }}
          >
            No leads found.
          </div>
        ) : (
          otherLeads.map((lead) => (
            <LeadCard
              key={lead.id}
              lead={lead}
              onClick={() => setSelectedLead(lead)}
            />
          ))
        )}

        {/* ADD LEAD MODAL */}
        {showModal && (
          <AddLeadModal
            onClose={() => setShowModal(false)}
            onSuccess={fetchLeads}
          />
        )}

        {/* TIMELINE MODAL */}
        {selectedLead && (
          <LeadTimelineModal
            lead={selectedLead}
            onClose={() => setSelectedLead(null)}
            onSuccess={fetchLeads}
          />
        )}
      </div>
    </div>
  );
}

export default App;