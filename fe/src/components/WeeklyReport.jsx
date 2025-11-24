import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { api } from '../lib/api';

const WeeklyReport = () => {
  const { reportId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [report, setReport] = useState(null);
  const [currentWeek, setCurrentWeek] = useState(1);
  const [form, setForm] = useState({
    weekNumber: 1,
    fromdate: '',
    todate: '',
    workingHours: '',
    questions: [
      { question: 'Describe your principle assignments and responsibilities for this period.', answer: '' },
      { question: 'What experiences were particularly rewarding during this report period?', answer: '' },
      { question: 'What experiences were particularly difficult during this report period?', answer: '' },
      { question: 'Describe principal tasks and duties to be performed and accomplishments during the upcoming week.', answer: '' },
      { question: 'Learning Outcomes: (in brief)', answer: '' },
    ],
  });
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [msg, setMsg] = useState('');

  useEffect(() => {
    const fetchReport = async () => {
      try {
        setLoading(true);
        const reports = await api.getStudentReports();
        const foundReport = reports.find(r => r._id === reportId);
        if (!foundReport) {
          setError('Report not found');
          return;
        }
        setReport(foundReport);
        const existingWeek = foundReport.weeklyReports?.find(w => w.weekNumber === currentWeek);
        if (existingWeek) {
          setForm({
            weekNumber: existingWeek.weekNumber,
            fromdate: existingWeek.fromdate ? new Date(existingWeek.fromdate).toISOString().split('T')[0] : '',
            todate: existingWeek.todate ? new Date(existingWeek.todate).toISOString().split('T')[0] : '',
            workingHours: existingWeek.workingHours || '',
            questions: existingWeek.questions || form.questions,
          });
        }
      } catch (err) {
        setError(err.message || 'Failed to load report');
      } finally {
        setLoading(false);
      }
    };
    if (reportId) {
      fetchReport();
    }
  }, [reportId]);

  useEffect(() => {
    if (report) {
      const existingWeek = report.weeklyReports?.find(w => w.weekNumber === currentWeek);
      if (existingWeek) {
        setForm({
          weekNumber: existingWeek.weekNumber,
          fromdate: existingWeek.fromdate ? new Date(existingWeek.fromdate).toISOString().split('T')[0] : '',
          todate: existingWeek.todate ? new Date(existingWeek.todate).toISOString().split('T')[0] : '',
          workingHours: existingWeek.workingHours || '',
          questions: existingWeek.questions || form.questions,
        });
      } else {
        setForm({
          weekNumber: currentWeek,
          fromdate: '',
          todate: '',
          workingHours: '',
          questions: form.questions.map(q => ({ ...q, answer: '' })),
        });
      }
    }
  }, [currentWeek, report]);

  const handleChange = (e, index) => {
    if (index !== undefined) {
      const newQuestions = [...form.questions];
      newQuestions[index].answer = e.target.value;
      setForm({ ...form, questions: newQuestions });
    } else {
      setForm({ ...form, [e.target.name]: e.target.value });
    }
  };

  const handleSubmit = async () => {
    if (!form.fromdate || !form.todate || !form.workingHours) {
      setError('Please fill in all required fields');
      return;
    }

    setSubmitting(true);
    setError('');
    setMsg('');

    try {
      await api.submitWeeklyReport(reportId, form);
      setMsg(`Week ${currentWeek} report submitted successfully!`);
      setTimeout(() => {
        navigate('/dashboard');
      }, 1500);
    } catch (err) {
      setError(err.message || 'Failed to submit report');
    } finally {
      setSubmitting(false);
    }
  };

  if (!user) {
    return null;
  }

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--background)' }}>
        <div>Loading...</div>
      </div>
    );
  }

  if (error && !report) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--background)' }}>
        <div className="card" style={{ maxWidth: 500 }}>
          <div style={{ color: '#dc2626', marginBottom: 16 }}>{error}</div>
          <button onClick={() => navigate('/dashboard')}>Back to Dashboard</button>
        </div>
      </div>
    );
  }

  const weeks = [1, 2, 3, 4, 5, 6];
  const submittedWeeks = report?.weeklyReports?.map(w => w.weekNumber) || [];

  return (
    <div style={{ minHeight: '100vh', background: 'var(--background)' }}>
      <aside
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          height: '100vh',
          width: 220,
          background: 'var(--surface)',
          borderRight: `1px solid var(--border-color)`,
          padding: 24,
          display: 'flex',
          flexDirection: 'column',
          gap: 16,
          zIndex: 100,
          overflowY: 'auto',
        }}
      >
        <h2 style={{ fontSize: 20, margin: 0, marginBottom: 24 }}>Weekly Reports</h2>
        {weeks.map(w => (
          <button
            key={w}
            onClick={() => setCurrentWeek(w)}
            style={{
              width: '100%',
              background: currentWeek === w ? 'var(--surface-muted)' : 'var(--surface)',
              fontWeight: currentWeek === w ? 600 : 400,
              border: `1px solid var(--border-color)`,
              marginBottom: 6,
              borderRadius: 8,
              cursor: 'pointer',
              padding: 12,
              color: submittedWeeks.includes(w) ? '#16a34a' : 'var(--text-primary)',
            }}
          >
            Week {w} {submittedWeeks.includes(w) ? '✓' : ''}
          </button>
        ))}
        <button
          onClick={() => navigate('/dashboard')}
          style={{ marginTop: 24, borderRadius: 8, padding: '10px 0', fontWeight: 600 }}
        >
          Back to Dashboard
        </button>
      </aside>

      <main style={{ marginLeft: 220, minHeight: '100vh', padding: 20 }}>
        <div className="card" style={{ maxWidth: 800, width: '100%', margin: '0 auto' }}>
          <h2 style={{ textAlign: 'center', marginBottom: 16 }}>
            Weekly Report - Week {currentWeek}
          </h2>
          {report && (
            <div style={{ marginBottom: 16, fontSize: 14, color: 'var(--text-muted)' }}>
              <b>Company:</b> {report.company?.name || 'Unknown'} | <b>Technology:</b> {report.technology}
            </div>
          )}

          {error && <div style={{ color: '#dc2626', fontSize: 13, padding: 8, background: '#fee', borderRadius: 6, marginBottom: 16 }}>{error}</div>}
          {msg && <div style={{ color: '#16a34a', fontSize: 13, padding: 8, background: '#dcfce7', borderRadius: 6, marginBottom: 16 }}>{msg}</div>}

          {submittedWeeks.includes(currentWeek) && (
            <div style={{ color: '#16a34a', fontSize: 13, padding: 8, background: '#dcfce7', borderRadius: 6, marginBottom: 16 }}>
              This week's report has already been submitted.
            </div>
          )}

          <form style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div style={{ display: 'flex', gap: 8 }}>
              <div style={{ flex: 1 }}>
                <label>From Date</label>
                <input
                  name="fromdate"
                  type="date"
                  value={form.fromdate}
                  onChange={handleChange}
                  required
                  disabled={submitting || submittedWeeks.includes(currentWeek)}
                />
              </div>
              <div style={{ flex: 1 }}>
                <label>To Date</label>
                <input
                  name="todate"
                  type="date"
                  value={form.todate}
                  onChange={handleChange}
                  required
                  disabled={submitting || submittedWeeks.includes(currentWeek)}
                />
              </div>
              <div style={{ flex: 1 }}>
                <label>Working Hours</label>
                <input
                  name="workingHours"
                  type="number"
                  value={form.workingHours}
                  onChange={handleChange}
                  required
                  disabled={submitting || submittedWeeks.includes(currentWeek)}
                />
              </div>
            </div>

            {form.questions.map((q, index) => (
              <div key={index}>
                <label>{q.question}</label>
                <textarea
                  value={q.answer}
                  onChange={(e) => handleChange(e, index)}
                  required
                  disabled={submitting || submittedWeeks.includes(currentWeek)}
                  style={{ minHeight: 80 }}
                />
              </div>
            ))}

            {!submittedWeeks.includes(currentWeek) && (
              <button
                type="button"
                onClick={handleSubmit}
                disabled={submitting}
                style={{ marginTop: 12 }}
              >
                {submitting ? 'Submitting...' : 'Submit Week ' + currentWeek}
              </button>
            )}
          </form>
        </div>
      </main>
    </div>
  );
};

export default WeeklyReport;
