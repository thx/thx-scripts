import React, { useEffect, useState } from 'react'

export default () => {
  const [data, setData] = useState({})
  useEffect(() => {
    window.fetch('/bar')
      .then(resp => resp.json())
      .then(json => setData(json))
  }, [])
  return <div>
    <h2>Bar</h2>
    <div>hello, i am react Bar.</div>
    <pre>{JSON.stringify(data, null , 2)}</pre>
  </div>
}
