import { createClient } from '@supabase/supabase-js';

    const SUPABASE_URL = 'https://your-project-id.supabase.co';
    const SUPABASE_ANON_KEY = 'your-anon-key';

    const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

    const authButton = document.getElementById('auth-button');
    const signOutLink = document.getElementById('signout-link');
    const authModal = document.getElementById('auth-modal');
    const authFormContainer = document.getElementById('auth-form-container');
    const closeButton = document.querySelector('.close-button');

    let user = null;

    async function handleSignUp(email, password) {
      const { data, error } = await supabase.auth.signUp({
        email: email,
        password: password,
      });

      if (error) {
        console.error('Sign up error:', error);
        alert('Sign up failed: ' + error.message);
      } else {
        console.log('Sign up successful:', data);
        alert('Sign up successful! Please check your email to verify your account.');
        closeModal();
      }
    }

    async function handleSignIn(email, password) {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email,
        password: password,
      });

      if (error) {
        console.error('Sign in error:', error);
        alert('Sign in failed: ' + error.message);
      } else {
        console.log('Sign in successful:', data);
        user = data.user;
        updateAuthUI();
        closeModal();
      }
    }

    async function handleSignOut() {
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error('Sign out error:', error);
        alert('Sign out failed: ' + error.message);
      } else {
        console.log('Signed out');
        user = null;
        updateAuthUI();
      }
    }

    function updateAuthUI() {
      if (user) {
        authButton.style.display = 'none';
        signOutLink.style.display = 'inline';
      } else {
        authButton.style.display = 'inline';
        signOutLink.style.display = 'none';
      }
    }

    function openModal() {
      authModal.style.display = 'block';
      authFormContainer.innerHTML = '';

      const form = document.createElement('form');
      form.innerHTML = `
        <h2>Sign Up or Sign In</h2>
        <input type="email" placeholder="Email" required>
        <input type="password" placeholder="Password" required>
        <div style="display: flex; justify-content: space-around; margin-top: 10px;">
          <button type="button" id="signup-button">Sign Up</button>
          <button type="button" id="signin-button">Sign In</button>
        </div>
      `;

      const signUpButton = form.querySelector('#signup-button');
      const signInButton = form.querySelector('#signin-button');

      signUpButton.addEventListener('click', async () => {
        const email = form.querySelector('input[type="email"]').value;
        const password = form.querySelector('input[type="password"]').value;
        await handleSignUp(email, password);
      });

      signInButton.addEventListener('click', async () => {
        const email = form.querySelector('input[type="email"]').value;
        const password = form.querySelector('input[type="password"]').value;
        await handleSignIn(email, password);
      });

      authFormContainer.appendChild(form);
    }

    function closeModal() {
      authModal.style.display = 'none';
    }

    authButton.addEventListener('click', (event) => {
      event.preventDefault();
      openModal();
    });

    signOutLink.addEventListener('click', (event) => {
      event.preventDefault();
      handleSignOut();
    });

    closeButton.addEventListener('click', closeModal);

    window.addEventListener('click', (event) => {
      if (event.target === authModal) {
        closeModal();
      }
    });

    supabase.auth.getSession().then(({ data: { session } }) => {
      user = session?.user;
      updateAuthUI();
    });
