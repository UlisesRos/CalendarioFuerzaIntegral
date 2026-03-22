// ─── authShared.js ─── estilos y componentes compartidos de autenticación ────

export const authStyles = `
    @keyframes fadeSlideUp {
        from { opacity: 0; transform: translateY(20px); }
        to   { opacity: 1; transform: translateY(0); }
    }
    @keyframes fieldIn {
        from { opacity: 0; transform: translateY(10px); }
        to   { opacity: 1; transform: translateY(0); }
    }

    .auth-header { animation: fadeSlideUp 0.6s cubic-bezier(0.22,1,0.36,1) both; }
    .auth-panel  { animation: fadeSlideUp 0.6s cubic-bezier(0.22,1,0.36,1) 0.08s both; }

    .auth-field { animation: fieldIn 0.4s cubic-bezier(0.22,1,0.36,1) both; }
    .auth-field:nth-child(1) { animation-delay: 0.05s; }
    .auth-field:nth-child(2) { animation-delay: 0.10s; }
    .auth-field:nth-child(3) { animation-delay: 0.15s; }

    .auth-label {
        font-family: 'Poppins', sans-serif;
        font-size: 0.72rem;
        font-weight: 600;
        letter-spacing: 0.1em;
        text-transform: uppercase;
        display: block;
        margin-bottom: 6px;
    }

    .auth-input {
        font-family: 'Poppins', sans-serif;
        font-size: 0.88rem;
        border-radius: 10px;
        padding: 11px 42px 11px 14px;
        border: 1px solid rgba(104,211,145,0.35);
        outline: none;
        width: 100%;
        box-sizing: border-box;
        transition: border-color 0.2s ease, box-shadow 0.2s ease;
    }
    .auth-input:focus {
        border-color: #68D391;
        box-shadow: 0 0 0 1px #68D391;
    }
    .auth-input::placeholder {
        color: rgba(160,174,192,0.6);
        font-size: 0.82rem;
    }
    .auth-input.no-icon {
        padding-right: 14px;
    }

    .auth-eye-btn {
        position: absolute;
        right: 10px;
        top: 50%;
        transform: translateY(-50%);
        background: none;
        border: none;
        cursor: pointer;
        color: rgba(160,174,192,0.7);
        font-size: 1rem;
        padding: 4px;
        transition: color 0.2s ease;
        display: flex;
        align-items: center;
        line-height: 1;
    }
    .auth-eye-btn:hover { color: #68D391; }

    .auth-submit-btn {
        font-family: 'Poppins', sans-serif;
        font-size: 0.88rem;
        font-weight: 700;
        letter-spacing: 0.12em;
        text-transform: uppercase;
        cursor: pointer;
        border-radius: 12px;
        padding: 13px 32px;
        border: 1px solid #68D391;
        color: #1a202c;
        background: #68D391;
        transition: all 0.3s cubic-bezier(0.22,1,0.36,1);
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 8px;
        margin-top: 4px;
    }
    .auth-submit-btn:hover:not(:disabled) {
        background: #4FBF72;
        border-color: #4FBF72;
        transform: translateY(-2px);
        box-shadow: 0 10px 28px rgba(104,211,145,0.4);
    }
    .auth-submit-btn:disabled {
        opacity: 0.6;
        cursor: not-allowed;
    }

    .auth-forgot-link {
        font-family: 'Poppins', sans-serif;
        font-size: 0.78rem;
        color: rgba(160,174,192,0.8);
        text-decoration: none;
        transition: color 0.2s ease;
        display: inline-block;
        margin-top: 2px;
    }
    .auth-forgot-link:hover { color: #68D391; }
`

export function AuthField({ label, required, children }) {
    return (
        <div className="auth-field">
            <label className="auth-label">
                {label} {required && <span style={{ color: '#68D391' }}>*</span>}
            </label>
            {children}
        </div>
    )
}