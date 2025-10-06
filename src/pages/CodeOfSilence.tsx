import { useState, useEffect, useRef } from "react";
import { toast } from "sonner";
import { useGame } from "@/contexts/GameContext";

const CodeOfSilence = () => {
  const { timeRemaining } = useGame();
  const [view, setView] = useState<'landing' | 'folders' | 'main' | 'wire'>('landing');
  const [d2Popup, setD2Popup] = useState(false);
  const [xValue, setXValue] = useState("");
  const [xMessage, setXMessage] = useState({ text: "", success: false });
  const [d2Solved, setD2Solved] = useState(false);
  const [d3Solved, setD3Solved] = useState(false);
  const [d2Value, setD2Value] = useState("—");
  const [d3Value, setD3Value] = useState("—");
  const [selectedTerminal, setSelectedTerminal] = useState<string | null>(null);
  const [connections, setConnections] = useState<Record<string, string>>({});
  const [wireStatus, setWireStatus] = useState("");
  const [passcodeInput, setPasscodeInput] = useState("");
  const [passcodeMessage, setPasscodeMessage] = useState({ text: "", success: false });
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const D2_CORRECT = 7;
  const D3_VALUE = 4;
  const solution: Record<string, string> = { '1': '3', '2': '2', '3': '1', '4': '4' };

  useEffect(() => {
    const d2 = sessionStorage.getItem('d2_solved') === 'true';
    const d3 = sessionStorage.getItem('d3_solved') === 'true';
    if (d2) {
      setD2Solved(true);
      setD2Value(String(D2_CORRECT));
    }
    if (d3) {
      setD3Solved(true);
      setD3Value(String(D3_VALUE));
    }
  }, []);

  useEffect(() => {
    if (view === 'wire') {
      setTimeout(() => resizeCanvas(), 100);
    }
  }, [view]);

  useEffect(() => {
    window.addEventListener('resize', resizeCanvas);
    return () => window.removeEventListener('resize', resizeCanvas);
  }, []);

  useEffect(() => {
    drawWires();
  }, [connections]);

  const resizeCanvas = () => {
    const canvas = canvasRef.current;
    const board = document.querySelector('.wire-board');
    if (!canvas || !board) return;
    canvas.width = board.clientWidth;
    canvas.height = board.clientHeight;
    drawWires();
  };

  const getTerminalCenter = (terminal: HTMLElement) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = terminal.getBoundingClientRect();
    const boardRect = canvas.getBoundingClientRect();
    return {
      x: rect.left - boardRect.left + rect.width / 2,
      y: rect.top - boardRect.top + rect.height / 2
    };
  };

  const drawWires = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.lineWidth = 8;
    ctx.lineCap = 'round';

    for (const startId in connections) {
      const endId = connections[startId];
      const startTerminal = document.querySelector(`#left-terminals .terminal[data-id='${startId}']`) as HTMLElement;
      const endTerminal = document.querySelector(`#right-terminals .terminal[data-id='${endId}']`) as HTMLElement;
      if (!startTerminal || !endTerminal) continue;

      const startPos = getTerminalCenter(startTerminal);
      const endPos = getTerminalCenter(endTerminal);

      ctx.strokeStyle = '#6a7e99';
      ctx.beginPath();
      ctx.moveTo(startPos.x, startPos.y);
      ctx.lineTo(endPos.x, endPos.y);
      ctx.stroke();
    }
  };

  const handleSubmitX = () => {
    const value = parseInt(xValue);
    if (value === D2_CORRECT) {
      setXMessage({ text: "✅ Correct! D2 Found.", success: true });
      sessionStorage.setItem('d2_solved', 'true');
      setD2Solved(true);
      setD2Value(String(D2_CORRECT));
      setTimeout(() => {
        setD2Popup(false);
        setXValue("");
        setXMessage({ text: "", success: false });
      }, 1500);
    } else {
      setXMessage({ text: "❌ Incorrect value. Try again.", success: false });
      setXValue("");
    }
  };

  const handleLeftTerminal = (id: string) => {
    if (connections[id]) {
      const newConn = { ...connections };
      delete newConn[id];
      setConnections(newConn);
    }
    if (selectedTerminal === id) {
      setSelectedTerminal(null);
    } else {
      setSelectedTerminal(id);
    }
  };

  const handleRightTerminal = (id: string) => {
    if (selectedTerminal) {
      const newConn = { ...connections, [selectedTerminal]: id };
      setConnections(newConn);
      setSelectedTerminal(null);

      if (Object.keys(newConn).length === 4) {
        checkSolution(newConn);
      }
    }
  };

  const checkSolution = (conn: Record<string, string>) => {
    const correct = JSON.stringify(conn, Object.keys(conn).sort()) === JSON.stringify(solution, Object.keys(solution).sort());
    
    if (correct) {
      setWireStatus('✅ System Calibrated!');
      sessionStorage.setItem('d3_solved', 'true');
      setTimeout(() => {
        setView('main');
        setD3Solved(true);
        setD3Value(String(D3_VALUE));
        setWireStatus("");
      }, 2000);
    } else {
      setWireStatus('❌ Connection Error! Resetting...');
      setTimeout(() => {
        setConnections({});
        setWireStatus("");
      }, 2000);
    }
  };

  const assembledCode = () => {
    if (d2Value !== '—' && d3Value !== '—') {
      return `8${d2Value}${d3Value}5`;
    }
    return '—';
  };

  const copyCode = () => {
    const code = assembledCode();
    if (code === '—') {
      toast.error('Code not fully assembled yet.');
      return;
    }
    navigator.clipboard?.writeText(code).then(
      () => toast.success('Code copied: ' + code),
      () => toast.error('Copy failed — code: ' + code)
    );
  };

  const resetProgress = () => {
    if (confirm('Are you sure you want to reset your progress?')) {
      sessionStorage.clear();
      window.location.reload();
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handlePasscodeSubmit = () => {
    const correctPasscode = assembledCode();
    if (correctPasscode === '—') {
      setPasscodeMessage({ text: "❌ Solve D2 and D3 puzzles first!", success: false });
      return;
    }
    
    if (passcodeInput === correctPasscode) {
      setPasscodeMessage({ text: "✅ Correct! Access Granted!", success: true });
      toast.success("Passcode verified! Access granted!");
      setTimeout(() => {
        setPasscodeMessage({ text: "", success: false });
        setPasscodeInput("");
      }, 2000);
    } else {
      setPasscodeMessage({ text: "❌ Incorrect passcode. Try again.", success: false });
      setTimeout(() => {
        setPasscodeMessage({ text: "", success: false });
      }, 2000);
    }
  };

  return (
    <div style={{ 
      margin: 0, 
      background: 'linear-gradient(180deg,#041226 0%,#071226 100%)', 
      color: '#e6eef8', 
      minHeight: '100vh', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center', 
      padding: '20px',
      fontFamily: 'Inter, ui-sans-serif, system-ui, Segoe UI, Roboto, Helvetica Neue, Arial'
    }}>
      {view === 'landing' ? (
        <div style={{
          width: '100%',
          maxWidth: '600px',
          background: 'linear-gradient(180deg, rgba(255,255,255,0.02), transparent)',
          borderRadius: '12px',
          padding: '40px',
          boxShadow: '0 8px 30px rgba(4,10,20,0.7)',
          textAlign: 'center'
        }}>
          <div style={{
            width: '80px',
            height: '80px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'rgba(125,211,252,0.1)',
            border: '2px solid rgba(125,211,252,0.3)',
            borderRadius: '8px',
            padding: '8px',
            margin: '0 auto 24px'
          }}>
            <div style={{ fontSize: '11px', color: '#9ca3af', marginBottom: '2px' }}>TIME</div>
            <div style={{ fontSize: '20px', fontWeight: 'bold', color: timeRemaining < 300 ? '#ef4444' : '#7dd3fc', fontFamily: 'monospace' }}>
              {formatTime(timeRemaining)}
            </div>
          </div>
          <h1 style={{ fontSize: '32px', margin: '0 0 16px', color: '#7dd3fc' }}>Code of Silence</h1>
          <p style={{ fontSize: '16px', color: '#9ca3af', marginBottom: '32px' }}>
            Access the forensic investigation system to uncover hidden clues and solve the mystery.
          </p>
          <button
            onClick={() => setView('folders')}
            style={{
              background: 'linear-gradient(180deg,rgba(125,211,252,0.2),rgba(125,211,252,0.1))',
              border: '1px solid rgba(125,211,252,0.3)',
              color: '#7dd3fc',
              padding: '16px 32px',
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: 600,
              fontSize: '18px',
              width: '100%',
              maxWidth: '300px'
            }}
          >
            Enter Investigation
          </button>
        </div>
      ) : view === 'folders' ? (
        <div style={{
          width: '100%',
          maxWidth: '800px',
          background: 'linear-gradient(180deg, rgba(255,255,255,0.02), transparent)',
          borderRadius: '12px',
          padding: '30px',
          boxShadow: '0 8px 30px rgba(4,10,20,0.7)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
            <h1 style={{ fontSize: '24px', margin: 0, color: '#7dd3fc' }}>Investigation Files</h1>
            <div style={{
              width: '80px',
              height: '60px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              background: 'rgba(125,211,252,0.1)',
              border: '2px solid rgba(125,211,252,0.3)',
              borderRadius: '8px',
              padding: '4px'
            }}>
              <div style={{ fontSize: '10px', color: '#9ca3af', marginBottom: '2px' }}>TIME</div>
              <div style={{ fontSize: '16px', fontWeight: 'bold', color: timeRemaining < 300 ? '#ef4444' : '#7dd3fc', fontFamily: 'monospace' }}>
                {formatTime(timeRemaining)}
              </div>
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '24px' }}>
            {[
              { name: "Dr. Verma's Office", icon: "📁", desc: "Personal files and notes" },
              { name: "Research Lab", icon: "🔬", desc: "Experimental data" },
              { name: "Archives", icon: "📚", desc: "Historical records" },
              { name: "Server Files", icon: "💾", desc: "Digital evidence", active: true }
            ].map((folder, idx) => (
              <div
                key={idx}
                onClick={() => folder.active && setView('main')}
                style={{
                  background: folder.active ? 'rgba(125,211,252,0.05)' : 'rgba(255,255,255,0.02)',
                  border: `1px solid ${folder.active ? 'rgba(125,211,252,0.2)' : 'rgba(255,255,255,0.05)'}`,
                  borderRadius: '8px',
                  padding: '20px',
                  cursor: folder.active ? 'pointer' : 'not-allowed',
                  opacity: folder.active ? 1 : 0.5,
                  transition: 'all 0.2s',
                  textAlign: 'center'
                }}
              >
                <div style={{ fontSize: '48px', marginBottom: '8px' }}>{folder.icon}</div>
                <div style={{ fontSize: '16px', fontWeight: 600, color: '#7dd3fc', marginBottom: '4px' }}>{folder.name}</div>
                <div style={{ fontSize: '13px', color: '#9ca3af' }}>{folder.desc}</div>
                {folder.active && <div style={{ marginTop: '8px', fontSize: '12px', color: '#34d399' }}>✓ Available</div>}
                {!folder.active && <div style={{ marginTop: '8px', fontSize: '12px', color: '#ef4444' }}>🔒 Locked</div>}
              </div>
            ))}
          </div>
          <button
            onClick={() => setView('landing')}
            style={{
              background: 'transparent',
              border: '1px dashed rgba(255,255,255,0.2)',
              color: '#9ca3af',
              padding: '12px 24px',
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: 600,
              fontSize: '14px'
            }}
          >
            ← Back to Main Menu
          </button>
        </div>
      ) : view === 'main' ? (
        <main style={{ 
          width: '100%', 
          maxWidth: '980px', 
          background: 'linear-gradient(180deg, rgba(255,255,255,0.02), transparent)', 
          borderRadius: '12px', 
          padding: '20px', 
          boxShadow: '0 8px 30px rgba(4,10,20,0.7)' 
        }}>
          <header style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div style={{ 
                width: '80px', 
                height: '80px', 
                display: 'flex', 
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'rgba(125,211,252,0.1)',
                border: '2px solid rgba(125,211,252,0.3)',
                borderRadius: '8px',
                padding: '8px'
              }}>
                <div style={{ fontSize: '11px', color: '#9ca3af', marginBottom: '2px' }}>TIME</div>
                <div style={{ fontSize: '20px', fontWeight: 'bold', color: timeRemaining < 300 ? '#ef4444' : '#7dd3fc', fontFamily: 'monospace' }}>
                  {formatTime(timeRemaining)}
                </div>
              </div>
              <div>
                <h1 style={{ fontSize: '20px', margin: 0, color: '#7dd3fc' }}>Server Files - Map Mystery</h1>
                <div style={{ fontSize: '13px', color: '#9ca3af' }}>Use the map and wiring layout to extract two passcode digits.</div>
              </div>
            </div>
            <button
              onClick={() => setView('folders')}
              style={{
                background: 'transparent',
                border: '1px dashed rgba(255,255,255,0.2)',
                color: '#9ca3af',
                padding: '8px 16px',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: 600
              }}
            >
              ← Back
            </button>
          </header>
          <section style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: '18px' }}>
            <div style={{ background: '#0b1724', padding: '14px', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.03)' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', alignItems: 'center' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center' }}>
                  <strong>Map: Lab Layout</strong>
                  <div style={{ fontSize: '13px', color: '#9ca3af' }}>
                    {d2Solved ? "D2 (X value) confirmed." : "Tip: click the 'X' in the Server Room"}
                  </div>
                </div>
                <div style={{ position: 'relative', width: '100%', maxWidth: '560px' }}>
                  <img src="/map.png" alt="Lab Layout Map" style={{ 
                    width: '100%', 
                    borderRadius: '8px', 
                    border: '2px solid rgba(125,211,252,0.08)', 
                    background: 'rgba(255,255,255,0.03)', 
                    padding: '8px' 
                  }} />
                  {!d2Solved && (
                    <button 
                      onClick={() => setD2Popup(true)}
                      style={{
                        position: 'absolute',
                        left: '65.678%',
                        top: '22.04%',
                        width: '8.99%',
                        height: '13.3%',
                        background: 'transparent',
                        borderRadius: '50%',
                        border: 'none',
                        cursor: 'pointer',
                        zIndex: 2
                      }}
                      aria-label="Enter value for X in Server Room"
                    />
                  )}
                </div>
                <p style={{ fontSize: '14px', color: '#9ca3af', lineHeight: '1.45' }}>
                  <strong>Actions:</strong> Enter the correct value for 'X' in the Server Room to reveal D2. For D3, launch the calibration task and follow the sabotage clue to fix the connections.
                </p>
                {d2Solved && (
                  <div style={{ 
                    marginTop: '12px', 
                    background: 'rgba(255,255,255,0.02)', 
                    padding: '10px', 
                    borderRadius: '8px', 
                    border: '1px solid rgba(255,255,255,0.02)' 
                  }}>
                    D2 (X value): <span style={{ 
                      display: 'inline-block', 
                      minWidth: '36px', 
                      textAlign: 'center', 
                      padding: '8px 10px', 
                      borderRadius: '6px', 
                      background: 'rgba(255,255,255,0.02)', 
                      border: '1px solid rgba(255,255,255,0.03)', 
                      marginRight: '8px', 
                      fontWeight: 700, 
                      fontSize: '16px', 
                      color: '#fff' 
                    }}>{d2Value}</span>
                  </div>
                )}
              </div>
            </div>
            <aside style={{ background: '#0b1724', padding: '14px', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.03)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <strong>System Calibration Unit</strong>
                  <div style={{ fontSize: '13px', color: '#9ca3af', marginTop: '8px' }}>Launch the interactive task to get D3.</div>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginTop: '12px', justifyContent: 'center', padding: '20px 0' }}>
                {!d3Solved && (
                  <button 
                    onClick={() => setView('wire')}
                    style={{
                      background: 'linear-gradient(180deg,rgba(255,255,255,0.02),rgba(255,255,255,0.01))',
                      border: '1px solid rgba(255,255,255,0.04)',
                      color: '#7dd3fc',
                      padding: '12px 18px',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      fontWeight: 600,
                      fontSize: '16px'
                    }}
                  >
                    Launch System Calibration
                  </button>
                )}
              </div>
              {d3Solved && (
                <div style={{ 
                  marginTop: '12px', 
                  background: 'rgba(255,255,255,0.02)', 
                  padding: '10px', 
                  borderRadius: '8px', 
                  border: '1px solid rgba(255,255,255,0.02)' 
                }}>
                  Status: <span style={{ fontWeight: 700, color: '#34d399' }}>✅ System Calibrated Successfully</span><br />
                  Computed D3: <span style={{ 
                    display: 'inline-block', 
                    minWidth: '36px', 
                    textAlign: 'center', 
                    padding: '8px 10px', 
                    borderRadius: '6px', 
                    background: 'rgba(255,255,255,0.02)', 
                    border: '1px solid rgba(255,255,255,0.03)', 
                    marginRight: '8px', 
                    fontWeight: 700, 
                    fontSize: '16px', 
                    color: '#fff' 
                  }}>{d3Value}</span>
                </div>
              )}
              <div style={{ marginTop: '20px', textAlign: 'center' }}>
                <button 
                  onClick={resetProgress}
                  style={{
                    background: 'transparent',
                    borderStyle: 'dashed',
                    border: '1px solid rgba(255,255,255,0.04)',
                    color: '#9ca3af',
                    padding: '12px 18px',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontWeight: 600,
                    fontSize: '16px'
                  }}
                >
                  Reset Progress
                </button>
              </div>
              <div style={{ marginTop: '8px' }}>
                <strong>Passcode Builder</strong>
                <div style={{ 
                  marginTop: '8px', 
                  background: 'rgba(255,255,255,0.02)', 
                  padding: '10px', 
                  borderRadius: '8px', 
                  border: '1px solid rgba(255,255,255,0.02)' 
                }}>
                  D1 and D4: <strong>You already know it!!</strong><br />
                  D2 (map): <span style={{ 
                    display: 'inline-block', 
                    minWidth: '36px', 
                    textAlign: 'center', 
                    padding: '8px 10px', 
                    borderRadius: '6px', 
                    background: 'rgba(255,255,255,0.02)', 
                    border: '1px solid rgba(255,255,255,0.03)', 
                    marginRight: '8px', 
                    fontWeight: 700, 
                    fontSize: '16px', 
                    color: '#fff' 
                  }}>{d2Value}</span><br />
                  D3 (wires): <span style={{ 
                    display: 'inline-block', 
                    minWidth: '36px', 
                    textAlign: 'center', 
                    padding: '8px 10px', 
                    borderRadius: '6px', 
                    background: 'rgba(255,255,255,0.02)', 
                    border: '1px solid rgba(255,255,255,0.03)', 
                    marginRight: '8px', 
                    fontWeight: 700, 
                    fontSize: '16px', 
                    color: '#fff' 
                  }}>{d3Value}</span>
                  <div style={{ marginTop: '8px' }}>
                    <strong>Current assembled code:</strong> <span style={{ fontSize: '18px', fontWeight: 800, color: '#7dd3fc' }}>{assembledCode()}</span>
                  </div>
                  <div style={{ marginTop: '8px' }}>
                    <button 
                      onClick={copyCode}
                      style={{
                        background: 'linear-gradient(180deg,rgba(255,255,255,0.02),rgba(255,255,255,0.01))',
                        border: '1px solid rgba(255,255,255,0.04)',
                        color: '#7dd3fc',
                        padding: '12px 18px',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        fontWeight: 600,
                        fontSize: '16px'
                      }}
                    >
                      Copy code to clipboard
                    </button>
                  </div>
                </div>
                <div style={{ marginTop: '16px', paddingTop: '16px', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                  <strong>Enter 4-Digit Passcode:</strong>
                  <div style={{ marginTop: '8px', display: 'flex', gap: '8px', alignItems: 'center' }}>
                    <input
                      type="text"
                      value={passcodeInput}
                      onChange={(e) => {
                        const value = e.target.value.replace(/\D/g, '').slice(0, 4);
                        setPasscodeInput(value);
                      }}
                      onKeyUp={(e) => e.key === 'Enter' && passcodeInput.length === 4 && handlePasscodeSubmit()}
                      placeholder="8745"
                      maxLength={4}
                      style={{
                        flex: 1,
                        padding: '10px',
                        border: '1px solid rgba(255,255,255,0.1)',
                        background: '#071827',
                        color: 'white',
                        borderRadius: '6px',
                        fontSize: '18px',
                        textAlign: 'center',
                        fontFamily: 'monospace',
                        letterSpacing: '4px'
                      }}
                    />
                    <button 
                      onClick={handlePasscodeSubmit}
                      disabled={passcodeInput.length !== 4}
                      style={{
                        background: passcodeInput.length === 4 ? 'linear-gradient(180deg,rgba(125,211,252,0.2),rgba(125,211,252,0.1))' : 'rgba(255,255,255,0.02)',
                        border: '1px solid rgba(255,255,255,0.04)',
                        color: passcodeInput.length === 4 ? '#7dd3fc' : '#9ca3af',
                        padding: '10px 16px',
                        borderRadius: '6px',
                        cursor: passcodeInput.length === 4 ? 'pointer' : 'not-allowed',
                        fontWeight: 600,
                        fontSize: '14px',
                        opacity: passcodeInput.length === 4 ? 1 : 0.5
                      }}
                    >
                      Verify
                    </button>
                  </div>
                  {passcodeMessage.text && (
                    <div style={{ 
                      marginTop: '8px', 
                      fontWeight: 'bold', 
                      fontSize: '14px',
                      color: passcodeMessage.success ? '#34d399' : '#ef4444',
                      textAlign: 'center' 
                    }}>
                      {passcodeMessage.text}
                    </div>
                  )}
                </div>
              </div>
            </aside>
          </section>
        </main>
      ) : (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%' }}>
          <div style={{
            backgroundColor: '#0b1724',
            borderRadius: '12px',
            padding: '24px',
            boxShadow: '0 8px 30px rgba(4, 10, 20, 0.7)',
            width: '90%',
            maxWidth: '600px',
            textAlign: 'center'
          }}>
            <h1 style={{ color: '#7dd3fc', marginTop: 0 }}>System Rerouting Required</h1>
            <p>A power surge crossed critical connections. Re-establish the correct pathways.</p>
            <div style={{
              fontSize: '14px',
              color: '#9ca3af',
              background: 'rgba(0,0,0,0.2)',
              padding: '10px',
              borderRadius: '6px',
              marginTop: '15px',
              border: '1px solid rgba(255,255,255,0.05)',
              lineHeight: '1.5'
            }}>
              <strong>Numbering of wires for rooms:</strong><br />
              1 for Conference room, 2 for lounge, 3 for lab bench, 4 for desk area
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', alignItems: 'center', marginTop: '20px', marginBottom: '10px', maxWidth: '450px', margin: '20px auto 10px' }}>
              <img src="/map.png" alt="Reference Map" style={{ 
                width: '100%', 
                borderRadius: '8px', 
                border: '2px solid rgba(125,211,252,0.08)', 
                background: 'rgba(255,255,255,0.03)', 
                padding: '8px' 
              }} />
            </div>
            <div className="wire-board" style={{
              display: 'flex',
              justifyContent: 'space-between',
              position: 'relative',
              padding: '20px 0',
              marginTop: '20px'
            }}>
              <div id="left-terminals" style={{ display: 'flex', flexDirection: 'column', gap: '40px' }}>
                {['1', '2', '3', '4'].map(id => (
                  <div
                    key={`left-${id}`}
                    className="terminal"
                    data-id={id}
                    onClick={() => handleLeftTerminal(id)}
                    style={{
                      width: '50px',
                      height: '50px',
                      backgroundColor: '#071827',
                      border: `2px solid ${selectedTerminal === id ? '#7dd3fc' : '#9ca3af'}`,
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '20px',
                      fontWeight: 'bold',
                      color: '#7dd3fc',
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                      userSelect: 'none',
                      boxShadow: selectedTerminal === id ? '0 0 15px #7dd3fc' : 'none',
                      transform: selectedTerminal === id ? 'scale(1.1)' : 'scale(1)'
                    }}
                  >
                    {id}
                  </div>
                ))}
              </div>
              <canvas ref={canvasRef} style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none' }} />
              <div id="right-terminals" style={{ display: 'flex', flexDirection: 'column', gap: '40px' }}>
                {['1', '2', '3', '4'].map(id => (
                  <div
                    key={`right-${id}`}
                    className="terminal"
                    data-id={id}
                    onClick={() => handleRightTerminal(id)}
                    style={{
                      width: '50px',
                      height: '50px',
                      backgroundColor: '#071827',
                      border: '2px solid #9ca3af',
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '20px',
                      fontWeight: 'bold',
                      color: '#7dd3fc',
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                      userSelect: 'none'
                    }}
                  >
                    {id}
                  </div>
                ))}
              </div>
            </div>
            <div style={{ fontSize: '13px', color: '#9ca3af', marginTop: '15px' }}>
              Note: Select a terminal on the <strong>left</strong>, then select a terminal on the <strong>right</strong> to connect the wire.
            </div>
            <div style={{ fontSize: '13px', color: '#9ca3af', marginTop: '5px' }}>
              Tip: Remember, not all wires that connect are straight!
            </div>
            <div style={{ marginTop: '15px', fontSize: '18px', fontWeight: 'bold', height: '30px', color: wireStatus.includes('✅') ? '#34d399' : '#ef4444' }}>
              {wireStatus}
            </div>
          </div>
        </div>
      )}

      {d2Popup && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          background: 'rgba(0,0,0,0.7)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div style={{
            background: '#0b1724',
            padding: '30px',
            borderRadius: '12px',
            boxShadow: '0 10px 40px rgba(0,0,0,0.5)',
            textAlign: 'center',
            width: '90%',
            maxWidth: '400px'
          }}>
            <h2 style={{ color: '#7dd3fc', marginTop: 0 }}>Enter the value of 'X' to find D2</h2>
            <input
              type="number"
              value={xValue}
              onChange={(e) => setXValue(e.target.value)}
              onKeyUp={(e) => e.key === 'Enter' && handleSubmitX()}
              placeholder="Value of X"
              autoFocus
              style={{
                width: 'calc(100% - 20px)',
                padding: '10px',
                margin: '15px 0',
                border: '1px solid rgba(255,255,255,0.1)',
                background: '#071827',
                color: 'white',
                borderRadius: '6px',
                fontSize: '18px',
                textAlign: 'center'
              }}
            />
            {xMessage.text && (
              <div style={{ marginTop: '10px', fontWeight: 'bold', color: xMessage.success ? '#34d399' : '#ef4444' }}>
                {xMessage.text}
              </div>
            )}
            <button 
              onClick={handleSubmitX}
              style={{
                marginTop: '10px',
                background: 'linear-gradient(180deg,rgba(255,255,255,0.02),rgba(255,255,255,0.01))',
                border: '1px solid rgba(255,255,255,0.04)',
                color: '#7dd3fc',
                padding: '12px 18px',
                borderRadius: '8px',
                cursor: 'pointer',
                fontWeight: 600,
                fontSize: '16px',
                marginRight: '8px'
              }}
            >
              Submit
            </button>
            <button 
              onClick={() => setD2Popup(false)}
              style={{
                marginTop: '10px',
                backgroundColor: '#ef4444',
                color: 'white',
                border: '1px solid rgba(255,255,255,0.1)',
                padding: '12px 18px',
                borderRadius: '8px',
                cursor: 'pointer',
                fontWeight: 600,
                fontSize: '16px'
              }}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CodeOfSilence;
