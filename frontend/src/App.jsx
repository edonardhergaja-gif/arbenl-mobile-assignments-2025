import React, { useState, useEffect } from 'react';

function App() {
  const [settings, setSettings] = useState(null);

  // Marrim të dhënat e para nga Node.js kur hapet faqja
  useEffect(() => {
    fetch('http://localhost:5000/api/settings')
      .then(res => res.json())
      .then(data => setSettings(data))
      .catch(err => console.error("Gabim gjatë marrjes së të dhënave:", err));
  }, []);

  // Funksioni që dërgon komandat te Node.js pa bërë refresh faqja
  const handleAction = (actionName) => {
    fetch('http://localhost:5000/api/action', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: actionName })
    })
    .then(res => res.json())
    .then(data => setSettings(data));
  };

  if (!settings) {
    return <div style={{ textAlign: 'center', marginTop: '50px', fontSize: '20px' }}>Po ngarkohet simulatori Blue-Green...</div>;
  }

  return (
    <div style={{ fontFamily: 'Segoe UI, sans-serif', maxWidth: '900px', margin: '40px auto', background: '#ffffff', padding: '30px', borderRadius: '12px', boxShadow: '0 4px 15px rgba(0,0,0,0.1)' }}>
      <h2 style={{ textAlign: 'center', color: '#2d3748', marginBottom: '30px' }}>Simuluesi i Blue-Green Deployment (React + Node.js)</h2>

      {/* Ambientet Vizuale */}
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '30px' }}>
        {/* Blue Env */}
        <div style={{ flex: '1', marginRight: '15px', padding: '25px', borderRadius: '10px', textAlign: 'center', transition: '0.3s', background: settings.blue_traffic_percent > 0 ? '#ebf8ff' : '#f7fafc', border: settings.blue_traffic_percent > 0 ? '2px solid #3182ce' : '2px dashed #cbd5e0', opacity: settings.blue_traffic_percent > 0 ? '1' : '0.5' }}>
          <h3 style={{ color: '#2b6cb0', margin: '0 0 10px 0' }}>AMBIENTI BLUE (V1.0)</h3>
          <p style={{ fontSize: '24px', fontWeight: 'bold', margin: '10px 0' }}>Trafiku: {settings.blue_traffic_percent}%</p>
          <span style={{ padding: '5px 10px', borderRadius: '15px', fontSize: '12px', fontWeight: 'bold', background: settings.active_environment === 'blue' ? '#48bb78' : '#cbd5e0', color: 'white' }}>
            {settings.active_environment === 'blue' ? '🟢 LIVE (Aktiv)' : 'Gati (Standby)'}
          </span>
        </div>

        {/* Green Env */}
        <div style={{ flex: '1', marginLeft: '15px', padding: '25px', borderRadius: '10px', textAlign: 'center', transition: '0.3s', background: settings.green_traffic_percent > 0 ? '#f0fff4' : '#f7fafc', border: settings.green_traffic_percent > 0 ? '2px solid #38a169' : '2px dashed #cbd5e0', opacity: settings.green_traffic_percent > 0 ? '1' : '0.5' }}>
          <h3 style={{ color: '#276749', margin: '0 0 10px 0' }}>AMBIENTI GREEN (V2.0)</h3>
          <p style={{ fontSize: '24px', fontWeight: 'bold', margin: '10px 0' }}>Trafiku: {settings.green_traffic_percent}%</p>
          <span style={{ padding: '5px 10px', borderRadius: '15px', fontSize: '12px', fontWeight: 'bold', background: settings.active_environment === 'green' ? '#48bb78' : '#a0aec0', color: 'white' }}>
            {settings.active_environment === 'green' ? '🟢 LIVE (Aktiv)' : 'Staging (Në Pritje)'}
          </span>
        </div>
      </div>

      {/* Paneli i Butonave */}
      <div style={{ display: 'flex', justifyContent: 'space-around', flexWrap: 'wrap', background: '#f7fafc', padding: '20px', borderRadius: '10px', marginBottom: '30px', border: '1px solid #e2e8f0' }}>
        <button onClick={() => handleAction('canary_deploy')} style={{ padding: '12px 20px', background: '#3182ce', color: 'white', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer', margin: '5px' }}>1. Canary Deploy (20%)</button>
        <button onClick={() => handleAction('switch_to_green')} style={{ padding: '12px 20px', background: '#38a169', color: 'white', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer', margin: '5px' }}>2. Kalimi i Plotë (100% Green)</button>
        <button onClick={() => handleAction('simulo_gabim')} style={{ padding: '12px 20px', background: '#e53e3e', color: 'white', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer', margin: '5px' }}>🚨 Simulo Gabime</button>
        <button onClick={() => handleAction('rollback')} style={{ padding: '12px 20px', background: '#d69e2e', color: 'white', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer', margin: '5px' }}>⏪ ROLLBACK</button>
      </div>

      {/* Monitorimi */}
      <div style={{ padding: '20px', borderRadius: '10px', border: '1px solid', borderColor: settings.green_version_errors > 10 ? '#feb2b2' : '#e2e8f0', background: settings.green_version_errors > 10 ? '#fff5f5' : '#fff' }}>
        <h3 style={{ margin: '0 0 10px 0', color: '#4a5568' }}>📊 DevOps Metrics & Monitorimi</h3>
        <p style={{ margin: '5px 0' }}>Gabimet e zbuluara në Versionin e Ri: <strong style={{ color: settings.green_version_errors > 0 ? '#e53e3e' : '#2d3748' }}>{settings.green_version_errors} kërkesa</strong></p>
        {settings.green_version_errors > 10 ? (
          <div style={{ marginTop: '10px', padding: '10px', background: '#fed7d7', color: '#9b2c2c', borderRadius: '5px', fontWeight: 'bold' }}>
            ⚠️ ALERT KRITIK: Shkalla e gabimeve është e lartë! Kliko butonin ROLLBACK për të shpëtuar sistemin.
          </div>
        ) : (
          <p style={{ color: '#38a169', fontWeight: 'bold', margin: '10px 0 0 0' }}>✅ Sistemi është në gjendje stabile.</p>
        )}
      </div>
    </div>
  );
}

export default App;