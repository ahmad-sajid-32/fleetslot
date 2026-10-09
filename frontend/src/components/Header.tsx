export function Header() {
  return (
    <header className="app-header">
      <a className="brand" href="/" aria-label="FleetSlot home">
        <span className="brand-mark">F</span>
        FleetSlot
        <span className="brand-divider" />
        <span className="brand-caption">OPERATIONS WORKSPACE</span>
      </a>
      <div className="demo-label">
        <span className="status-dot" />
        Demo fleet <span className="avatar">OP</span>
      </div>
    </header>
  );
}
