import React from "react"
const OrderBook = React.lazy(() => import("./OrderBook"))

function App() {

  return (
    <>
      <div className="row  mt-4 mx-2">
        <React.Suspense fallback={"Loading...."}>
          <OrderBook />
        </React.Suspense>
      </div>
    </>
  )
}

export default App