import React, { useEffect, useState } from 'react'
import { Button } from '@alifd/next'

export default () => {
  const [data, setData] = useState({})
  useEffect(() => {
    window.fetch('/foo')
      .then(resp => resp.status === 200 ? resp.json() : {})
      .then(json => setData(json))
  }, [])
  return <div>
    <h2>Foo</h2>
    <div>hello, i am react Foo.</div>
    <Button type='primary'>Foo Theme Example</Button>
    <pre>{JSON.stringify(data, null, 2)}</pre>
  </div>
}
