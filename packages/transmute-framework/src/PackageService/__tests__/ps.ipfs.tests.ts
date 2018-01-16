import { getSetupAsync } from '../../__mocks__/setup'

import { Relic, Store, Factory, PackageService, EventStoreFactory } from '../../transmute-framework'
import { read } from 'fs-extra'

const Storage = require('node-storage')
const db = new Storage('./read_model_storage')

const readModelAdapter: any = {
  getItem: (id: string) => {
    return JSON.parse(db.get(id))
  },
  setItem: (id: string, value: any) => {
    return db.put(id, JSON.stringify(value))
  }
}

/**
 * PackageService tests
 */
describe('PackageService tests', () => {
  let setup: any
  let accounts: string[]
  let relic: Relic
  let factory: EventStoreFactory

  beforeAll(async () => {
    setup = await getSetupAsync()
    accounts = setup.accounts
    relic = setup.relic
    factory = setup.factory
  })

  it('PackageService is special case of eventstore', async () => {
    let store = await Factory.createStore(factory, accounts, relic.web3, accounts[0])
    let ps = new PackageService(relic, store, setup.eventStoreAdapter)

    let event = await ps.publishPackage(
      'QmNrEidQrAbxx3FzxNt9E6qjEDZrtvzxUVh47BXm55Zuen',
      'bobo@0.0.1',
      accounts[0]
    )
    event = await ps.publishPackage(
      'QmQh3iDyetVbjuyyXBNdrVo6ePtNGyjDU65QEXxSewfXaK',
      'bobo@0.0.2',
      accounts[0]
    )

    // console.log("published event: ", event);
    let readModel = await ps.getReadModel(readModelAdapter)
    // console.log(JSON.stringify(readModel.state, null, 2))

    event = await ps.deletePackage('QmNrEidQrAbxx3FzxNt9E6qjEDZrtvzxUVh47BXm55Zuen', accounts[0])

    readModel = await ps.getReadModel(readModelAdapter)
    console.log(JSON.stringify(readModel.state, null, 2))
  })
})
