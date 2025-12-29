import { useState} from 'react';
import { Plus } from 'lucide-react';
import CreatePostModal from './CreatePostModal';
import type { CreatePostPayload } from '../post.types';

function CreatePostButton() {
  const [open, setOpen] = useState(false);

  const handleCreate = (data: CreatePostPayload) => {
    console.log("Create post payload:", data);
    // call API here
  };

  return (
    <>
      { !open &&
        <button className='inline-flex items-center justify-center p-4 rounded-full bg-blue-600/10 backdrop-blur-md border border-white/20 shadow-lg'
      onClick={() => setOpen(true)}
      >
        <Plus className=' w-8 h-8' strokeWidth={2.5}/>
      </button>
      }

      <CreatePostModal
          isOpen={open}
          onClose={() => setOpen(false)}
          onSubmit={handleCreate}
      />
      </>
  )
}

export default CreatePostButton