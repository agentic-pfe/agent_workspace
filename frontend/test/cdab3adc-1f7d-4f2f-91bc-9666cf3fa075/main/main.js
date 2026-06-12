/**
 * ScienceQuest — Main Interactive JavaScript
 * Vanilla ES6+ / No dependencies
 * Features:
 *   1. Mobile-friendly navigation toggle (hamburger menu)
 *   2. Smooth scrolling for all anchor links
 *   3. Contact form validation with user-friendly error messages
 *   4. Interactive science quiz in the Activities section
 */

document.addEventListener('DOMContentLoaded', () => {

  // ============================================================
  // 1.  MOBILE NAVIGATION TOGGLE
  // ============================================================
  const headerContainer = document.querySelector('.header__container');
  const nav = document.querySelector('.nav');

  if (headerContainer && nav) {
    // Build the hamburger button
    const hamburger = document.createElement('button');
    hamburger.className = 'hamburger';
    hamburger.setAttribute('type', 'button');
    hamburger.setAttribute('aria-label', 'Toggle navigation menu');
    hamburger.setAttribute('aria-expanded', 'false');
    hamburger.innerHTML =
      '<span class="hamburger__line"></span>' +
      '<span class="hamburger__line"></span>' +
      '<span class="hamburger__line"></span>';

    headerContainer.appendChild(hamburger);

    // Toggle open / close
    hamburger.addEventListener('click', () => {
      const isOpen = nav.classList.toggle('nav--open');
      hamburger.classList.toggle('hamburger--active');
      hamburger.setAttribute('aria-expanded', String(isOpen));
    });

    // Close nav when any nav link is clicked
    nav.querySelectorAll('.nav__link').forEach(link => {
      link.addEventListener('click', () => {
        nav.classList.remove('nav--open');
        hamburger.classList.remove('hamburger--active');
        hamburger.setAttribute('aria-expanded', 'false');
      });
    });

    // Close nav when clicking outside the header
    document.addEventListener('click', e => {
      if (
        !headerContainer.contains(e.target) &&
        nav.classList.contains('nav--open')
      ) {
        nav.classList.remove('nav--open');
        hamburger.classList.remove('hamburger--active');
        hamburger.setAttribute('aria-expanded', 'false');
      }
    });
  }

  // ============================================================
  // 2.  SMOOTH SCROLLING FOR ANCHOR LINKS
  // ============================================================
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', e => {
      const raw = anchor.getAttribute('href');
      if (!raw || raw === '#') return;

      const target = document.querySelector(raw);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  // ============================================================
  // 3.  CONTACT FORM VALIDATION
  // ============================================================
  const form = document.querySelector('.form');

  if (form) {
    const nameInput    = document.getElementById('teacher-name');
    const emailInput   = document.getElementById('teacher-email');
    const messageInput = document.getElementById('teacher-message');

    // ---------- helpers ----------
    const createErrorEl = sibling => {
      if (!sibling) return null;
      const el = document.createElement('span');
      el.className = 'form__error';
      el.setAttribute('role', 'alert');
      el.setAttribute('aria-live', 'polite');
      el.style.display = 'none';
      sibling.parentNode.appendChild(el);
      return el;
    };

    const nameError    = createErrorEl(nameInput);
    const emailError   = createErrorEl(emailInput);
    const messageError = createErrorEl(messageInput);

    const showError   = (err, msg) => { if (err) { err.textContent = msg; err.style.display = 'block'; } };
    const hideError   = err          => { if (err) { err.textContent = '';  err.style.display = 'none';  } };

    const setField = (input, valid) => {
      if (!input) return;
      input.classList.toggle('form__input--error',  !valid);
      input.classList.toggle('form__input--valid',   valid);
      input.setAttribute('aria-invalid', String(!valid));
    };

    const isValidEmail = str => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(str);

    // ---------- live validation on blur ----------
    if (nameInput) {
      nameInput.addEventListener('blur', () => {
        const ok = nameInput.value.trim() !== '';
        setField(nameInput, ok);
        ok ? hideError(nameError) : showError(nameError, 'Please enter your full name.');
      });
    }

    if (emailInput) {
      emailInput.addEventListener('blur', () => {
        const val = emailInput.value.trim();
        if (val === '') {
          showError(emailError, 'Please enter your email address.');
          setField(emailInput, false);
        } else if (!isValidEmail(val)) {
          showError(emailError, 'Please enter a valid email address (e.g., name@example.com).');
          setField(emailInput, false);
        } else {
          hideError(emailError);
          setField(emailInput, true);
        }
      });
    }

    if (messageInput) {
      messageInput.addEventListener('blur', () => {
        const ok = messageInput.value.trim() !== '';
        setField(messageInput, ok);
        ok ? hideError(messageError) : showError(messageError, 'Please enter your message.');
      });
    }

    // ---------- submit handler ----------
    form.addEventListener('submit', e => {
      e.preventDefault();
      let valid = true;

      // Name
      const nv = nameInput ? nameInput.value.trim() : '';
      if (!nv) {
        showError(nameError, 'Please enter your full name.');
        setField(nameInput, false);
        valid = false;
      } else {
        hideError(nameError);
        setField(nameInput, true);
      }

      // Email
      const ev = emailInput ? emailInput.value.trim() : '';
      if (!ev) {
        showError(emailError, 'Please enter your email address.');
        setField(emailInput, false);
        valid = false;
      } else if (!isValidEmail(ev)) {
        showError(emailError, 'Please enter a valid email address (e.g., name@example.com).');
        setField(emailInput, false);
        valid = false;
      } else {
        hideError(emailError);
        setField(emailInput, true);
      }

      // Message
      const mv = messageInput ? messageInput.value.trim() : '';
      if (!mv) {
        showError(messageError, 'Please enter your message.');
        setField(messageInput, false);
        valid = false;
      } else {
        hideError(messageError);
        setField(messageInput, true);
      }

      if (!valid) {
        const firstBad = form.querySelector('[aria-invalid="true"]');
        if (firstBad) firstBad.focus();
        return;
      }

      // --- success ---
      const success = document.createElement('div');
      success.className = 'form__success';
      success.setAttribute('role', 'status');
      success.textContent =
        'Thank you! Your message has been sent successfully. We\'ll respond within 24 hours.';

      const actions = form.querySelector('.form__actions');
      form.insertBefore(success, actions);

      form.reset();
      [nameInput, emailInput, messageInput].forEach(inp => {
        if (inp) {
          inp.classList.remove('form__input--valid');
          inp.removeAttribute('aria-invalid');
        }
      });

      setTimeout(() => { if (success.parentNode) success.remove(); }, 6000);
    });
  }

  // ============================================================
  // 4.  INTERACTIVE QUIZ  (inside #interactive section)
  // ============================================================
  const interactiveSection = document.getElementById('interactive');

  if (interactiveSection) {
    /* -------- Inject quiz markup -------- */
    const quizWrap = document.createElement('div');
    quizWrap.className = 'quiz';

    quizWrap.innerHTML = `
      <div class="quiz__inner">
        <h3 class="quiz__heading">⚡ Quick Science Quiz</h3>
        <p class="quiz__description">
          Test your knowledge with this mini science quiz.
          Select an answer for each question to see instant feedback!
        </p>

        <div class="quiz__questions">

          <!-- Question 1 -->
          <div class="quiz__question" data-q="1">
            <p class="quiz__q-text"><strong>1.</strong> What is the powerhouse of the cell?</p>
            <div class="quiz__options">
              <label class="quiz__opt"><input type="radio" name="qa1" value="nucleus">    <span class="quiz__opt-label">Nucleus</span></label>
              <label class="quiz__opt"><input type="radio" name="qa1" value="mitochondria"><span class="quiz__opt-label">Mitochondria</span></label>
              <label class="quiz__opt"><input type="radio" name="qa1" value="ribosome">    <span class="quiz__opt-label">Ribosome</span></label>
              <label class="quiz__opt"><input type="radio" name="qa1" value="golgi">        <span class="quiz__opt-label">Golgi Apparatus</span></label>
            </div>
            <div class="quiz__fb" role="alert" aria-live="polite"></div>
          </div>

          <!-- Question 2 -->
          <div class="quiz__question" data-q="2">
            <p class="quiz__q-text"><strong>2.</strong> Which of the following is a chemical change?</p>
            <div class="quiz__options">
              <label class="quiz__opt"><input type="radio" name="qa2" value="melting">    <span class="quiz__opt-label">Ice melting</span></label>
              <label class="quiz__opt"><input type="radio" name="qa2" value="rusting">    <span class="quiz__opt-label">Iron rusting</span></label>
              <label class="quiz__opt"><input type="radio" name="qa2" value="cutting">    <span class="quiz__opt-label">Cutting paper</span></label>
              <label class="quiz__opt"><input type="radio" name="qa2" value="dissolving"> <span class="quiz__opt-label">Sugar dissolving in water</span></label>
            </div>
            <div class="quiz__fb" role="alert" aria-live="polite"></div>
          </div>

          <!-- Question 3 -->
          <div class="quiz__question" data-q="3">
            <p class="quiz__q-text"><strong>3.</strong> What force keeps planets orbiting the Sun?</p>
            <div class="quiz__options">
              <label class="quiz__opt"><input type="radio" name="qa3" value="magnetic">    <span class="quiz__opt-label">Magnetic force</span></label>
              <label class="quiz__opt"><input type="radio" name="qa3" value="gravity">     <span class="quiz__opt-label">Gravity</span></label>
              <label class="quiz__opt"><input type="radio" name="qa3" value="friction">    <span class="quiz__opt-label">Friction</span></label>
              <label class="quiz__opt"><input type="radio" name="qa3" value="centrifugal"> <span class="quiz__opt-label">Centrifugal force</span></label>
            </div>
            <div class="quiz__fb" role="alert" aria-live="polite"></div>
          </div>
        </div>

        <!-- Score & Reset -->
        <div class="quiz__score" role="status" aria-live="polite">
          <p class="quiz__score-text">Your Score: <span class="quiz__score-val">0</span> / 3</p>
          <button class="btn btn--secondary quiz__reset" type="button">Reset Quiz</button>
        </div>
      </div>
    `;

    interactiveSection.appendChild(quizWrap);

    /* -------- Quiz logic -------- */
    const ANSWER_KEY = {
      qa1: 'mitochondria',
      qa2: 'rusting',
      qa3: 'gravity',
    };

    const EXPLANATIONS = {
      correct: {
        qa1: '✅ Correct! Mitochondria are known as the powerhouse of the cell because they produce energy (ATP) through cellular respiration.',
        qa2: '✅ Correct! Rusting is a chemical change — iron combines with oxygen to form a new substance (iron oxide).',
        qa3: '✅ Correct! Gravity is the attractive force that keeps planets in orbit around the Sun.',
      },
      incorrect: {
        qa1: '❌ Not quite. The mitochondria is the powerhouse of the cell. The nucleus controls cell activities, ribosomes make proteins, and the Golgi apparatus packages proteins.',
        qa2: '❌ Not quite. Rusting is a chemical change because it creates a new substance (iron oxide). Melting, cutting, and dissolving are physical changes.',
        qa3: '❌ Not quite. Gravity is the force that keeps planets orbiting the Sun — it\'s the same force that keeps us on the ground!',
      },
    };

    const scoreSpan = quizWrap.querySelector('.quiz__score-val');
    const resetBtn  = quizWrap.querySelector('.quiz__reset');
    let   score     = 0;
    const answered  = {};

    const updateScore = () => {
      score = Object.values(answered).filter(v => v).length;
      if (scoreSpan) scoreSpan.textContent = score;
    };

    // Wire up every radio group
    quizWrap.querySelectorAll('.quiz__options').forEach(group => {
      const radios = group.querySelectorAll('input[type="radio"]');

      radios.forEach(radio => {
        radio.addEventListener('change', () => {
          const qEl   = radio.closest('.quiz__question');
          const fb    = qEl.querySelector('.quiz__fb');
          const name  = radio.name;
          const val   = radio.value;
          const right = val === ANSWER_KEY[name];

          // Lock the group
          radios.forEach(r => { r.disabled = true; });

          // Mark correct / incorrect visually
          group.querySelectorAll('.quiz__opt').forEach(opt => {
            const inp = opt.querySelector('input');
            if (inp.value === ANSWER_KEY[name]) {
              opt.classList.add('quiz__opt--correct');
            } else if (inp.checked && !right) {
              opt.classList.add('quiz__opt--incorrect');
            }
          });

          answered[name] = right;

          fb.textContent = right
            ? EXPLANATIONS.correct[name]
            : EXPLANATIONS.incorrect[name];
          fb.className = `quiz__fb quiz__fb--${right ? 'correct' : 'incorrect'}`;

          updateScore();
        });
      });
    });

    // Reset quiz
    if (resetBtn) {
      resetBtn.addEventListener('click', () => {
        quizWrap.querySelectorAll('input[type="radio"]').forEach(r => {
          r.checked = false;
          r.disabled = false;
        });
        quizWrap.querySelectorAll('.quiz__opt').forEach(opt => {
          opt.classList.remove('quiz__opt--correct', 'quiz__opt--incorrect');
        });
        quizWrap.querySelectorAll('.quiz__fb').forEach(el => {
          el.textContent = '';
          el.className = 'quiz__fb';
        });
        Object.keys(answered).forEach(k => delete answered[k]);
        updateScore();
      });
    }
  }

});