import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './components/Navbar';
import CreatePostButton from './features/posts/components/CreatePostButton';

function App() {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <>
    <Navbar setSearchQuery={setSearchQuery} searchQuery={searchQuery}/>
    <Outlet context={{ searchQuery }}/>
    <CreatePostButton />
    </>
  )
}

export default App
