import './style.css';

declare global {
  interface ImportMeta {
    env: Record<string, string | undefined>;
  }
}

const app = document.querySelector<HTMLDivElement>('#app')!;

app.innerHTML = `
  <header class="topbar">
    <a class="brand" href="/" aria-label="Session API home">
      <span class="brand-mark">S</span>
      <span><strong>Session API</strong><small>Developer assignment</small></span>
    </a>
    <a class="postman-link" href="/session-booking.postman_collection.json" download>
      <span>Download Postman</span><b aria-hidden="true">↓</b>
    </a>
  </header>

  <main>
    <section class="hero">
      <div class="hero-copy">
        <p class="kicker">Node.js · TypeScript · Express · MongoDB</p>
        <h1>A clear path from<br><em>available</em> to complete.</h1>
        <p class="hero-text">A focused console for testing every required API in the teacher session booking lifecycle.</p>
      </div>
      <div class="lifecycle" aria-label="Session lifecycle">
        <div><span>01</span><strong>Available</strong><small>Teacher creates a slot</small></div>
        <i aria-hidden="true">→</i>
        <div><span>02</span><strong>Booked</strong><small>User claims the session</small></div>
        <i aria-hidden="true">→</i>
        <div><span>03</span><strong>Completed</strong><small>Session enters history</small></div>
      </div>
    </section>

    <section class="requirement-strip" aria-label="Assignment coverage">
      <div><strong>6</strong><span>Required APIs</span></div>
      <div><strong>2</strong><span>Aggregation pipelines</span></div>
      <div><strong>3</strong><span>Session states</span></div>
      <div><strong>100%</strong><span>Interactive workflow</span></div>
    </section>

    <section class="connection-card">
      <div class="connection-copy">
        <span class="pulse" aria-hidden="true"></span>
        <div><strong>API connection</strong><small id="health" role="status">Not checked yet</small></div>
      </div>
      <div class="connection-form">
        <label class="sr-only" for="base">API base URL</label>
        <input id="base" type="url" placeholder="http://localhost:4000">
        <button id="connect" class="button button-secondary" type="button">Check connection</button>
      </div>
    </section>

    <div class="workspace">
      <section class="console-card">
        <nav class="workflow-nav" aria-label="API workflow">
          <button data-tab="setup" class="active"><span>01</span>Setup</button>
          <button data-tab="sessions"><span>02</span>Sessions</button>
          <button data-tab="lifecycle"><span>03</span>Lifecycle</button>
          <button data-tab="history"><span>04</span>History</button>
        </nav>

        <div id="setup" class="panel">
          <div class="panel-intro">
            <p class="step-label">Step 01</p>
            <h2>Create the people</h2>
            <p>Start with a user who will book and a teacher who owns the session.</p>
          </div>

          <article class="api-block">
            <div class="api-heading">
              <div><span class="method post">POST</span><code>/users</code></div>
              <span class="requirement">API 1 · Required</span>
            </div>
            <h3>Create user</h3>
            <p class="api-description">Creates a user with a unique, normalized email address.</p>
            <form id="user">
              <label>Full name<input name="fullName" value="Alex Morgan" required maxlength="120"></label>
              <div class="field-row">
                <label>Email<input name="email" type="email" value="alex@example.com" required></label>
                <label>Phone<input name="phone" value="+919876543210" required></label>
              </div>
              <button class="button" type="submit">Create user <span>→</span></button>
            </form>
          </article>

          <article class="api-block support-block">
            <div class="api-heading">
              <div><span class="method post">POST</span><code>/teachers</code></div>
              <span class="requirement helper">Setup helper</span>
            </div>
            <h3>Create teacher</h3>
            <p class="api-description">A small supporting endpoint so the required session flow is fully testable.</p>
            <form id="teacher">
              <div class="field-row">
                <label>Full name<input name="fullName" value="Dr. Maya Sharma" required maxlength="120"></label>
                <label>Email<input name="email" type="email" value="maya@example.com" required></label>
              </div>
              <div class="field-row">
                <label>Specialization<input name="specialization" value="Mathematics" required></label>
                <label>Experience (years)<input name="experience" type="number" min="0" max="80" value="6" required></label>
              </div>
              <button class="button" type="submit">Create teacher <span>→</span></button>
            </form>
            <button id="teachers" class="text-button" type="button">List existing teachers</button>
          </article>
        </div>

        <div id="sessions" class="panel" hidden>
          <div class="panel-intro">
            <p class="step-label">Step 02</p>
            <h2>Create and discover sessions</h2>
            <p>Open an available slot, then query a UTC date using MongoDB aggregation.</p>
          </div>

          <article class="api-block">
            <div class="api-heading">
              <div><span class="method post">POST</span><code>/sessions</code></div>
              <span class="requirement">API 2 · Required</span>
            </div>
            <h3>Create session</h3>
            <form id="session">
              <label>Teacher ID<input name="teacherId" class="teacher-id" required placeholder="Created teacher ID fills automatically"></label>
              <div class="field-row">
                <label>Start time<input name="startTime" type="datetime-local" required></label>
                <label>End time<input name="endTime" type="datetime-local" required></label>
              </div>
              <button class="button" type="submit">Create available session <span>→</span></button>
            </form>
          </article>

          <article class="api-block accent-block">
            <div class="api-heading">
              <div><span class="method get">GET</span><code>/sessions/available</code></div>
              <span class="requirement aggregation">API 3 · Aggregation</span>
            </div>
            <h3>Find available sessions</h3>
            <p class="api-description">Returns only AVAILABLE sessions whose start time falls inside the selected UTC day.</p>
            <form id="available">
              <label>Session date (UTC)<input name="date" type="date" required></label>
              <button class="button" type="submit">Find availability <span>→</span></button>
            </form>
            <div id="available-list" class="result-list"></div>
          </article>
        </div>

        <div id="lifecycle" class="panel" hidden>
          <div class="panel-intro">
            <p class="step-label">Step 03</p>
            <h2>Move through the lifecycle</h2>
            <p>Book one available session, then mark that booked session complete.</p>
          </div>

          <article class="api-block">
            <div class="api-heading">
              <div><span class="method post">POST</span><code>/sessions/:id/book</code></div>
              <span class="requirement">API 4 · Atomic update</span>
            </div>
            <h3>Book session</h3>
            <p class="api-description">Only one request can transition a session from AVAILABLE to BOOKED.</p>
            <form id="booking">
              <label>Session ID<input name="sessionId" class="session-id" required placeholder="Created or selected session ID"></label>
              <label>User ID<input name="userId" class="user-id" required placeholder="Created user ID fills automatically"></label>
              <button class="button" type="submit">Book session <span>→</span></button>
            </form>
          </article>

          <article class="api-block">
            <div class="api-heading">
              <div><span class="method patch">PATCH</span><code>/sessions/:id/complete</code></div>
              <span class="requirement">API 5 · Required</span>
            </div>
            <h3>Complete session</h3>
            <p class="api-description">Transitions BOOKED to COMPLETED and records the completion timestamp.</p>
            <form id="complete">
              <label>Session ID<input name="sessionId" class="session-id" required></label>
              <button class="button button-complete" type="submit">Mark session complete <span>✓</span></button>
            </form>
          </article>
        </div>

        <div id="history" class="panel" hidden>
          <div class="panel-intro">
            <p class="step-label">Step 04</p>
            <h2>Review user history</h2>
            <p>One aggregation separates the user's booked and completed sessions.</p>
          </div>

          <article class="api-block accent-block">
            <div class="api-heading">
              <div><span class="method get">GET</span><code>/users/:id/sessions</code></div>
              <span class="requirement aggregation">API 6 · Aggregation</span>
            </div>
            <h3>User session list</h3>
            <form id="history-form">
              <label>User ID<input name="userId" class="user-id" required placeholder="Created user ID fills automatically"></label>
              <button class="button" type="submit">Load session history <span>→</span></button>
            </form>
            <div id="history-list" class="result-list">
              <p class="empty-state">Complete the workflow, then load this user's sessions.</p>
            </div>
          </article>
        </div>
      </section>

      <aside class="inspector">
        <div class="inspector-heading">
          <div><p class="step-label">Live inspector</p><h2>Request & response</h2></div>
          <span id="status">READY</span>
        </div>
        <div class="request-line"><span aria-hidden="true">›</span><p id="request">Waiting for your first request</p></div>
        <pre id="response" tabindex="0" aria-live="polite">{
  "message": "Choose an API action to begin."
}</pre>
        <div class="inspector-note">
          <span aria-hidden="true">↳</span>
          <p><strong>Automatic handoff</strong>Successful user, teacher and session IDs are inserted into the next relevant form.</p>
        </div>
        <div class="rules">
          <h3>Implementation guarantees</h3>
          <p><span>✓</span> Centralized error handling</p>
          <p><span>✓</span> Atomic booking and completion</p>
          <p><span>✓</span> UTC date boundaries</p>
          <p><span>✓</span> Real MongoDB aggregation</p>
        </div>
      </aside>
    </div>
  </main>

  <footer>
    <span>Session Booking API</span>
    <span>Node.js · TypeScript · Express.js · MongoDB · Mongoose</span>
  </footer>
`;

