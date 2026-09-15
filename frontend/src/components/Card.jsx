const Card = ({ children, className = '', hover = false }) => (
  <div className={`card p-6 ${hover ? 'hover:shadow-md hover:-translate-y-0.5 transition-all' : ''} ${className}`}>
    {children}
  </div>
);

export default Card;
