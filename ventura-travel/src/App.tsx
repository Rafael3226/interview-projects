import NavBar from "./components/NavBar";
import PostList from "./components/PostList";

function App() {
  return (
    <>
      <div className="max-w-screen-xl mx-auto w-full">
        <NavBar />

        <PostList />
      </div>
    </>
  );
}

export default App;
