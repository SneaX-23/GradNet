import React from "react";

function LoginForm({ usn, setUsn, onSubmit, isLoading, error }){

    const handleSubmit = (event) => {
    event.preventDefault();
    onSubmit();
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="form-group">
        <label htmlFor="usn">University Serial Number</label>
        <input 
          id="usn"
          type="text"
          value={usn}
          onChange={(e) => setUsn(e.target.value)}
          placeholder="Enter your USN"
          required
        />
      </div>
      
      {error && <p className="error-message">{error}</p>}

      <button type="submit" disabled={isLoading}>
        {isLoading ? 'Loading...' : 'Continue'}
      </button>
    </form>
  );
}

export default LoginForm;