export const template = `diff: true
require: 'ts-node/register'
extension:
  - ts
package: './package.json'
recursive: true
reporter: 'spec'
timeout: 5000
full-trace: true
bail: true`
