import React, { useEffect, useState } from 'react'

export default () => {
  const [data, setData] = useState({})
  useEffect(() => {
    window.fetch('/faz', { method: 'POST' })
      .then(resp => resp.status === 200 ? resp.json() : {})
      .then(json => setData(json))
  }, [])
  return <div>
    <h2>Faz</h2>
    <div>hello, i am react Faz.</div>
    <pre>{JSON.stringify(data, null, 2)}</pre>
  </div>
}
