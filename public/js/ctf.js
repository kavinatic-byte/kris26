// ==================== CTF Challenge Logic ====================

// ---- Important: Do NOT trust client-side validation! ----
// The real password check happens on the server.
// But for Part 4 of this CTF, the intended challenge is to
// find the password hidden in this very JavaScript file.
//
// Can you spot it?

const PART4_SECRET = "js_is_not_a_vault";

// (The server checks all passwords. This constant is just
// the answer to Part 4's puzzle — inspect the source to find it.)

// ---- State ----

let solvedParts = new Set();

// ---- Submit Handler ----

const cards = document.querySelectorAll('.challenge-card');

cards.forEach(card => {
  const part = Number(card.dataset.part);
  const input = card.querySelector('input');
  const button = card.querySelector('.pw-submit');
  const feedback = card.querySelector('.pw-feedback');

  button.addEventListener('click', async () => {
    const password = input.value.trim();
    if (!password) return;

    button.disabled = true;
    button.textContent = '...';

    const resp = await fetch('/api/ctf/check', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ part, password }),
    });

    button.disabled = false;
    button.textContent = 'Submit';

    const data = await resp.json();

    if (data.correct) {
      feedback.textContent = 'Correct! ✓';
      feedback.className = 'pw-feedback success';
      card.classList.add('solved');
      input.disabled = true;
      button.disabled = true;
      button.textContent = 'Solved';

      solvedParts.add(part);

      // Unlock next part
      const nextCard = document.querySelector('.challenge-card[data-part="' + (part + 1) + '"]');
      if (nextCard) {
        nextCard.classList.remove('locked');
        nextCard.querySelector('input').focus();
      }

      // Check if all done
      if (solvedParts.size === 4) {
        setTimeout(() => {
          document.getElementById('winOverlay').classList.add('active');
        }, 600);
      }
    } else {
      feedback.textContent = 'Incorrect password. Try again.';
      feedback.className = 'pw-feedback error';
    }
  });

  // Allow Enter key
  input.addEventListener('keydown', e => {
    if (e.key === 'Enter') button.click();
  });
});
