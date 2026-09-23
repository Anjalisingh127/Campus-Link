import { useState } from 'react';
import { login, register } from '../api/authApi.js';

export function AuthPage({ mode, onAuthenticated }) {
  const isRegister = mode === 'register';
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [state, setState] = useState({ submitting: false, error: '' });

  function updateField(event) {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setState({ submitting: true, error: '' });
    try {
      const response = isRegister
        ? await register(form)
        : await login({ email: form.email, password: form.password });
      onAuthenticated(response.data);
      window.location.hash = '#/events';
    } catch (error) {
      setState({ submitting: false, error: error.message });
    }
  }

  return (
    <section className="auth-layout">
      <div className="auth-message">
        <p className="section-kicker">Secure access</p>
        <h1>{isRegister ? 'Join CampusConnect.' : 'Welcome back.'}</h1>
        <p>{isRegister ? 'Create an attendee account to establish your campus profile.' : 'Sign in to manage authorized CampusConnect workflows.'}</p>
      </div>
      <form className="auth-card" onSubmit={handleSubmit}>
        <h2>{isRegister ? 'Create account' : 'Sign in'}</h2>
        {state.error && <div className="form-alert" role="alert">{state.error}</div>}
        {isRegister && <label className="form-field"><span>Name</span><input name="name" value={form.name} minLength="2" maxLength="80" required onChange={updateField} autoComplete="name" /></label>}
        <label className="form-field"><span>Email</span><input name="email" type="email" value={form.email} required onChange={updateField} autoComplete="email" /></label>
        <label className="form-field"><span>Password</span><input name="password" type="password" value={form.password} minLength={isRegister ? 8 : undefined} maxLength="72" required onChange={updateField} autoComplete={isRegister ? 'new-password' : 'current-password'} /></label>
        <button className="primary-button" type="submit" disabled={state.submitting}>{state.submitting ? 'Please wait…' : isRegister ? 'Create account' : 'Sign in'}</button>
        <p className="auth-switch">{isRegister ? 'Already registered?' : 'New to CampusConnect?'} <a href={isRegister ? '#/login' : '#/register'}>{isRegister ? 'Sign in' : 'Create an account'}</a></p>
      </form>
    </section>
  );
}
