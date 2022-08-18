const configs = require('@ggj/configs')

module.exports = async function(envType) {
  const ggConfigs = await configs.getConfigs()
  ggConfigs.ENV_TYPE = envType
  configs.setEnvVariables(ggConfigs)
  this.options.env = ggConfigs

  return ggConfigs
}
