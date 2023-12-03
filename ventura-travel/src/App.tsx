import NavBar from "./components/NavBar";
import PostList from "./components/PostList";

function App() {
  return (
    <>
      <NavBar />
      <div className="mx-auto w-full pt-3 pb-3">
        <PostList />
      </div>
    </>
  );
}

export default App;
