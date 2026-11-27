import React from 'react';
import { useAppState } from '../contexts/AppStateContext';
import { useRouter } from '../contexts/RouterContext';
import { AppHeader } from './AppHeader';
import './Onboarding.css';

const SUGGESTIONS = ['Deep work', 'Gym', 'Reading'];

/** Blocking first-run step: time always accumulates into a pool, so the app
 *  stays here until at least one exists (also if the last pool is deleted). */
export const Onboarding: React.FC = () => {
  const { addPool } = useAppState();
  const { navigate } = useRouter();
  const [name, setName] = React.useState('');
  const inputRef = React.useRef<HTMLInputElement>(null);
  const trimmed = name.trim();

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!trimmed) return;
    addPool(trimmed);
    navigate({ kind: 'home' }, { replace: true });
  };

  const pick = (suggestion: string) => {
    setName(suggestion);
    inputRef.current?.focus();
  };

  return (
    <>
      <AppHeader setup />
      <div className="view">
        <form className="onboarding" onSubmit={handleSubmit}>
          <div className="section-label">Setup · 01/01</div>
          <h1 className="onboarding__title">Name your first pool</h1>
          <p className="onboarding__copy">
            Every timer accumulates into a pool — a bucket like Deep work, Gym
            or Reading. Create one to begin; add more later from the gear.
          </p>
          <label className="onboarding__label" htmlFor="onboarding-pool-name">
            Pool name
          </label>
          <input
            ref={inputRef}
            id="onboarding-pool-name"
            className="onboarding__input"
            type="text"
            value={name}
            onChange={event => setName(event.target.value)}
            autoComplete="off"
            autoFocus
            maxLength={40}
            placeholder="e.g. Deep work"
          />
          <div className="onboarding__suggestions">
            {SUGGESTIONS.map(suggestion => (
              <button
                key={suggestion}
                type="button"
                className={`onboarding__suggestion${
                  trimmed === suggestion ? ' onboarding__suggestion--picked' : ''
                }`}
                onClick={() => pick(suggestion)}
              >
                {suggestion}
              </button>
            ))}
          </div>
          <button type="submit" className="onboarding__submit" disabled={!trimmed}>
            Create pool →
          </button>
        </form>
      </div>
    </>
  );
};
