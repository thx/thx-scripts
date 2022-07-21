import fetch, { Response } from 'node-fetch'
import { redBright, yellowBright, greenBright, gray } from 'chalk'
import * as http from 'http'
import * as https from 'https'
import { join, resolve } from 'path'
import { readFileSync, writeFileSync } from 'fs'
import * as puppeteer from 'puppeteer'
import { IDevEnv } from './index.d'
import { killPort, portIsOccupied } from '../src/utils/net'
import { expect } from 'chai'
import { delay } from './shared'

async function genResponseLogArray (resp: Response | void, type: 'html' | 'javascript' | 'json') {
  const next: string[] = []
  if (!resp) return next

  const { status } = resp
  next.push(status === 200 ? greenBright`${status}` : redBright`${status}`, gray`length: ${resp.headers.get('content-length')},`)
  switch (type) {
    case 'html':
    case 'javascript':
      next.push(gray`content: ${(await resp.text()).split('\n')[0]}`)
      break
    case 'json':
      next.push(gray`content: ${JSON.stringify(await resp.json())}`)
      break
  }
  return next
}

async function validDevServerOutputHtml (url: string, done: (err?: any) => void, LOG_PREFIX: string) {
  const resp = await fetch(url, { headers: { accept: 'html' } })
    .then(
      (resp) => resp,
      (error) => {
        console.error(error)
        done(error)
      }
    )
  expect(resp).to.be.not.eq(undefined)
  if (resp) expect(resp.status).to.be.eq(200)
  console.log(LOG_PREFIX, `fetch`, yellowBright.underline`${url}`, ...await genResponseLogArray(resp, 'html'))
}

async function validDevServerOutputJavascript (url: string, done: (err?: any) => void, LOG_PREFIX: string) {
  const resp = await fetch(url, { headers: { accept: 'javascript' } })
    .then(
      (resp) => resp,
      (error) => {
        console.error(error)
        done(error)
      }
    )
  expect(resp).to.be.not.eq(undefined)
  if (resp) expect(resp.status).to.be.eq(200)
  console.log(LOG_PREFIX, `fetch`, yellowBright.underline`${url}`, ...await genResponseLogArray(resp, 'javascript'))
}

async function validDevServerOutputJSON (method: 'GET' | 'POST' = 'GET', url: string, done: (err?: any) => void, LOG_PREFIX: string) {
  const resp = await fetch(url, { method, headers: { 'Content-Type': 'application/json' } })
    .then(
      (resp) => resp,
      (error) => {
        console.error(error)
        done(error)
      }
    )
  expect(resp).to.be.not.eq(undefined)
  if (resp) expect(resp.status).to.be.eq(200)
  console.log(LOG_PREFIX, `fetch`, yellowBright.underline`${url}`, ...await genResponseLogArray(resp, 'json'))
}

async function validDevServerOutput (testEnv: IDevEnv, done: (err?: any) => void, LOG_PREFIX: string) {
  if (testEnv.HTTPS) process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0'

  await validDevServerOutputHtml(`${testEnv.HTTPS ? 'https' : 'http'}://127.0.0.1:${testEnv.PORT}`, done, LOG_PREFIX)
  await validDevServerOutputHtml(`${testEnv.HTTPS ? 'https' : 'http'}://127.0.0.1:${testEnv.PORT}/favicon.ico`, done, LOG_PREFIX)
  await validDevServerOutputHtml(`${testEnv.HTTPS ? 'https' : 'http'}://127.0.0.1:${testEnv.PORT}/a.html`, done, LOG_PREFIX)
  await validDevServerOutputHtml(`${testEnv.HTTPS ? 'https' : 'http'}://127.0.0.1:${testEnv.PORT}/a/b.html`, done, LOG_PREFIX)
  await validDevServerOutputHtml(`${testEnv.HTTPS ? 'https' : 'http'}://127.0.0.1:${testEnv.PORT}/a/b/c.html`, done, LOG_PREFIX)
  await validDevServerOutputJavascript(`${testEnv.HTTPS ? 'https' : 'http'}://127.0.0.1:${testEnv.PORT}/index.js`, done, LOG_PREFIX)
  await validDevServerOutputJavascript(`${testEnv.HTTPS ? 'https' : 'http'}://127.0.0.1:${testEnv.PORT}/portal.js`, done, LOG_PREFIX)
  await validDevServerOutputJavascript(`${testEnv.HTTPS ? 'https' : 'http'}://127.0.0.1:${testEnv.PORT}/remote.js`, done, LOG_PREFIX)
}

