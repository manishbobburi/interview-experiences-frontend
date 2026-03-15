import { useState } from 'react';
import { Outlet, useLocation  } from 'react-router-dom';
import Navbar from './components/Navbar';
import CreatePostButton from './features/posts/components/CreatePostButton';

function App() {
  const [searchQuery, setSearchQuery] = useState("");
  const location = useLocation();

  const showCreatePostButton = location.pathname === "/" || location.pathname.startsWith("/user/");

  return (
    <>
    <Navbar setSearchQuery={setSearchQuery} searchQuery={searchQuery}/>
    <Outlet context={{ searchQuery }}/>
    { showCreatePostButton && <CreatePostButton />}
    </>
  )
}

export default App
