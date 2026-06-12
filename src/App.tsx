import { Github, AlertCircle } from 'lucide-react';

function App() {
  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center p-4 text-center text-black">
      <div className="bg-white border border-black p-8 md:p-12 rounded-3xl max-w-lg w-full">
        <div className="flex justify-center mb-8">
          <AlertCircle className="w-16 h-16 text-black" strokeWidth={1} />
        </div>
        
        <h1 className="text-3xl md:text-4xl font-extrabold text-black mb-4 tracking-tight uppercase">
          Service Suspended
        </h1>
        
        <p className="text-black mb-10 text-lg leading-relaxed font-medium">
          The backend server has been temporarily stopped due to insufficient AWS credits. 
          Normal operations will resume once the service is restored.
        </p>

        <a 
          href="https://github.com/manishbobburi/interview-experiences-frontend"
          target="_blank" 
          rel="noopener noreferrer"
          className="inline-flex items-center gap-3 bg-black text-white px-8 py-4 rounded-xl font-bold uppercase tracking-wider transition-opacity hover:opacity-80"
        >
          <Github className="w-6 h-6" />
          <span>View Source on GitHub</span>
        </a>
      </div>
      
      <div className="mt-12 text-sm text-black font-bold uppercase tracking-widest flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-black animate-pulse"></span>
        System Offline
      </div>
    </div>
  )
}

export default App
