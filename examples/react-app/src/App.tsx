import React, { } from 'react'
import { createGlobalStyle } from 'styled-components'
import Foo from './pages/foo/index'
import Bar from './pages/bar/index'
import Faz from './pages/faz/index'

import './App.scss'
import './App.less'
import './App.css'

const GlobalStyle = createGlobalStyle`
  #root {
    padding: var(--s-2, 8px);
    background-color: var(--color-fill1-1);
  }
  .GlobalStyle.styled {}
`

export default function App () {
  return <>
    <GlobalStyle />
    <h1>App</h1>
    <div>
      <b>process.platform: </b>
      <i>{typeof process.platform} </i>
      <code>{JSON.stringify(process.platform)}</code>
    </div>
    <div>
      <b>process.env.NODE_ENV: </b>
      <i>{typeof process.env.NODE_ENV} </i>
      <code>{JSON.stringify(process.env.NODE_ENV)}</code>
    </div>
    <div>
      <b>process.env.MM_MODE: </b>
      <i>{typeof process.env.MM_MODE} </i>
      <code>{JSON.stringify(process.env.MM_MODE)}</code>
    </div>
    {/* <div>
      <b>process.env: </b>
      <i>{typeof process.env} </i>
      <code>{JSON.stringify(process.env, null, 2)}</code>
    </div> */}
    <hr />
    <Foo />
    <hr />
    <Bar />
    <hr />
    <Faz />
  </>
}
