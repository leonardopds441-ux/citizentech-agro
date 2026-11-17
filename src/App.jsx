import { useEffect, useMemo, useState } from 'react';

const STORE = {
  readings: 'ctagro_readings_v1',
  requests: 'ctagro_requests_v1',
  notes: 'ctagro_notes_v1',
  session: 'ctagro_demo_session_v1'
};
const ROUTES = ['/dashboard', '/sensores', '/solicitacoes', '/historico'];
const initialReadings = [
  { id: 'r-1', site: 'Horta comunitária · Canteiro A', moisture: 42, temp: 25.8, ph: 6.4, at: '2026-11-17T14:15:00.000Z', source: 'Demonstração' },
  { id: 'r-2', site: 'Horta comunitária · Canteiro B', moisture: 29, temp: 30.2, ph: 5.3, at: '2026-11-17T13:40:00.000Z', source: 'Demonstração' },
  { id: 'r-3', site: 'Horta escolar · Canteiro 1', moisture: 61, temp: 22.1, ph: 6.8, at: '2026-11-17T12:55:00.000Z', source: 'Demonstração' }
];
const initialRequests = [
  { id: 'q-1', title: 'Solo seco no canteiro B', category: 'Irrigação', site: 'Horta comunitária · Canteiro B', details: 'A leitura simulada indicou umidade abaixo da faixa de referência.', status: 'Em análise', at: '2026-11-17T13:45:00.000Z' },
  { id: 'q-2', title: 'Dúvida sobre pH do solo', category: 'Solo', site: 'Horta escolar · Canteiro 1', details: 'Solicitação criada para demonstrar o fluxo de atendimento.', status: 'Orientação disponível', at: '2026-11-16T15:20:00.000Z' }
];

