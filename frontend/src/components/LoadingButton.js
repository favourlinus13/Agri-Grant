function LoadingButton({ loading, onClick, children, className }) {
    return (
        <button className={`btn ${className}`} onClick={onClick} disabled={loading} style={{ backgroundColor: '#606c38', color: '#fefae0' }}>
            {loading ? (
                <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
            ) : (
                children
            )}
        </button>
    );
}

export default LoadingButton