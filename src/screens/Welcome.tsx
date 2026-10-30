import { Screen } from '../components/Screen';
import { Icon } from '../components/Icon';
import { Photo } from '../components/Photo';
import { Button } from '../components/ui';
import { useApp } from '../context/AppContext';

/** P1 - Welcome Page */
export function Welcome() {
  const { openOverlay } = useApp();
  return (
    <Screen top="status" label="Welcome" contentClassName="welcome">
      <div className="welcome-brand">
        <Icon name="sprout" size={24} stroke={2} color="var(--primary-key)" />
        <span>Next Chapter</span>
      </div>
      <Photo name="hero-welcome" alt="A woman in her fifties journalling with a cup of tea in a sunlit living room" className="welcome-hero" />
      <div className="welcome-message">
        <h1 className="t-display">Your next chapter starts with what you already have.</h1>
        <p className="t-body-lg muted">Laid off, retiring or ready for a career change? Rediscover your strengths and explore what’s next.</p>
      </div>
      <div className="grow" />
      <div className="welcome-cta">
        <Button pill size="lg" trailing="arrow-right" className="btn-shadow" onClick={() => openOverlay('meetJoyy')}>
          Discover My Next Chapter
        </Button>
        <p className="t-caption outline center">Your experience matters. Your next step is yours.</p>
      </div>
    </Screen>
  );
}
