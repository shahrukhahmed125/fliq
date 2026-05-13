import Spinner from './Spinner'

function ScreenLoader({ message = 'Loading...' }) {
  return (
    <div className="screen-loader">
      <div className="screen-loader-content">
        <Spinner size={48} color="accent" />
        <p className="screen-loader-message">{message}</p>
      </div>
    </div>
  )
}

export default ScreenLoader
