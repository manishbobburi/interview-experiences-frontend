function Offline() {
  return (
    <div className="flex min-h-screen max-w-7xl  mx-auto flex-col text-center justify-center">
        <h1 className="text-2xl font-semibold">Server Unavailable</h1>
        <p className="mt-2 text-gray-600">Cannot reach the server. Please try again later.</p>
    </div>
  )
}

export default Offline;