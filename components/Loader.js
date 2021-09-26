const Loader = ({ small }) => {
  return (
    <div>
      <div className={`loader ${small ? "loader-small" : ""}`}>
        {[1, 2, 3, 4, 5].map((i) => (
          <div
            className="circle"
            key={i}
            style={{ animationDelay: `${i / 10}s` }}
          ></div>
        ))}
      </div>
    </div>
  );
};

export default Loader;
