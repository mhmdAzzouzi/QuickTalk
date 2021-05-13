function Loading() {
  return (
    <center
      style={{
        display: "grid",
        placeItems: "center",
        height: "100vh",
        backgroundColor: "#141414",
      }}
    >
      <div>
        <img
          src="/Loading.png"
          alt=""
          style={{ marginBottom: "10px" }}
          height={200}
        />
      </div>
    </center>
  );
}

export default Loading;
