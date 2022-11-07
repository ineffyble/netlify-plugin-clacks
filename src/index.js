export const onPreBuild = async function ({ netlifyConfig, inputs, utils }) {
  const message = inputs.message || 'GNU Terry Pratchett'
  utils.status.show({
    title: 'Clacks Header',
    summary: `X-Clacks-Overhead: ${message}`,
  })
  netlifyConfig.headers.push({
    for: '/*',
    values: {
      'X-Clacks-Overhead': message,
    },
  })
}
