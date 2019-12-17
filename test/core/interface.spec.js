/* eslint-env mocha, browser */
'use strict'

const tests = require('interface-ipfs-core')
const merge = require('merge-options')
const { createFactory } = require('ipfsd-ctl')
const IPFS = require('../../src')

/** @typedef { import("ipfsd-ctl").ControllerOptions } ControllerOptions */

describe('interface-ipfs-core tests', function () {
  /** @type ControllerOptions */
  const commonOptions = {
    test: true,
    type: 'proc',
    ipfsModule: {
      path: require.resolve('../../src'),
      ref: IPFS
    },
    ipfsHttpModule: {
      path: require.resolve('ipfs-http-client'),
      ref: require('ipfs-http-client')
    },
    ipfsOptions: {
      pass: 'ipfs-is-awesome-software'
    }
  }
  const overrides = {
    js: {
      ipfsBin: './src/cli/bin.js'
    }
  }
  const commonFactory = createFactory(commonOptions, overrides)

  tests.root(commonFactory, {
    skip: [{
      name: 'should ignore a directory from the file system',
      reason: 'FIXME: unixfs importer returns an extra QmUNLLs dir first (seems to be fixed in 0.42)'
    }]
  })

  tests.bitswap(commonFactory)

  tests.block(commonFactory)

  tests.bootstrap(commonFactory)

  tests.config(commonFactory)

  tests.dag(commonFactory)

  tests.dht(commonFactory, {
    skip: {
      reason: 'TODO: unskip when DHT is enabled: https://github.com/ipfs/js-ipfs/pull/1994'
    }
  })

  tests.files(commonFactory)

  tests.key(commonFactory)

  tests.miscellaneous(commonFactory)

  tests.name(createFactory(merge(commonOptions, {
    ipfsOptions: {
      offline: true
    }
  }), overrides))

  tests.namePubsub(createFactory(merge(commonOptions, {
    ipfsOptions: {
      EXPERIMENTAL: {
        ipnsPubsub: true
      }
    }
  }), overrides))

  tests.object(commonFactory)

  tests.pin(commonFactory)

  tests.ping(commonFactory)

  tests.pubsub(createFactory(commonOptions, merge(overrides, {
    go: {
      args: ['--enable-pubsub-experiment']
    }
  })), {
    skip: [
      {
        name: 'should receive messages from a different node',
        reason: 'https://github.com/ipfs/js-ipfs/issues/2662'
      },
      {
        name: 'should round trip a non-utf8 binary buffer',
        reason: 'https://github.com/ipfs/js-ipfs/issues/2662'
      },
      {
        name: 'should receive multiple messages',
        reason: 'https://github.com/ipfs/js-ipfs/issues/2662'
      },
      {
        name: 'should send/receive 100 messages',
        reason: 'https://github.com/ipfs/js-ipfs/issues/2662'
      }
    ]
  })

  tests.repo(commonFactory)

  tests.stats(commonFactory)

  tests.swarm(commonFactory)
})
