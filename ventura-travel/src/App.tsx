import NavBar from "./components/NavBar";
import PostList from "./components/PostList";
import island from "./assets/island.png";

const backgroundStyle = {
  backgroundImage: `url(${island})`,
  backgroundSize: "cover", // Adjust as needed
  backgroundPosition: "center center", // Adjust as needed
  backgroundAttachment: "fixed",
  backgroundRepeat: "no-repeat",
  margin: 0, // Remove default body margin
};

function App() {
  return (
    <>
      <div style={backgroundStyle}>
        <NavBar />
        <div className="mx-auto w-full pt-3 pb-3">
          <PostList />
        </div>
      </div>
    </>
  );
}

export default App;
