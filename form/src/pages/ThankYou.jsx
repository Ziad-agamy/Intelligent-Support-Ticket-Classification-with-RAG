import { useLocation, Link } from 'react-router-dom'
import ReactMarkdown from 'react-markdown'
import './ThankYou.css'

function ThankYou() {
  const location = useLocation()
  const { response, userName } = location.state || { response: '', userName: 'there' }

  return (
    <div className="thankyou-container">
      <div className="thankyou-card">
        <div className="thankyou-icon">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
            <polyline points="22 4 12 14.01 9 11.01" />
          </svg>
        </div>

        <h1 className="thankyou-title">
          Thank You, {userName}!
        </h1>

        <p className="thankyou-subtitle">
          We've received your ticket and our team will get back to you shortly.
        </p>

        <div className="response-card">
          <div className="response-card-header">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="info-icon"
            >
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="16" x2="12" y2="12" />
              <line x1="12" y1="8" x2="12.01" y2="8" />
            </svg>
            <h2>Here's what we found</h2>
          </div>
          <div className="response-card-content">
            <ReactMarkdown>{response}</ReactMarkdown>
          </div>
        </div>

        <div className="reference-info">
          <p>
            <strong>Ticket Reference:</strong> #{Math.random().toString(36).substr(2, 9).toUpperCase()}
          </p>
          <p>
            <strong>Response Time:</strong> Usually within 24 hours
          </p>
        </div>

        <Link to="/" className="back-btn">
          Submit Another Ticket
        </Link>
      </div>
    </div>
  )
}

export default ThankYou
