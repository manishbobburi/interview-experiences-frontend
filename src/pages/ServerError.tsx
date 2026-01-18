function ServerError() {
  return (
    <div className="flex min-h-screen max-w-7xl  mx-auto flex-col text-center justify-center">
        <h1 className="text-2xl font-semibold">500 - Internal Server Error</h1>
        <p className="mt-2 text-gray-600">Please try again later.</p>
    </div>
  )
}

export default ServerError;