const $ = <T extends HTMLElement>(selector: string) => document.querySelector<T>(selector)!;
const base = $<HTMLInputElement>('#base');

base.value = localStorage.getItem('session-api-base')
  || import.meta.env.VITE_API_BASE_URL
  || 'http://localhost:4000';

function fill(selector: string, value: string) {
  document.querySelectorAll<HTMLInputElement>(selector).forEach(input => {
    input.value = value;
  });
}

function selectTab(name: string) {
  document.querySelectorAll<HTMLElement>('.panel').forEach(panel => {
    panel.hidden = panel.id !== name;
  });
  document.querySelectorAll<HTMLElement>('[data-tab]').forEach(button => {
    button.classList.toggle('active', button.dataset.tab === name);
  });
}

document.querySelectorAll<HTMLElement>('[data-tab]').forEach(button => {
  button.addEventListener('click', () => selectTab(button.dataset.tab!));
});

async function apiRequest(method: string, path: string, body?: unknown) {
  const startedAt = performance.now();
  const status = $('#status');
  status.textContent = 'SENDING';
  status.className = 'loading';
  $('#request').textContent = `${method} ${path}`;
  $('#response').textContent = body
    ? `Request body:\n${JSON.stringify(body, null, 2)}\n\nWaiting for response…`
    : 'Waiting for response…';

  try {
    const url = new URL(base.value);
    if (!['http:', 'https:'].includes(url.protocol) || url.username || url.password || url.search || url.hash) {
      throw new Error('Enter an HTTP(S) API URL without credentials, query parameters, or fragments.');
    }

    const root = base.value.replace(/\/+$/, '');
    localStorage.setItem('session-api-base', root);
    const response = await fetch(`${root}${path}`, {
      method,
      headers: body ? { 'Content-Type': 'application/json' } : {},
      ...(body ? { body: JSON.stringify(body) } : {}),
      signal: AbortSignal.timeout(60000),
    });
    const raw = await response.text();
    let data;

    try {
      data = JSON.parse(raw);
    } catch {
      throw new Error(`The API returned non-JSON content (${response.status}). Check the API URL.`);
    }

    status.textContent = `${response.status} · ${Math.round(performance.now() - startedAt)}ms`;
    status.className = response.ok ? 'success' : 'error';
    $('#response').textContent = `${body ? `Request body:\n${JSON.stringify(body, null, 2)}\n\n` : ''}Response:\n${JSON.stringify(data, null, 2)}`;
    return response.ok ? data : null;
  } catch (error) {
    status.textContent = 'ERROR';
    status.className = 'error';
    $('#response').textContent = error instanceof Error
      ? `${error.message}\n\nConfirm the backend is running and CORS_ORIGINS allows this frontend.`
      : 'The request failed.';
    return null;
  }
}

