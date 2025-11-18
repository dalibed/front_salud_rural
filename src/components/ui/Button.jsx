export default function Button({ children, color = "primary", onClick, type = "button" }) {
    return (
    <button type={type} className={`btn btn-${color}`} onClick={onClick}>
        {children}
    </button>
    );
}
