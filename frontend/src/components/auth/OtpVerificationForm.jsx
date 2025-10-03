import React from "react";
import { useNavigate } from "react-router-dom";

function OtpVerificationForm({
  otp,
  setOtp,
  onSubmit,
  error,
  email,
  handleResendOtp,
  isResending,
  resendStatus
}) {
  const navigate = useNavigate();
  const handleClick = () => {
    navigate("/");
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    onSubmit();
  };

  return (
    <>
      <h2>Verify OTP</h2>
      <p className="subtitle">We've sent a verification code to your email.</p>
      
      <div className="email-confirmation-box">
        OTP has been sent to <strong>{email}</strong>
      </div>

      <form className="otp-form" onSubmit={handleSubmit}>
        <div>
          <label htmlFor="otp" className="form-label">Enter OTP</label>
          <input
            id="otp"
            type="tel"
            inputMode="numeric"
            maxLength="6"
            pattern="[0-9]{6}"
            value={otp}
            onChange={(e) => {
              const value = e.target.value;
              if (/^\d*$/.test(value)) {
                setOtp(value);
              }
            }}
            placeholder="000000"
            required
          />
        </div>

        {error && <p className="error-message">{error}</p>}
        {resendStatus && <p className="resend-status-message">{resendStatus}</p>}

        <button type="submit">Verify OTP</button>

        <button
          type="button"
          className="resend-button"
          onClick={handleResendOtp}
          disabled={isResending}
        >
          {isResending ? 'Sending...' : 'Resend OTP'}
        </button>
      </form>
      <button type="button" className="back-to-login" onClick={handleClick}>← Back to login</button>
    </>
  );
}

export default OtpVerificationForm;