function bindForm(id: string, action: (values: Record<string, string>) => Promise<void>) {
  const element = $<HTMLFormElement>(`#${id}`);
  element.addEventListener('submit', async event => {
    event.preventDefault();
    const buttons = Array.from(element.querySelectorAll('button'));
    buttons.forEach(button => { button.disabled = true; });

    try {
      await action(Object.fromEntries(new FormData(element).entries()) as Record<string, string>);
    } catch (error) {
      $('#status').textContent = 'ERROR';
      $('#status').className = 'error';
      $('#response').textContent = String(error);
    } finally {
      buttons.forEach(button => { button.disabled = false; });
    }
  });
}

bindForm('user', async values => {
  const result = await apiRequest('POST', '/users', values);
  if (result) fill('.user-id', result.data._id);
});

bindForm('teacher', async values => {
  const result = await apiRequest('POST', '/teachers', {
    ...values,
    experience: Number(values.experience),
  });
  if (result) fill('.teacher-id', result.data._id);
});

bindForm('session', async values => {
  const result = await apiRequest('POST', '/sessions', {
    teacherId: values.teacherId,
    startTime: new Date(values.startTime).toISOString(),
    endTime: new Date(values.endTime).toISOString(),
  });
  if (result) fill('.session-id', result.data._id);
});

