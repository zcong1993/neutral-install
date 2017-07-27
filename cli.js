#!/usr/bin/env node
'use strict'
const cac = require('cac')
const main = require('./')

const cli = cac()

cli.command('*', 'Neutrality install node modules', main)

cli.parse()
