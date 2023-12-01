import NavBar from "./components/NavBar";
import PostList from "./components/PostList";

function App() {
  return (
    <>
      <NavBar />
      <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
        <PostList />
      </div>
    </>
  );
}

export default App;
