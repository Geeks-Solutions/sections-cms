#!/usr/bin/env node

const fs = require('fs')
const path = require('path')

const threshold = parseFloat(process.argv[2]) || 85

const coverageFile = path.join(__dirname, 'coverage', 'coverage-final.json')

if (!fs.existsSync(coverageFile)) {
  console.error('Coverage file not found:', coverageFile)
  process.exit(1)
}

const coverage = JSON.parse(fs.readFileSync(coverageFile, 'utf8'))

let totalStatements = 0
let coveredStatements = 0
let totalBranches = 0
let coveredBranches = 0
let totalFunctions = 0
let coveredFunctions = 0

for (const file of Object.values(coverage)) {
  const s = file.s || {}
  const b = file.b || {}
  const f = file.f || {}

  for (const count of Object.values(s)) {
    totalStatements++
    if (count > 0) coveredStatements++
  }

  for (const branchArray of Object.values(b)) {
    for (const count of branchArray) {
      totalBranches++
      if (count > 0) coveredBranches++
    }
  }

  for (const count of Object.values(f)) {
    totalFunctions++
    if (count > 0) coveredFunctions++
  }
}

const statementCoverage = totalStatements > 0 ? (coveredStatements / totalStatements) * 100 : 0
const branchCoverage = totalBranches > 0 ? (coveredBranches / totalBranches) * 100 : 0
const functionCoverage = totalFunctions > 0 ? (coveredFunctions / totalFunctions) * 100 : 0

console.log('Coverage Thresholds:')
console.log(`Statements: ${statementCoverage.toFixed(2)}% (threshold: ${threshold}%)`)
console.log(`Branches: ${branchCoverage.toFixed(2)}%`)
console.log(`Functions: ${functionCoverage.toFixed(2)}%`)

if (statementCoverage < threshold) {
  console.error(
    `\n❌ Coverage failed! Statement coverage is ${statementCoverage.toFixed(2)}%, which is below ${threshold}% threshold.`
  )
  process.exit(1)
}

console.log('\n✅ Coverage thresholds passed!')
process.exit(0)
