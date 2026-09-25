import { badges } from '../../data/badges'
import { formatDate } from './formatDates'
import './Badgebook.css'

export function Badgebook() {
  const earned = badges.filter((badge) => badge.earnedOn)
  return (
    <section className="badgebook" aria-labelledby="badgebook-title">
      <h3 id="badgebook-title" className="badgebook__title">
        Badgebook
      </h3>
      <p className="badgebook__hint">
        {earned.length} of {badges.length} pins earned. Faded pins are still waiting to be won!
      </p>
      <ul className="badgebook__grid">
        {badges.map((badge) => (
          <li
            key={badge.id}
            className={`badgebook__badge${badge.earnedOn ? '' : ' badgebook__badge--locked'}`}
          >
            <span className="badgebook__picture" aria-hidden="true">
              {badge.picture}
            </span>
            <span className="badgebook__name">{badge.name}</span>
            <span className="badgebook__requirement">{badge.requirement}</span>
            <span className="badgebook__status">
              {badge.earnedOn ? `Earned ${formatDate(badge.earnedOn)}` : 'Not earned yet'}
            </span>
          </li>
        ))}
      </ul>
    </section>
  )
}
