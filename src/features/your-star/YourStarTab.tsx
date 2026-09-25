import { star } from '../../data/star'
import './YourStarTab.css'

export function YourStarTab() {
  return (
    <section>
      <p className="your-star__intro">Here is your Star</p>
      <h2 className="your-star__name">{star.name}</h2>
      <p className="your-star__placeholder">
        Courses, competition results, and summer camps will appear here, year by year.
      </p>
    </section>
  )
}
