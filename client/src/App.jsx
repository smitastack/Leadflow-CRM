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

  const statuses = ['All', 'New', 'Contacted', 'Qualified', 'Proposal Sent', 'Won', 'Lost'];

  const filteredLeads = leads.filter((lead) => {
    const matchesStatus = selectedStatus === 'All' ? true : lead.status === selectedStatus;
    const matchesSearch = lead.name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const hasActiveFollowUp = (lead) =>
    lead.follow_up_at && lead.status !== 'Won' && lead.status !== 'Lost';

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

  const isOverdue = (lead) => {
    if (!hasActiveFollowUp(lead)) return false;
    return new Date(lead.follow_up_at) < new Date();
  };

  const sortedLeads = [...filteredLeads].sort((a, b) => {
    const aOverdue = isOverdue(a), bOverdue = isOverdue(b);
    const aToday = isTodayFollowUp(a), bToday = isTodayFollowUp(b);
    if (aOverdue && !bOverdue) return -1;
    if (!aOverdue && bOverdue) return 1;
    if (aToday && !bToday) return -1;
    if (!aToday && bToday) return 1;
    return 0;
  });

  const todaysFollowUps = sortedLeads.filter(isTodayFollowUp);
  const overdueLeads = sortedLeads.filter(isOverdue);
  const otherLeads = sortedLeads.filter((l) => !isTodayFollowUp(l) && !isOverdue(l));

  const d = darkMode;

  return (
    <div style={{
      height: '100vh',
      backgroundColor: d ? '#070d1a' : '#f0f4ff',
      fontFamily: "'DM Sans', 'Segoe UI', sans-serif",
      overflow: 'hidden',
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Syne:wght@700;800&display=swap');
        * { box-sizing: border-box; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: ${d ? '#334155' : '#cbd5e1'}; border-radius: 99px; }
        .filter-btn { transition: all 0.18s ease; }
        .filter-btn:hover { transform: translateY(-1px); }
        .add-btn:hover { transform: translateY(-2px); box-shadow: 0 12px 28px rgba(37,99,235,0.38) !important; }
        .add-btn { transition: all 0.2s ease; }
        .dark-toggle:hover { background: rgba(255,255,255,0.22) !important; }
        .dark-toggle { transition: all 0.2s ease; }
      `}</style>

      <div style={{
        display: 'grid',
        gridTemplateColumns: '380px 1fr',
        height: '100vh',
      }}>
        {/* ── LEFT PANEL ── */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          backgroundColor: d ? '#0d1526' : '#ffffff',
          borderRight: `1px solid ${d ? '#1a2540' : '#e2e8f7'}`,
          boxShadow: d ? '4px 0 24px rgba(0,0,0,0.3)' : '4px 0 24px rgba(37,99,235,0.06)',
        }}>

          {/* HEADER */}
          <div style={{
            padding: '20px 20px 0',
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              background: d
                ? 'linear-gradient(135deg, #1a3a8f 0%, #1e40af 50%, #2563eb 100%)'
                : 'linear-gradient(135deg, #1d4ed8 0%, #2563eb 60%, #3b82f6 100%)',
              borderRadius: '20px',
              padding: '14px 16px',
              marginBottom: '18px',
              boxShadow: '0 8px 24px rgba(37,99,235,0.28)',
              position: 'relative',
              overflow: 'hidden',
            }}>
              {/* subtle shine overlay */}
              <div style={{
                position: 'absolute', top: 0, left: 0, right: 0,
                height: '50%', background: 'rgba(255,255,255,0.07)',
                borderRadius: '20px 20px 0 0', pointerEvents: 'none',
              }} />
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', position: 'relative' }}>
                <img src={leadflowLogo} alt="LeadFlow" style={{ width: '44px', height: '44px', objectFit: 'contain' }} />
                <span style={{
                  fontSize: '22px', fontWeight: '800', color: 'white',
                  fontFamily: "'Syne', sans-serif", letterSpacing: '-0.3px',
                }}>LeadFlow</span>
              </div>
              <button
                className="dark-toggle"
                onClick={() => setDarkMode(!d)}
                style={{
                  width: '36px', height: '36px', borderRadius: '50%',
                  border: '1px solid rgba(255,255,255,0.3)',
                  backgroundColor: 'rgba(255,255,255,0.14)',
                  color: 'white', cursor: 'pointer', fontSize: '16px',
                  display: 'flex', justifyContent: 'center', alignItems: 'center',
                  position: 'relative',
                }}
              >
                {d ? '☀️' : '🌙'}
              </button>
            </div>

            {/* SEARCH */}
            <div style={{ position: 'relative', marginBottom: '16px' }}>
              <span style={{
                position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)',
                fontSize: '15px', color: d ? '#4a6080' : '#94a3b8', pointerEvents: 'none',
              }}>🔍</span>
              <input
                type="text"
                placeholder="Search leads..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{
                  width: '100%', padding: '11px 14px 11px 38px',
                  borderRadius: '14px',
                  border: `1.5px solid ${d ? '#1e2d45' : '#e2e8f7'}`,
                  fontSize: '13.5px',
                  backgroundColor: d ? '#111e34' : '#f8faff',
                  color: d ? '#e2e8f0' : '#1e293b',
                  outline: 'none',
                  transition: 'border-color 0.2s',
                }}
                onFocus={e => e.target.style.borderColor = '#3b82f6'}
                onBlur={e => e.target.style.borderColor = d ? '#1e2d45' : '#e2e8f7'}
              />
            </div>

            {/* FILTERS */}
            <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '20px' }}>
              {statuses.map((status) => (
                <button
                  key={status}
                  className="filter-btn"
                  onClick={() => setSelectedStatus(status)}
                  style={{
                    padding: '5px 12px',
                    borderRadius: '9999px',
                    border: selectedStatus === status
                      ? 'none'
                      : `1.5px solid ${d ? '#1e2d45' : '#e2e8f7'}`,
                    cursor: 'pointer',
                    fontWeight: selectedStatus === status ? '700' : '500',
                    fontSize: '12px',
                    backgroundColor: selectedStatus === status
                      ? '#2563eb'
                      : d ? '#111e34' : '#f8faff',
                    color: selectedStatus === status
                      ? 'white'
                      : d ? '#94a3b8' : '#64748b',
                    boxShadow: selectedStatus === status
                      ? '0 4px 12px rgba(37,99,235,0.3)'
                      : 'none',
                  }}
                >
                  {status}
                </button>
              ))}
            </div>
          </div>

          {/* SCROLLABLE LEADS */}
          <div style={{ flex: 1, overflowY: 'auto', padding: '0 20px' }}>

            {todaysFollowUps.length > 0 && (
              <div style={{ marginBottom: '20px' }}>
                <SectionLabel color="#16a34a" icon="📅" label={`Today's Follow-Ups (${todaysFollowUps.length})`} dark={d} />
                {todaysFollowUps.map((lead) => (
                  <LeadCard key={lead.id} lead={lead} onClick={() => setSelectedLead(lead)} />
                ))}
              </div>
            )}

            {overdueLeads.length > 0 && (
              <div style={{ marginBottom: '20px' }}>
                <SectionLabel color="#dc2626" icon="⚠️" label={`Overdue (${overdueLeads.length})`} dark={d} />
                {overdueLeads.map((lead) => (
                  <LeadCard key={lead.id} lead={lead} onClick={() => setSelectedLead(lead)} />
                ))}
              </div>
            )}

            <div style={{ marginBottom: '20px' }}>
              <SectionLabel color={d ? '#94a3b8' : '#64748b'} icon="👥" label={`All Leads (${otherLeads.length})`} dark={d} />
              {otherLeads.map((lead) => (
                <LeadCard key={lead.id} lead={lead} onClick={() => setSelectedLead(lead)} />
              ))}
            </div>
          </div>

          {/* ADD BUTTON */}
          <div style={{ padding: '16px 20px' }}>
            <button
              className="add-btn"
              onClick={() => setShowModal(true)}
              style={{
                width: '100%', padding: '14px',
                borderRadius: '16px', fontSize: '14px', fontWeight: '700',
                color: 'white',
                background: 'linear-gradient(135deg, #2563eb, #4f46e5)',
                border: 'none', cursor: 'pointer',
                boxShadow: '0 8px 20px rgba(37,99,235,0.28)',
                letterSpacing: '0.2px',
              }}
            >
              + Add Lead
            </button>
          </div>
        </div>

        {/* ── RIGHT PANEL ── */}
        <div style={{
          overflowY: 'auto',
          backgroundColor: d ? '#070d1a' : '#f0f4ff',
        }}>
          {selectedLead ? (
            <LeadTimelinePanel lead={selectedLead} onSuccess={fetchLeads} darkMode={d} />
          ) : (
            <EmptyState dark={d} onAddLead={() => setShowModal(true)} />
          )}
        </div>
      </div>

      {showModal && (
        <AddLeadModal onClose={() => setShowModal(false)} onSuccess={fetchLeads} />
      )}
    </div>
  );
}

function SectionLabel({ color, icon, label, dark }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: '7px',
      marginBottom: '12px', marginTop: '4px',
    }}>
      <span style={{ fontSize: '13px' }}>{icon}</span>
      <span style={{
        fontSize: '12px', fontWeight: '700', color,
        textTransform: 'uppercase', letterSpacing: '0.7px',
      }}>{label}</span>
      <div style={{
        flex: 1, height: '1px',
        background: dark ? '#1a2540' : '#e8eef8',
        marginLeft: '4px',
      }} />
    </div>
  );
}

