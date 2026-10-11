import { useId } from 'react'

/**
 * Reusable Fliq Checkbox component.
 * Features custom SVG checkmark with draw/pop animation, full keyboard support,
 * visible focus ring, and clean typographic hierarchy for label and description.
 */
export default function Checkbox({
  checked = false,
  onChange,
  label,
  description,
  disabled = false,
  error = false,
  id,
  name,
  className = '',
  style,
  ...props
}) {
  const generatedId = useId()
  const inputId = id || generatedId

  return (
    <label
      htmlFor={inputId}
      className={`fliq-checkbox-wrapper ${disabled ? 'disabled' : ''} ${error ? 'error' : ''} ${className}`}
      style={style}
    >
      <div className="fliq-checkbox-container">
        <input
          id={inputId}
          name={name}
          type="checkbox"
          className="fliq-checkbox-input"
          checked={checked}
          disabled={disabled}
          onChange={(e) => {
            if (onChange) {
              onChange(e.target.checked, e)
            }
          }}
          {...props}
        />
        <div
          className={`fliq-checkbox-box ${checked ? 'checked' : ''}`}
          aria-hidden="true"
        >
          <svg
            className={`fliq-checkbox-checkmark ${checked ? 'visible' : ''}`}
            viewBox="0 0 16 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M3.5 8.5L6.5 11.5L12.5 4.5"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      </div>

      {(label || description) && (
        <div className="fliq-checkbox-text">
          {label && <strong className="fliq-checkbox-label">{label}</strong>}
          {description && <small className="fliq-checkbox-desc">{description}</small>}
        </div>
      )}
    </label>
  )
}
