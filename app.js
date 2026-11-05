
'use strict';

// VIBES Interactive | Version 2.1
// Responses are held in browser memory only.
// No scores, pass/fail decisions, or clinical certifications are generated.

const responseLabels = [
  { value: 'met', label: 'Met' },
  { value: 'not-met', label: 'Not yet met' },
  { value: 'na', label: 'N/A' }
];

const responses = {};
let checklist;

const el = (tag, className, text) => {
  const node = document.createElement(tag);

  if (className) {
    node.className = className;
  }

  if (text !== undefined) {
    node.textContent = text;
  }

  return node;
};

// Build the five domains and all 16 checklist items.
function build() {
  const nav = document.getElementById('domain-nav');
  const list = document.getElementById('domain-list');

  for (const domain of checklist.domains) {
    const domainItems = checklist.items.filter(
      item => item.domain === domain.letter
    );

    // Domain navigation
    const link = el(
      'a',
      '',
      domain.letter + ' · ' + domain.name
    );

    link.href = '#domain-' + domain.letter;
    nav.append(link);

    // Domain section
    const section = el('section', 'domain-section');
    section.id = 'domain-' + domain.letter;

    const head = el('div', 'domain-heading');

    head.append(
      el('div', 'domain-letter', domain.letter)
    );

    const heading = el('div');

    heading.append(
      el('h3', '', domain.name),
      el('p', '', domain.description)
    );

    head.append(heading);
    section.append(head);

    const container = el('div', 'domain-items');

    // Individual checklist items
    for (const item of domainItems) {
      const card = el('article', 'item');
      const top = el('div', 'item-top');

      top.append(
        el('div', 'item-id', item.id)
      );

      const body = el('div', 'item-body');

      // Exact checklist statement
      const statement = el(
        'p',
        'item-statement',
        item.statement
      );

      if (item.references) {
        const citation = el(
          'span',
          'item-refs',
          ' [' + item.references + ']'
        );

        statement.append(citation);
      }

      // Original rationale
      body.append(
        statement,
        el('p', 'rationale', item.rationale)
      );

      // Response options
      const options = el('div', 'choices');

      options.setAttribute('role', 'group');
      options.setAttribute(
        'aria-label',
        item.id + ' review response'
      );

      for (const option of responseLabels) {
        const label = el('label', 'choice');
        const input = el('input');

        input.type = 'radio';
        input.name = item.id;
        input.value = option.value;

        input.setAttribute(
          'aria-label',
          item.id + ': ' + option.label
        );

        input.addEventListener('change', () => {
          responses[item.id] = option.value;
          update();
        });

        label.append(
          input,
          el('span', '', option.label)
        );

        options.append(label);
      }

      const status = el('div', 'item-status');

      status.id = 'status-' + item.id;

      status.setAttribute(
        'aria-live',
        'polite'
      );

      body.append(options, status);
      top.append(body);
      card.append(top);
      container.append(card);
    }

    section.append(container);
    list.append(section);
  }

  // Source references
  const refs = document.getElementById('references');

  for (const reference of checklist.references) {
    refs.append(
      el(
        'li',
        '',
        reference.replace(/^\[\d+\]\s*/, '')
      )
    );
  }

  update();
}

// Update progress and results whenever a response changes.
function update() {
  const items = checklist.items;

  const completed = items.filter(
    item => responses[item.id]
  );

  const counts = {
    met: 0,
    'not-met': 0,
    na: 0
  };

  for (const value of Object.values(responses)) {
    if (Object.prototype.hasOwnProperty.call(counts, value)) {
      counts[value]++;
    }
  }

  const percent = Math.round(
    (100 * completed.length) / items.length
  );

  // Progress indicator
  document.getElementById('progress-count').textContent =
    completed.length + ' of ' + items.length + ' reviewed';

  document.getElementById('progress-percent').textContent =
    percent + '%';

  document.getElementById('progress-fill').style.width =
    percent + '%';

  // Individual item status messages
  for (const item of items) {
    const status = document.getElementById(
      'status-' + item.id
    );

    const value = responses[item.id];

    if (value === 'not-met') {
      status.textContent =
        'Not yet met: pause to verify, revise, or seek guidance.';
    } else {
      status.textContent = '';
    }
  }

  // Summary statistics
  const stats = document.getElementById('stats');

  stats.replaceChildren();

  const categories = [
    ['met', 'Met'],
    ['not-met', 'Not yet met'],
    ['na', 'N/A']
  ];

  for (const [key, title] of categories) {
    const box = el('div', 'stat');

    box.append(
      el('b', '', String(counts[key])),
      el('span', '', title)
    );

    stats.append(box);
  }

  // Items requiring further attention
  const unresolved = items.filter(item =>
    !responses[item.id] ||
    responses[item.id] === 'not-met'
  );

  const intro = document.getElementById('summary-intro');

  if (completed.length === 0) {
    intro.textContent =
      'Begin reviewing the checklist above. ' +
      'Your summary will update as you go.';
  } else if (unresolved.length === 0) {
    intro.textContent =
      'All ' + items.length + ' items have been reviewed. ' +
      'Confirm that all applicable statements are met before ' +
      'using the work. N/A items are recorded separately.';
  } else {
    intro.textContent =
      unresolved.length +
      ' item(s) remain unanswered or not yet met. ' +
      'Resolve applicable concerns before using the work.';
  }

  // Domain-by-domain attention list
  const attention = document.getElementById('attention-list');

  attention.replaceChildren();

  for (const domain of checklist.domains) {
    const issues = unresolved.filter(
      item => item.domain === domain.letter
    );

    if (!issues.length) {
      continue;
    }

    const group = el('div', 'attention-group');

    group.append(
      el(
        'h3',
        '',
        domain.name + ' · ' + issues.length + ' to review'
      )
    );

    const ul = el('ul');

    for (const item of issues) {
      const value = responses[item.id];

      const label = value === 'not-met'
        ? 'Not yet met'
        : 'Not answered';

      ul.append(
        el(
          'li',
          '',
          item.id + ' · ' + label + ': ' + item.statement
        )
      );
    }

    group.append(ul);
    attention.append(group);
  }
}

// Print or save the review summary as a PDF.
document.getElementById('print-btn').addEventListener(
  'click',
  () => {
    window.print();
  }
);

// Clear all responses and begin a new review.
document.getElementById('reset-btn').addEventListener(
  'click',
  () => {
    const confirmed = window.confirm(
      'Clear all responses from this review?'
    );

    if (!confirmed) {
      return;
    }

    for (const key of Object.keys(responses)) {
      delete responses[key];
    }

    document.querySelectorAll(
      'input[type="radio"]'
    ).forEach(input => {
      input.checked = false;
    });

    update();

    document.getElementById('checklist').scrollIntoView({
      behavior: 'smooth'
    });
  }
);

// Load the official VIBES Version 2.1 checklist data.
fetch('checklist.json')
  .then(response => {
    if (!response.ok) {
      throw new Error('Checklist data unavailable');
    }

    return response.json();
  })
  .then(data => {
    checklist = data;
    build();
  })
  .catch(error => {
    console.error('VIBES checklist loading error:', error);

    document.getElementById('domain-list').textContent =
      'Unable to load the checklist. Make sure all website ' +
      'files are published together through GitHub Pages. ' +
      'Opening index.html directly from your computer ' +
      'may not work.';
  });