async function validDevServerOutputProxyServer (testEnv: IDevEnv, done: (err?: any) => void, LOG_PREFIX: string) {
  const { PORT, HTTPS, PROXY_IP, PROXY_HTTPS, PROXY_PORT } = testEnv

  console.log(LOG_PREFIX, `Try to create proxy server ${PROXY_IP}:${PROXY_PORT}`)
  const server = (PROXY_HTTPS ? https : http).createServer({
    key: readFileSync(join(process.env.HOME || '', '.self-signed-cert/ssl.key')),
    cert: readFileSync(join(process.env.HOME || '', '.self-signed-cert/ssl.crt'))
  }, function (req, res) {
    res.setHeader('Content-Type', 'application/json')
    res.write(JSON.stringify({ data: 'Hello World!' })) // write a response to the client
    res.end() // end the response
  })
  server.listen((PROXY_PORT && +PROXY_PORT) || (PROXY_HTTPS ? 443 : 80)) // the server object listens on port PROXY_PORT

  await validDevServerOutputJSON('GET', `${HTTPS ? 'https' : 'http'}://127.0.0.1:${PORT}/foo`, done, LOG_PREFIX)
  await validDevServerOutputJSON('GET', `${HTTPS ? 'https' : 'http'}://127.0.0.1:${PORT}/bar`, done, LOG_PREFIX)
  await validDevServerOutputJSON('POST', `${HTTPS ? 'https' : 'http'}://127.0.0.1:${PORT}/faz`, done, LOG_PREFIX)

  server.close(() => {
    console.log(LOG_PREFIX, `close proxy server`, greenBright`done`)
  })
}

async function validDevServerOutputHeadless (url: string, done: (err: any) => void, LOG_PREFIX: string) {
  console.log(LOG_PREFIX, '[puppeteer]', `launch`)
  const browser = await puppeteer.launch({ ignoreHTTPSErrors: true })

  const page = await browser.newPage()
  page.on('error', error => console.error(LOG_PREFIX, redBright`[puppeteer] error`, error))
  page.on('pageerror', pageerror => console.error(LOG_PREFIX, redBright`[puppeteer] pageerror`, pageerror))
  page.on('requestfailed', requestfailed => console.error(LOG_PREFIX, redBright`[puppeteer] requestfailed`, requestfailed.url(), requestfailed))
  page.on('console', msg => console.log(LOG_PREFIX, '[puppeteer] console', msg.text()))

  console.log(LOG_PREFIX, '[puppeteer]', `open`, yellowBright.underline` ${url}`)
  await page.goto(url)
  await delay(2 * 1000)

  const contentFilePath = resolve(`./.playground/${url.replace(/[\W]/g, '_')}.html`)
  console.log(LOG_PREFIX, '[puppeteer]', `content`, yellowBright.underline(contentFilePath))
  writeFileSync(contentFilePath, await page.content())

  const metricsFilePath = resolve(`./.playground/${url.replace(/[\W]/g, '_')}.json`)
  console.log(LOG_PREFIX, '[puppeteer]', `metrics`, yellowBright.underline(metricsFilePath))
  writeFileSync(metricsFilePath, JSON.stringify(await page.metrics(), null, 2))

  const screenshotFilePath = resolve(`./.playground/${url.replace(/[\W]/g, '_')}.png`)
  console.log(LOG_PREFIX, '[puppeteer]', `screenshot`, yellowBright.underline(screenshotFilePath))
  await page.screenshot({ path: screenshotFilePath, fullPage: true })

  console.log(LOG_PREFIX, '[puppeteer]', `close`)
  await browser.close()
}

export async function validDevServer (testEnv: IDevEnv, done: (err?: any) => void, LOG_PREFIX: string) {
  if (testEnv.PORT) {
    await validDevServerOutput(testEnv, done, `${LOG_PREFIX} [PORT]`)
  }

  if (testEnv.ANALYZE_PORT) {
    const { ANALYZE_PORT } = testEnv
    await validDevServerOutputHtml(`http://127.0.0.1:${ANALYZE_PORT}`, done, `${LOG_PREFIX} [ANALYZE]`)
  }

  if (testEnv.PORT && testEnv.MOCK) {
    const { PORT, HTTPS } = testEnv
    await validDevServerOutputJSON('GET', `${HTTPS ? 'https' : 'http'}://127.0.0.1:${PORT}/foo`, done, `${LOG_PREFIX} [MOCK]`)
    await validDevServerOutputJSON('GET', `${HTTPS ? 'https' : 'http'}://127.0.0.1:${PORT}/bar`, done, `${LOG_PREFIX} [MOCK]`)
    await validDevServerOutputJSON('POST', `${HTTPS ? 'https' : 'http'}://127.0.0.1:${PORT}/faz`, done, `${LOG_PREFIX} [MOCK]`)
  }
  if (testEnv.PORT && testEnv.PROXY_IP) {
    if (testEnv.PROXY_HTTPS) process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0'
    await validDevServerOutputProxyServer(testEnv, done, `${LOG_PREFIX} [PROXY]`)
  }

  if (testEnv.PORT && testEnv.PAGE) {
    const { PORT, HTTPS, PAGE } = testEnv
    await validDevServerOutputHeadless(`${HTTPS ? 'https' : 'http'}://127.0.0.1:${PORT}/#${PAGE}`, done, `${LOG_PREFIX} [PAGE]`)
  }
}

export async function killDevServer (testEnv: IDevEnv) {
  try {
    if (testEnv.PORT && await portIsOccupied(+testEnv.PORT)) await killPort(+testEnv.PORT)
    if (testEnv.ANALYZE_PORT && await portIsOccupied(+testEnv.ANALYZE_PORT)) await killPort(+testEnv.ANALYZE_PORT)
    if (testEnv.PROXY_PORT && await portIsOccupied(+testEnv.PROXY_PORT)) await killPort(+testEnv.PROXY_PORT)
  } catch (error) {
    console.error('🚔🚔🚔', error)
  }
}
