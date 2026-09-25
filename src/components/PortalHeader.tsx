import './PortalHeader.css'

type PortalHeaderProps = {
  starName: string
}

export function PortalHeader({ starName }: PortalHeaderProps) {
  return (
    <header className="portal-header">
      <div className="portal-header__inner">
        <h1 className="portal-header__title">National Math Stars Parent Portal</h1>
        <span className="portal-header__star">
          <span aria-hidden="true">★</span> {starName}
        </span>
      </div>
    </header>
  )
}