function readStore(key, fallback) {
  try {
    const value = localStorage.getItem(key);
    return value ? JSON.parse(value) : fallback;
  } catch { return fallback; }
}
function writeStore(key, value) {
  try { localStorage.setItem(key, JSON.stringify(value)); return true; }
  catch { return false; }
}
function formatDate(value) {
  return new Intl.DateTimeFormat('pt-BR', { dateStyle: 'short', timeStyle: 'short' }).format(new Date(value));
}
function getAdvice(reading) {
  const notes = [];
  if (reading.moisture < 35) notes.push('A umidade está abaixo da faixa de referência deste protótipo. Considere verificar a necessidade de irrigação do canteiro.');
  if (reading.moisture > 75) notes.push('A umidade está alta para a faixa de referência deste protótipo. Verifique drenagem e condições do solo.');
  if (reading.temp > 32) notes.push('A temperatura simulada está elevada. Observe o canteiro e considere reduzir a exposição ao sol nos horários mais quentes.');
  if (reading.ph < 5.5) notes.push('O pH simulado está abaixo da faixa de referência. Solicite uma avaliação técnica antes de corrigir o solo.');
  if (reading.ph > 7.5) notes.push('O pH simulado está acima da faixa de referência. Uma análise técnica pode orientar o manejo adequado.');
  if (!notes.length) notes.push('Os valores simulados estão dentro das faixas de referência deste protótipo. Continue acompanhando as próximas leituras.');
  return notes;
}
function getState(reading) {
  if (reading.moisture < 35 || reading.moisture > 75 || reading.ph < 5.5 || reading.ph > 7.5 || reading.temp > 32) return 'Atenção';
  return 'Estável';
}
function Logo({ small = false }) {
  return <div className={`brand ${small ? 'brand-small' : ''}`} aria-label="CitizenTech Agro"><span className="brand-mark" aria-hidden="true">✳</span><span>civic<span className="brand-light">grove</span></span></div>;
}
function Icon({ name }) {
  const paths = {
    grid: <><rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/></>,
    sensor: <><path d="M12 3v3"/><circle cx="12" cy="12" r="3"/><path d="M5.6 5.6a9 9 0 0 0 0 12.8M18.4 5.6a9 9 0 0 1 0 12.8M8.4 8.4a5 5 0 0 0 0 7.2m7.2-7.2a5 5 0 0 1 0 7.2"/></>,
    request: <><path d="M8 6h13M8 12h13M8 18h13"/><path d="M3 6h.01M3 12h.01M3 18h.01"/></>,
    history: <><path d="M3 12a9 9 0 1 0 2.6-6.4L3 8"/><path d="M3 3v5h5M12 7v5l3 2"/></>,
    arrow: <><path d="M5 12h14M13 6l6 6-6 6"/></>,
    plus: <><path d="M12 5v14M5 12h14"/></>,
    logout: <><path d="M10 17l5-5-5-5M15 12H3"/><path d="M12 3h6a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-6"/></>,
    leaf: <><path d="M20 4c-7 0-13 2-13 9a7 7 0 0 0 7 7c7 0 9-9 6-16Z"/><path d="M4 21c3-6 7-9 13-12"/></>,
    water: <><path d="M12 3.5S5.5 11 5.5 15.5a6.5 6.5 0 0 0 13 0C18.5 11 12 3.5 12 3.5Z"/><path d="M9 16a3 3 0 0 0 3 3"/></>,
    sun: <><circle cx="12" cy="12" r="4"/><path d="M12 2v2m0 16v2M4.93 4.93l1.42 1.42m11.3 11.3 1.42 1.42M2 12h2m16 0h2M4.93 19.07l1.42-1.42m11.3-11.3 1.42-1.42"/></>,
    ph: <><path d="M8 3h8M10 3v6.5L5.8 17a2.7 2.7 0 0 0 2.3 4h7.8a2.7 2.7 0 0 0 2.3-4L14 9.5V3"/><path d="M8 15h8"/></>
  };
  return <svg className="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{paths[name] || paths.grid}</svg>;
}
function App() {
  const [path, setPath] = useState(window.location.pathname);
  const [signedIn, setSignedIn] = useState(() => sessionStorage.getItem(STORE.session) === 'active');
  const [displayName, setDisplayName] = useState(() => sessionStorage.getItem('ctagro_display_name') || 'Pessoa visitante');
  const [readings, setReadings] = useState(() => readStore(STORE.readings, initialReadings));
  const [requests, setRequests] = useState(() => readStore(STORE.requests, initialRequests));
  const [notice, setNotice] = useState('');
  const [showReadingForm, setShowReadingForm] = useState(false);
  const [showRequestForm, setShowRequestForm] = useState(false);
  const [filter, setFilter] = useState('Todas');
  const [lastUpdated, setLastUpdated] = useState(new Date());

  useEffect(() => {
    const onPop = () => setPath(window.location.pathname);
    window.addEventListener('popstate', onPop);
    return () => window.removeEventListener('popstate', onPop);
  }, []);
  useEffect(() => {
    if (!signedIn && path !== '/login') go('/login', true);
    if (signedIn && (path === '/' || path === '/login')) go('/dashboard', true);
  }, [signedIn]);
  useEffect(() => { writeStore(STORE.readings, readings); }, [readings]);
  useEffect(() => { writeStore(STORE.requests, requests); }, [requests]);

  function go(next, replace = false) {
    if (replace) history.replaceState({}, '', next); else history.pushState({}, '', next);
    setPath(next); setNotice(''); window.scrollTo(0, 0);
  }
  function navigate(event, next) { event.preventDefault(); go(next); }
  function login(event) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const name = String(data.get('name') || '').trim().slice(0, 48) || 'Pessoa visitante';
    sessionStorage.setItem(STORE.session, 'active');
    sessionStorage.setItem('ctagro_display_name', name);
    setDisplayName(name); setSignedIn(true); go('/dashboard', true);
  }
  function logout() {
    sessionStorage.removeItem(STORE.session); sessionStorage.removeItem('ctagro_display_name');
    setSignedIn(false); go('/login', true);
  }
  function addReading(event) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const reading = {
      id: `r-${crypto.randomUUID()}`,
      site: String(data.get('site')).trim().slice(0, 80),
      moisture: Number(data.get('moisture')),
      temp: Number(data.get('temp')),
      ph: Number(data.get('ph')),
      at: new Date().toISOString(), source: 'Entrada manual de demonstração'
    };
    setReadings(previous => [reading, ...previous]); setLastUpdated(new Date());
    setShowReadingForm(false); setNotice('Leitura de demonstração salva neste navegador.'); event.currentTarget.reset();
  }
  function addRequest(event) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const req = {
      id: `q-${crypto.randomUUID()}`,
      title: String(data.get('title')).trim().slice(0, 80),
      category: String(data.get('category')),
      site: String(data.get('site')).trim().slice(0, 80),
      details: String(data.get('details')).trim().slice(0, 500),
      status: 'Recebida', at: new Date().toISOString()
    };
    setRequests(previous => [req, ...previous]);
    setShowRequestForm(false); setNotice('Solicitação simulada registrada neste navegador.'); event.currentTarget.reset();
  }
  function simulateRefresh() {
    const newest = readings[0];
    const updated = { ...newest, id: `r-${crypto.randomUUID()}`, moisture: Math.max(18, Math.min(82, newest.moisture + Math.round(Math.random() * 12 - 6))), temp: Math.round((newest.temp + Math.random() * 2 - 1) * 10) / 10, at: new Date().toISOString(), source: 'Simulação de atualização' };
    setReadings(previous => [updated, ...previous]); setLastUpdated(new Date());
    setNotice('Nova leitura fictícia gerada para a demonstração. Nenhum sensor foi consultado.');
  }
  const activePage = path === '/' ? '/dashboard' : path;
  const sortedReadings = useMemo(() => [...readings].sort((a,b) => new Date(b.at)-new Date(a.at)), [readings]);
  const attentionCount = readings.filter(r => getState(r) === 'Atenção').length;
  const latest = sortedReadings[0] || initialReadings[0];
  const pageTitles = { '/dashboard': 'Visão geral', '/sensores': 'Leituras de sensores', '/solicitacoes': 'Solicitações', '/historico': 'Histórico e orientações' };

  if (path === '/login' || !signedIn) return <Login onSubmit={login} />;
  return <div className="app-shell">
    <a className="skip-link" href="#main">Pular para o conteúdo</a>
    <aside className="sidebar">
      <Logo />
      <div className="side-caption">ESPAÇO DE DEMONSTRAÇÃO</div>
      <nav aria-label="Navegação principal" className="nav-list">
        {[
          ['/dashboard', 'Visão geral', 'grid'], ['/sensores', 'Sensores', 'sensor'], ['/solicitacoes', 'Solicitações', 'request'], ['/historico', 'Histórico', 'history']
        ].map(([href, label, icon]) => <a key={href} className={`nav-link ${activePage === href ? 'active' : ''}`} href={href} onClick={e => navigate(e, href)} aria-current={activePage === href ? 'page' : undefined}><Icon name={icon}/><span>{label}</span>{href === '/solicitacoes' && requests.length > 0 && <span className="nav-count">{requests.length}</span>}</a>)}
      </nav>
      <div className="side-spacer" />
      <div className="side-ods"><div className="ods-row"><span className="ods-icon">2</span><span><b>ODS 2</b><small>Fome zero e agricultura sustentável</small></span></div><div className="ods-row"><span className="ods-icon blue">6</span><span><b>ODS 6</b><small>Água potável e saneamento</small></span></div></div>
      <button className="profile-button" onClick={logout}><span className="avatar">{displayName.slice(0,1).toUpperCase()}</span><span className="profile-copy"><b>{displayName}</b><small>Acesso demonstrativo</small></span><Icon name="logout"/></button>
    </aside>
    <div className="mobile-top"><Logo small/><button className="mobile-exit" onClick={logout}>Sair</button></div>
    <main id="main" className="main-area">
      <header className="topbar"><div><div className="breadcrumb">CitizenTech <span>/</span> Agro</div><h1>{pageTitles[activePage] || 'Visão geral'}</h1></div><div className="topbar-right"><span className="prototype-badge"><span className="pulse-dot"/>Protótipo acadêmico</span><span className="date-label">{new Intl.DateTimeFormat('pt-BR', { weekday:'long', day:'numeric', month:'long' }).format(new Date())}</span></div></header>
      {notice && <div role="status" className="toast"><span>✓</span>{notice}<button onClick={() => setNotice('')} aria-label="Fechar aviso">×</button></div>}
      <div className="demo-banner"><span className="banner-symbol">ⓘ</span><p><b>Dados simulados para demonstração.</b> Este protótipo não está conectado a sensores reais, não realiza medições em campo e não substitui orientação técnica.</p></div>
      {activePage === '/dashboard' && <Dashboard readings={sortedReadings} requests={requests} latest={latest} attentionCount={attentionCount} lastUpdated={lastUpdated} onRefresh={simulateRefresh} go={go} />}
      {activePage === '/sensores' && <Sensors readings={sortedReadings} onAdd={() => setShowReadingForm(true)} onRefresh={simulateRefresh} />}
      {activePage === '/solicitacoes' && <Requests requests={requests} filter={filter} setFilter={setFilter} onAdd={() => setShowRequestForm(true)} />}
      {activePage === '/historico' && <History readings={sortedReadings} requests={requests} />}
      <footer className="footer"><span>CitizenTech Agro · Front End &amp; Mobile Development · FIAP 2026.2</span><span>Informações fictícias armazenadas somente neste navegador.</span></footer>
    </main>
    {showReadingForm && <ReadingModal onClose={() => setShowReadingForm(false)} onSubmit={addReading} />}
    {showRequestForm && <RequestModal readings={sortedReadings} onClose={() => setShowRequestForm(false)} onSubmit={addRequest} />}
  </div>;
}

