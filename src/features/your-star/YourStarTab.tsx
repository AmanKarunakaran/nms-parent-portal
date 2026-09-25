import { star } from '../../data/star'
import './YourStarTab.css'

export function YourStarTab() {
  return (
    <section>
      <h2 className="your-star__title">Your Star: {star.name}</h2>
      <p className="your-star__placeholder">
        Courses, competition results, and summer camps will appear here, year by year.
      </p>
    </section>
  )
}