function EmptyState({ dark, onAddLead }) {
  return (
    <div style={{
      height: '100vh', display: 'flex',
      justifyContent: 'center', alignItems: 'center', padding: '40px',
    }}>
      <div style={{
        width: '100%', maxWidth: '400px', textAlign: 'center',
      }}>
        <div style={{
          width: '80px', height: '80px', borderRadius: '24px',
          background: dark
            ? 'linear-gradient(135deg, #1a2540, #1e3160)'
            : 'linear-gradient(135deg, #dbeafe, #ede9fe)',
          display: 'flex', justifyContent: 'center', alignItems: 'center',
          margin: '0 auto 28px',
          fontSize: '32px',
          boxShadow: dark
            ? '0 8px 24px rgba(0,0,0,0.3)'
            : '0 8px 24px rgba(99,102,241,0.12)',
        }}>💬</div>

        <h2 style={{
          margin: '0 0 12px', fontSize: '26px', fontWeight: '700',
          color: dark ? '#f1f5f9' : '#0f172a',
          fontFamily: "'Syne', sans-serif",
        }}>No lead selected</h2>

        <p style={{
          margin: '0 0 28px', lineHeight: '1.7', fontSize: '14.5px',
          color: dark ? '#64748b' : '#94a3b8',
        }}>
          Select a lead from the sidebar to view discussion history, follow-ups, and manage conversations.
        </p>

        <button
          onClick={onAddLead}
          style={{
            padding: '12px 28px', borderRadius: '14px', border: 'none',
            background: 'linear-gradient(135deg, #2563eb, #4f46e5)',
            color: 'white', cursor: 'pointer', fontWeight: '600',
            fontSize: '14px', boxShadow: '0 8px 20px rgba(37,99,235,0.25)',
          }}
        >
          + Add your first lead
        </button>
      </div>
    </div>
  );
}

export default App;