function Login({ onSubmit }) {
  return <main className="login-page"><section className="login-art" aria-label="Apresentação do protótipo"><div className="login-art-inner"><Logo/><div className="art-tag">TECNOLOGIA CÍVICA · AGRICULTURA URBANA</div><h1>Uma horta mais<br/><em>bem acompanhada.</em></h1><p>Um protótipo para aproximar cidadãos de informações sobre hortas comunitárias e apoiar decisões de cuidado.</p><div className="art-orbit"><span className="orbit orbit-one"/><span className="orbit orbit-two"/><span className="art-leaf">✳</span><span className="orbit-label label-one">umidade <b>42%</b></span><span className="orbit-label label-two">solo <b>estável</b></span><span className="orbit-label label-three">pH <b>6,4</b></span></div><div className="login-ods"><span>ODS 2</span><span>ODS 6</span><span>ODS 11</span><span>ODS 12</span></div></div></section><section className="login-form-section"><div className="login-card"><div className="login-mobile-logo"><Logo/></div><div className="eyebrow">ACESSO AO PROTÓTIPO</div><h2>Entrar na demonstração</h2><p className="login-intro">Use qualquer nome para visualizar o fluxo local. Nenhuma conta real será criada.</p><form onSubmit={onSubmit} className="stack-form"><label htmlFor="display-name">Como podemos chamar você?</label><input id="display-name" name="name" type="text" maxLength="48" autoComplete="nickname" placeholder="Ex.: Alex" required/><div className="local-note"><span>◉</span><span>O acesso é apenas local e demonstrativo. Não informe e-mail, senha ou dados pessoais reais.</span></div><button className="button button-primary button-wide" type="submit">Acessar demonstração <Icon name="arrow"/></button></form><div className="login-divider"><span>Sobre este projeto</span></div><p className="login-disclaimer">Projeto acadêmico FIAP. Leituras, solicitações e recomendações são exemplos fictícios; não há sensores ou serviços externos integrados.</p><div className="login-bottom"><span>© CitizenTech Agro 2026</span><span>Privacidade local</span></div></div></section></main>;
}

