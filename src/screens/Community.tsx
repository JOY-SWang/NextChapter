import { useNavigate } from 'react-router-dom';
import { Screen } from '../components/Screen';
import { Icon } from '../components/Icon';
import { Photo } from '../components/Photo';
import { Button, Overline, Pill } from '../components/ui';
import { useApp } from '../context/AppContext';
import { R } from '../routes';

/** Peer Circles / My Day segmented switch shared by P7 and P7.2. */
export function CommunityTabs({ active }: { active: 'circles' | 'day' }) {
  const nav = useNavigate();
  return (
    <div className="seg-tabs" role="tablist" aria-label="Community sections">
      <button type="button" role="tab" aria-selected={active === 'circles'} className={active === 'circles' ? 'is-on' : ''} onClick={() => nav(R.community)}>
        Peer Circles
      </button>
      <button type="button" role="tab" aria-selected={active === 'day'} className={active === 'day' ? 'is-on' : ''} onClick={() => nav(R.myDay)}>
        My Day
      </button>
    </div>
  );
}

/** P7 - Community ("Support & Connections"). */
export function Community() {
  const nav = useNavigate();
  const { openOverlay } = useApp();
  return (
    <Screen tab="community" label="Community">
      <h1 className="t-h1">Support &amp; Connections</h1>
      <CommunityTabs active="circles" />
      <p className="t-body-lg muted">You don't have to navigate your transition alone.</p>

      <section className="card card-card stack-16">
        <div className="stack-4">
          <Overline icon="sparkle" color="var(--secondary-text)">
            CURATED PEER CIRCLE
          </Overline>
          <h2 className="t-h2">Later-Life Tech to Wellness</h2>
          <p className="t-body muted">8 active peers aged 42–58 actively transitioning from corporate tech to wellness, coaching &amp; movement arts.</p>
        </div>
        <div className="peers-row">
          <div className="avatar-stack">
            <Photo name="peer-1" alt="Peer" round />
            <Photo name="peer-2" alt="Peer" round />
            <Photo name="peer-3" alt="Peer" round />
            <span className="avatar-more">+5</span>
          </div>
          <span className="row gap-6 t-label muted">
            <span className="live-dot" /> Active today
          </span>
        </div>
        <div className="dialogue">
          <span className="t-label terracotta">Weekly Open Dialogue</span>
          <p className="t-quote-sm">“How did you overcome the 'starting over at 45+' imposter feeling?”</p>
          <div className="row-between">
            <span className="row gap-6 t-body muted">
              <Icon name="chat-lines" size={16} /> 14 encouraging replies
            </span>
            <button type="button" className="unstyled row gap-2 t-label terracotta" onClick={() => nav(R.messages)}>
              Read thread <Icon name="chevron-right" size={14} />
            </button>
          </div>
        </div>
        <div className="gathering">
          <div className="row gap-12 align-start">
            <span className="icon-tile tile-white" style={{ width: 40, height: 40, borderRadius: 10 }}>
              <Icon name="calendar" size={20} />
            </span>
            <div className="stack-2">
              <span className="t-overline muted">NEXT CIRCLE GATHERING</span>
              <span className="t-h3">This Thursday · 7:00 PM</span>
              <span className="t-body muted">Online casual coffee chat · 5 peers RSVPed</span>
            </div>
          </div>
          <Button variant="strong" icon="check-circle" onClick={() => openOverlay('rsvp')}>
            Join Gathering (RSVP)
          </Button>
        </div>
      </section>

      <section className="card card-card stack-16">
        <div className="row-between align-start">
          <div className="stack-2">
            <Overline icon="verified" color="var(--tertiary-key)">
              LIVED-EXPERIENCE MENTORS
            </Overline>
            <h2 className="t-h2">Book 1:1 Human Guide</h2>
          </div>
          <Pill tone="terracotta">Verified</Pill>
        </div>
        <div className="row gap-16">
          <Photo name="elena" alt="Elena Rostova" style={{ width: 80, height: 80, borderRadius: 16 }} />
          <div className="stack-4">
            <span className="t-h3">Elena Rostova</span>
            <span className="t-body muted">E-RYT 500 · Former tech program manager</span>
            <Pill tone="neutral">Transitioned at age 51</Pill>
          </div>
        </div>
        <p className="card card-low t-body muted" style={{ padding: 14 }}>
          Elena moved from tech to teaching 6 years ago. Ask her about income, certification and pacing yourself.
        </p>
        <div className="stack-8">
          <Button variant="terracotta" icon="video" onClick={() => openOverlay('chatBooked')}>
            Schedule 30-min Chat (Free)
          </Button>
          <p className="t-label muted center">No obligations · Next Chapter covers your first session</p>
        </div>
      </section>

      <section className="card card-dark stack-14">
        <div className="row gap-12 align-start">
          <span className="icon-tile tile-on-dark" style={{ width: 36, height: 36, borderRadius: 18 }}>
            <Icon name="refresh" size={18} />
          </span>
          <div className="stack-4">
            <h2 className="t-h3 on-dark">Keep Your Plan In Sync</h2>
            <p className="t-body on-dark-muted">Had a chat with Elena or finished a trial class? Tell AI Coach and it will update your roadmap.</p>
          </div>
        </div>
        <Button variant="light" trailing="arrow-right" block={false} className="btn-fit" onClick={() => nav(R.coach)}>
          Tell AI Coach
        </Button>
      </section>
    </Screen>
  );
}
