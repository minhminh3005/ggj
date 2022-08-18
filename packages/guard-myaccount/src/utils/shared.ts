function isLocal(): boolean {
  return process.env.ENV == 'local'
}
export { isLocal }
