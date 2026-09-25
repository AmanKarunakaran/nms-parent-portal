import { clearAll } from '../lib/storage'

export function ResetDemoButton() {
  function handleClick() {
    if (window.confirm('Reset all demo data? This clears anything you changed in the portal.')) {
      clearAll()
      window.location.reload()
    }
  }

  return (
    <button type="button" className="tab-bar__reset" onClick={handleClick}>
      Reset demo data
    </button>
  )
}
