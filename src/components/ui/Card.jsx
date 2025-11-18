export default function Card({ title, children }) {
    return (
    <div className="card shadow-sm mb-3">
        {title && <div className="card-header fw-bold">{title}</div>}
        <div className="card-body">{children}</div>
    </div>
    );
}
