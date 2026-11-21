import logo from '../../assets/logo.png'

export function Navbar(): React.JSX.Element {
  return (
    <header className="navbar">
      <img src={logo} alt="" className="navbar-logo" />
      <span className="navbar-brand">Radiation Shielding Estimator</span>
    </header>
  )
}
