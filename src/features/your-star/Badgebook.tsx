import { badges } from '../../data/badges'
import { formatDate } from './formatDates'
import './Badgebook.css'

export function Badgebook() {
  const earned = badges.filter((badge) => badge.earnedOn)
  return (
    <section className="badgebook" aria-labelledby="badgebook-title">
      <h3 id="badgebook-title" className="badgebook__title">
        Badgebook <span className="badgebook__note">(I made these up)</span>
      </h3>
      <ul className="badgebook__row">
        {earned.map((badge) => {
          const details = `${badge.name}: ${badge.requirement} Earned ${formatDate(badge.earnedOn!)}.`
          return (
            <li key={badge.id} className="badgebook__badge">
              {/* Focusable so keyboard and touch users can reach the tooltip too. */}
              <span className="badgebook__picture" tabIndex={0} role="img" aria-label={details}>
                {badge.picture}
              </span>
              <span className="badgebook__tooltip" aria-hidden="true">
                <strong>{badge.name}</strong>
                <span>{badge.requirement}</span>
                <span>Earned {formatDate(badge.earnedOn!)}</span>
              </span>
            </li>
          )
        })}
      </ul>
    </section>
  )
}
