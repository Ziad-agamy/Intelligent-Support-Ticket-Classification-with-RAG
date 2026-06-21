import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './Form.css'

function App() {
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    question: ''
  })
  const [status, setStatus] = useState({ type: '', message: '' })
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setStatus({ type: '', message: '' })

    try {
      const API_URL = import.meta.env.VITE_API_URL || ""
      const response = await fetch(`${API_URL}/support/submit`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      })

      const result = await response.json()

      if (response.ok) {
        navigate('/thank-you', {
          state: {
            response: result.llm_response,
            userName: formData.first_name
          }
        })
      } else {
        setStatus({ type: 'error', message: result.detail || 'Something went wrong. Please try again.' })
      }
    } catch (error) {
      setStatus({ type: 'error', message: 'Network error. Please check your connection and try again.' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="form-container">
      <div className="form-header">
        <h1>Contact Support</h1>
        <p>Fill out the form below and we'll get back to you as soon as possible.</p>
      </div>

      <form onSubmit={handleSubmit} className="support-form">
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="firstName">First Name</label>
            <input
              type="text"
              id="firstName"
              name="first_name"
              value={formData.first_name}
              onChange={handleChange}
              required
              placeholder="John"
            />
          </div>

          <div className="form-group">
            <label htmlFor="lastName">Last Name</label>
            <input
              type="text"
              id="lastName"
              name="last_name"
              value={formData.last_name}
              onChange={handleChange}
              required
              placeholder="Doe"
            />
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            placeholder="john.doe@example.com"
          />
        </div>

        <div className="form-group">
          <label htmlFor="phone">Phone</label>
          <input
            type="tel"
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            required
            placeholder="+1 (555) 123-4567"
          />
        </div>

        <div className="form-group">
          <label htmlFor="question">Query</label>
          <textarea
            id="question"
            name="question"
            value={formData.question}
            onChange={handleChange}
            required
            placeholder="Describe your issue or question..."
            rows="5"
          />
        </div>

        {status.message && (
          <div className={`status-message ${status.type}`}>
            {status.message}
          </div>
        )}

        <button type="submit" className="submit-btn" disabled={loading}>
          {loading ? 'Processing...' : 'Submit Ticket'}
        </button>
      </form>
    </div>
  )
}

export default App
