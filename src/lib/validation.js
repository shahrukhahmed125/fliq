export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

export const validatePassword = (password) => {
  return password && password.length >= 8
}

export const validateName = (name) => {
  return name && name.trim().length >= 2
}

export const validateForm = (formData, rules) => {
  const errors = {}

  Object.keys(rules).forEach((field) => {
    const value = formData[field]
    const rule = rules[field]

    if (rule.required && !value) {
      errors[field] = `${capitalizeFirst(field)} is required`
    }

    if (rule.email && value && !validateEmail(value)) {
      errors[field] = 'Invalid email address'
    }

    if (rule.minLength && value && value.length < rule.minLength) {
      errors[field] = `${capitalizeFirst(field)} must be at least ${rule.minLength} characters`
    }
  })

  return errors
}

const capitalizeFirst = (str) => {
  return str.charAt(0).toUpperCase() + str.slice(1)
}