type Session = {
  _id: string;
  status: string;
  startTime: string;
  endTime: string;
  teacher?: { fullName: string };
};

function renderSessions(target: HTMLElement, sessions: Session[], selectable = false) {
  if (!sessions.length) {
    const empty = document.createElement('p');
    empty.className = 'empty-state';
    empty.textContent = 'No sessions found.';
    target.append(empty);
  }

  sessions.forEach(session => {
    const card = document.createElement('article');
    card.className = 'session-result';
    const heading = document.createElement('div');
    const title = document.createElement('strong');
    title.textContent = session.teacher?.fullName || 'Teacher session';
    const state = document.createElement('span');
    state.textContent = session.status;
    heading.append(title, state);
    const time = document.createElement('p');
    time.textContent = `${new Date(session.startTime).toLocaleString()} — ${new Date(session.endTime).toLocaleTimeString()}`;
    const identifier = document.createElement('code');
    identifier.textContent = session._id;
    card.append(heading, time, identifier);

    if (selectable) {
      const button = document.createElement('button');
      button.className = 'text-button';
      button.type = 'button';
      button.textContent = 'Use this session →';
      button.onclick = () => {
        fill('.session-id', session._id);
        selectTab('lifecycle');
      };
      card.append(button);
    }

    target.append(card);
  });
}

bindForm('available', async values => {
  const timestamp = new Date(`${values.date}T00:00:00Z`).getTime();
  const result = await apiRequest('GET', `/sessions/available?dateTimestamp=${timestamp}`);
  const target = $('#available-list');
  target.replaceChildren();
  if (result) renderSessions(target, result.data, true);
});

bindForm('booking', async values => {
  await apiRequest('POST', `/sessions/${encodeURIComponent(values.sessionId)}/book`, {
    userId: values.userId,
  });
});

bindForm('complete', async values => {
  await apiRequest('PATCH', `/sessions/${encodeURIComponent(values.sessionId)}/complete`);
});

bindForm('history-form', async values => {
  const result = await apiRequest('GET', `/users/${encodeURIComponent(values.userId)}/sessions`);
  const target = $('#history-list');
  target.replaceChildren();

  if (result) {
    const groups: [string, string][] = [
      ['upcomingSessions', 'Upcoming sessions'],
      ['completedSessions', 'Completed sessions'],
    ];

    groups.forEach(([key, label]) => {
      const heading = document.createElement('h4');
      heading.textContent = `${label} · ${result.data[key].length}`;
      target.append(heading);
      renderSessions(target, result.data[key]);
    });
  }
});

$('#teachers').addEventListener('click', async () => {
  await apiRequest('GET', '/teachers');
});

$('#connect').addEventListener('click', async () => {
  const result = await apiRequest('GET', '/health');
  const health = $('#health');
  const pulse = $('.pulse');
  health.textContent = result ? 'Connected · MongoDB ready' : 'Connection failed';
  pulse.classList.toggle('online', Boolean(result));
});

const tomorrow = new Date(Date.now() + 86400000);
tomorrow.setHours(10, 0, 0, 0);
const toLocalInput = (date: Date) => new Date(date.getTime() - date.getTimezoneOffset() * 60000)
  .toISOString()
  .slice(0, 16);

$<HTMLInputElement>('[name="startTime"]').value = toLocalInput(tomorrow);
$<HTMLInputElement>('[name="endTime"]').value = toLocalInput(new Date(tomorrow.getTime() + 3600000));
$<HTMLInputElement>('[name="date"]').value = tomorrow.toISOString().slice(0, 10);