function Dashboard({ readings, requests, latest, attentionCount, lastUpdated, onRefresh, go }) {
  const latestAdvice = getAdvice(latest);
  return <div className="content-wrap">
    <section className="welcome-row"><div><p className="eyebrow">PAINEL DA COMUNIDADE</p><h2>Olá, vamos cuidar do que cresce?</h2><p>Acompanhe exemplos de leituras, registre uma solicitação e veja orientações demonstrativas.</p></div><button className="button button-secondary" onClick={onRefresh}><span className="refresh-icon">↻</span>Simular nova leitura</button></section>
    <div className="metrics-grid"><Metric icon="sensor" label="Leituras demonstrativas" value={readings.length} note="Neste navegador" color="green"/><Metric icon="water" label="Umidade mais recente" value={`${latest.moisture}%`} note={latest.site} color="blue"/><Metric icon="leaf" label="Pontos para acompanhar" value={attentionCount} note="Regra do protótipo" color="amber"/><Metric icon="request" label="Solicitações abertas" value={requests.filter(r => r.status !== 'Orientação disponível').length} note="Fluxo simulado" color="purple"/></div>
    <div className="dashboard-grid"><section className="panel readings-panel"><div className="panel-heading"><div><div className="eyebrow">MONITORAMENTO SIMULADO</div><h3>Leituras recentes</h3></div><a href="/sensores" onClick={e => { e.preventDefault(); go('/sensores'); }} className="text-link">Ver todas <Icon name="arrow"/></a></div><div className="table-wrap"><table><thead><tr><th scope="col">Ponto de leitura</th><th scope="col">Umidade</th><th scope="col">Temperatura</th><th scope="col">Condição</th></tr></thead><tbody>{readings.slice(0,4).map(r => <tr key={r.id}><td><b>{r.site}</b><small>{formatDate(r.at)}</small></td><td><span className="reading-number">{r.moisture}<small>%</small></span><div className="mini-bar"><span style={{width:`${r.moisture}%`}}/></div></td><td>{r.temp.toFixed(1).replace('.', ',')}°</td><td><Status value={getState(r)}/></td></tr>)}</tbody></table></div><div className="panel-foot"><span className="data-dot"/>Última atualização fictícia às {new Intl.DateTimeFormat('pt-BR',{hour:'2-digit',minute:'2-digit'}).format(lastUpdated)}</div></section><section className="panel advice-panel"><div className="advice-icon"><Icon name="leaf"/></div><div className="eyebrow">ASSISTENTE DE DEMONSTRAÇÃO</div><h3>Uma orientação para agora</h3><p className="advice-context">Com base em <b>{latest.site}</b></p><ul>{latestAdvice.map((advice,i) => <li key={i}>{advice}</li>)}</ul><div className="ai-label"><span>✳</span>Regra local simulada · sem IA conectada</div></section></div>
    <section className="panel quick-panel"><div><div className="eyebrow">PRÓXIMOS PASSOS</div><h3>Como podemos ajudar?</h3><p>Registre uma demanda da comunidade ou confira o andamento de pedidos existentes.</p></div><div className="quick-actions"><button className="quick-action" onClick={() => go('/solicitacoes')}><span className="action-icon"><Icon name="plus"/></span><span><b>Abrir solicitação</b><small>Relate uma necessidade da horta</small></span><Icon name="arrow"/></button><button className="quick-action" onClick={() => go('/historico')}><span className="action-icon action-blue"><Icon name="history"/></span><span><b>Consultar histórico</b><small>Veja leituras e orientações salvas</small></span><Icon name="arrow"/></button></div></section>
  </div>;
}
function Metric({ icon, label, value, note, color }) { return <article className="metric-card"><span className={`metric-icon ${color}`}><Icon name={icon}/></span><div className="metric-label">{label}</div><div className="metric-value">{value}</div><div className="metric-note">{note}</div></article>; }
function Status({ value }) { return <span className={`status status-${value === 'Estável' ? 'stable' : 'attention'}`}><span/> {value}</span>; }
function Sensors({ readings, onAdd, onRefresh }) {
  return <div className="content-wrap"><div className="page-intro"><div><p className="eyebrow">EXEMPLOS LOCAIS</p><h2>Pontos de monitoramento</h2><p>Os dados abaixo foram criados para demonstrar como leituras de sensores poderiam aparecer no produto.</p></div><div className="button-row"><button className="button button-secondary" onClick={onRefresh}><span className="refresh-icon">↻</span>Gerar leitura fictícia</button><button className="button button-primary" onClick={onAdd}><Icon name="plus"/>Registrar valor</button></div></div><div className="sensor-cards">{readings.slice(0,3).map(r => <article className="sensor-card" key={r.id}><div className="sensor-card-top"><span className="sensor-card-icon"><Icon name="sensor"/></span><Status value={getState(r)}/></div><h3>{r.site}</h3><p className="sensor-date">Registrado em {formatDate(r.at)}</p><div className="sensor-values"><div><Icon name="water"/><span>Umidade</span><b>{r.moisture}<small>%</small></b><div className="meter"><i style={{width:`${r.moisture}%`}}/></div></div><div><Icon name="sun"/><span>Temperatura</span><b>{r.temp.toFixed(1).replace('.', ',')}<small>°C</small></b></div><div><Icon name="ph"/><span>pH do solo</span><b>{r.ph.toFixed(1).replace('.', ',')}</b></div></div><div className="sensor-card-bottom"><span className="data-dot"/>{r.source}</div></article>)}</div><section className="panel data-table-panel"><div className="panel-heading"><div><div className="eyebrow">REGISTROS</div><h3>Todas as leituras</h3></div><span className="muted-text">{readings.length} no navegador</span></div><div className="table-wrap"><table><thead><tr><th scope="col">Local de referência</th><th scope="col">Umidade do solo</th><th scope="col">Temperatura</th><th scope="col">pH</th><th scope="col">Data</th><th scope="col">Origem</th></tr></thead><tbody>{readings.map(r=><tr key={r.id}><td><b>{r.site}</b></td><td>{r.moisture}%</td><td>{r.temp.toFixed(1).replace('.', ',')} °C</td><td>{r.ph.toFixed(1).replace('.', ',')}</td><td>{formatDate(r.at)}</td><td><span className="origin-tag">Simulado</span></td></tr>)}</tbody></table></div></section><p className="small-disclaimer">As faixas de atenção são regras didáticas e não devem ser usadas como recomendação agronômica real.</p></div>;
}
function Requests({ requests, filter, setFilter, onAdd }) {
  const visible = requests.filter(r => filter === 'Todas' || r.status === filter);
  return <div className="content-wrap"><div className="page-intro"><div><p className="eyebrow">ATENDIMENTO À COMUNIDADE</p><h2>Solicitações</h2><p>Cadastre uma necessidade fictícia e acompanhe como o fluxo do serviço poderia funcionar.</p></div><button className="button button-primary" onClick={onAdd}><Icon name="plus"/>Nova solicitação</button></div><div className="filter-row"><div className="filter-group" role="group" aria-label="Filtrar solicitações">{['Todas','Recebida','Em análise','Orientação disponível'].map(item=><button key={item} className={`filter-chip ${filter===item?'selected':''}`} onClick={()=>setFilter(item)} aria-pressed={filter===item}>{item}</button>)}</div><span className="muted-text">{visible.length} registro(s)</span></div>{visible.length ? <div className="request-list">{visible.map(r=><article className="request-card" key={r.id}><div className="request-type-icon"><Icon name="request"/></div><div className="request-main"><div className="request-top"><span className="request-category">{r.category}</span><StatusRequest value={r.status}/></div><h3>{r.title}</h3><p>{r.details}</p><div className="request-meta"><span><Icon name="leaf"/>{r.site}</span><span>{formatDate(r.at)}</span></div></div></article>)}</div>:<div className="empty-state"><span>✳</span><h3>Nenhuma solicitação neste filtro</h3><p>Altere o filtro ou crie uma solicitação de demonstração.</p></div>}<div className="privacy-callout"><span>⌑</span><p><b>Privacidade:</b> os registros são fictícios e ficam apenas no armazenamento local deste navegador. Não informe dados pessoais reais.</p></div></div>;
}
function StatusRequest({value}) { return <span className={`request-status status-text-${value==='Orientação disponível'?'done':value==='Em análise'?'review':'new'}`}><i/>{value}</span>; }
function History({ readings, requests }) {
  const timeline = [...readings.map(r=>({id:r.id,at:r.at,type:'reading',title:`Leitura registrada · ${r.site}`,description:`Umidade ${r.moisture}% · ${r.temp.toFixed(1).replace('.',',')}°C · pH ${r.ph.toFixed(1).replace('.',',')}`, advice:getAdvice(r)[0]})), ...requests.map(r=>({id:r.id,at:r.at,type:'request',title:`Solicitação · ${r.title}`,description:`${r.category} · ${r.site}`,advice:`Status demonstrativo: ${r.status}`}))].sort((a,b)=>new Date(b.at)-new Date(a.at));
  return <div className="content-wrap"><div className="page-intro"><div><p className="eyebrow">ACOMPANHAMENTO</p><h2>Histórico e orientações</h2><p>Consulte as ações criadas nesta sessão local e as sugestões demonstrativas.</p></div><span className="storage-pill">⌑ Armazenado neste navegador</span></div><div className="history-layout"><section className="panel timeline-panel"><div className="panel-heading"><div><div className="eyebrow">ATIVIDADE</div><h3>Registros recentes</h3></div><span className="muted-text">{timeline.length} itens</span></div><div className="timeline">{timeline.map(item=><article className="timeline-item" key={item.id}><span className={`timeline-marker ${item.type}`}><Icon name={item.type==='reading'?'sensor':'request'}/></span><div className="timeline-content"><div className="timeline-time">{formatDate(item.at)}</div><h4>{item.title}</h4><p>{item.description}</p><div className="timeline-advice"><b>{item.type==='reading'?'Orientação simulada':'Atualização'}</b><span>{item.advice}</span></div></div></article>)}</div></section><aside className="panel reference-panel"><span className="reference-icon"><Icon name="leaf"/></span><div className="eyebrow">COMO LER</div><h3>Orientações de exemplo</h3><p>As mensagens são geradas por regras locais simples a partir dos números informados.</p><ul><li>Não consultam uma IA ou especialista.</li><li>Não representam laudo técnico.</li><li>Servem para demonstrar a jornada de atendimento.</li></ul><div className="ods-mini"><b>Conexão com ODS</b><span>ODS 2 · Agricultura sustentável</span><span>ODS 6 · Gestão da água</span><span>ODS 11 · Comunidades sustentáveis</span></div></aside></div></div>;
}
function ReadingModal({ onClose, onSubmit }) {
  return <Modal title="Registrar leitura fictícia" description="Preencha valores de exemplo para demonstrar a entrada de dados." onClose={onClose}><form onSubmit={onSubmit} className="modal-form"><label>Local de referência<input name="site" required maxLength="80" placeholder="Ex.: Horta comunitária · Canteiro C"/></label><div className="form-two"><label>Umidade do solo (%)<input name="moisture" type="number" min="0" max="100" required defaultValue="45"/></label><label>Temperatura (°C)<input name="temp" type="number" min="-10" max="60" step="0.1" required defaultValue="24"/></label></div><label>pH do solo<input name="ph" type="number" min="0" max="14" step="0.1" required defaultValue="6.2"/></label><p className="form-footnote">Os valores serão tratados como demonstração e salvos somente neste navegador.</p><div className="modal-actions"><button type="button" className="button button-secondary" onClick={onClose}>Cancelar</button><button type="submit" className="button button-primary">Salvar leitura</button></div></form></Modal>;
}
function RequestModal({ readings, onClose, onSubmit }) {
  return <Modal title="Nova solicitação" description="Registre uma necessidade fictícia da comunidade." onClose={onClose}><form onSubmit={onSubmit} className="modal-form"><label>Assunto<input name="title" required maxLength="80" placeholder="Ex.: Verificar irrigação do canteiro"/></label><div className="form-two"><label>Categoria<select name="category"><option>Irrigação</option><option>Solo</option><option>Plantio</option><option>Manutenção</option><option>Outra orientação</option></select></label><label>Local de referência<select name="site">{[...new Set(readings.map(r=>r.site))].map(site=><option key={site}>{site}</option>)}<option>Outro ponto comunitário</option></select></label></div><label>Descrição<textarea name="details" rows="4" maxLength="500" required placeholder="Descreva a situação sem informar dados pessoais."/></label><p className="form-footnote">Não inclua telefone, endereço residencial ou outras informações pessoais.</p><div className="modal-actions"><button type="button" className="button button-secondary" onClick={onClose}>Cancelar</button><button type="submit" className="button button-primary">Registrar solicitação</button></div></form></Modal>;
}
function Modal({ title, description, onClose, children }) {
  useEffect(() => { const handler = e => { if (e.key === 'Escape') onClose(); }; window.addEventListener('keydown', handler); return () => window.removeEventListener('keydown', handler); }, [onClose]);
  return <div className="modal-backdrop" onMouseDown={e=>{if(e.target===e.currentTarget)onClose();}}><section className="modal" role="dialog" aria-modal="true" aria-labelledby="modal-title" aria-describedby="modal-description"><div className="modal-heading"><div><h2 id="modal-title">{title}</h2><p id="modal-description">{description}</p></div><button className="modal-close" onClick={onClose} aria-label="Fechar">×</button></div>{children}</section></div>;
}

export default App;
