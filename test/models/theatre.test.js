const { expect } = require('chai')
const Theatre = require('../../src/models/Theatre')

describe('Theatre Model', function () {
  beforeEach(() => global.knex.seed.run())
  describe('get/set #id', function () {
    it('should return the id when accessed', async function () {
      const theatre = new Theatre({ id: 99, name: 'Name', address: 'Address' })

      expect(theatre.id).to.equal(99)
    })
    it('should throw an error if you try and set the id outside of the constructor', async function () {
      const theatre = new Theatre({ id: 99, name: 'Name', address: 'Address' })
      const actual = () => theatre.id = 100

      expect(actual).to.throw()
    })
  })

  describe('get/set #removed', function () {
    it('should return the removed attribute when accessed', function () {
      const theatre = new Theatre({ name: 'Name', address: 'Address' })

      expect(theatre.removed).to.be.false
    })
    it('should throw an error if you try and set the removed attribute manually', function () {
      const theatre = new Theatre({ name: 'Name', address: 'Address' })
      const actual = () => theatre.removed = true

      expect(actual).to.throw()
    })
  })

  describe('.all()', function () {
    it('should return all rows in the theatre table as instances of the Theatre model', async function () {
      const theatres = await Theatre.all()

      expect(theatres.length).to.equal(3)
      const areTheatres = theatres.every(theatre => theatre instanceof Theatre)
      expect(areTheatres).to.be.true
    })
  })

  describe('.find()', function () {
    it('should return the given theatre as a Theatre instance', async function () {
      const theatre = await Theatre.find(1)

      expect(theatre).to.be.ok
      expect(theatre.id).to.equal(1)
    })

    it('should throw an error if the given theatre cannot be found', function () {
      return Theatre.find(null)
      .then(response => expect(response).to.not.be.ok)
      .catch(error => expect(error).to.be.ok)
    })
  })

  describe('#save()' ,function () {
    it('should create a new record if there is no id stored in the instance', async function () {
      const name = `My Theatre`
      const address = `Theatre Address`
      const theatre = new Theatre({ name, address })

      await theatre.save()
      const row = await global.knex('theatres')
        .limit(1)
        .orderBy('id', 'desc')
        .first()

      expect(row.name).to.equal(name)
      expect(row.address).to.equal(address)
    })

    it('should return the same instance from the save() invocation on creation', async function () {
      const name = `My Theatre`
      const address = `Theatre Address`
      const theatre = new Theatre({ name, address })

      const result = await theatre.save()

      expect(result).to.equal(theatre)
    })

    it('should return the same instance from with the newly created id on creation', async function () {
      const name = `My Theatre`
      const address = `Theatre Address`
      const theatre = new Theatre({ name, address })

      const result = await theatre.save()

      expect(result).to.equal(theatre)
      expect(result.id).to.equal(theatre.id)
    })

    it('should update the given resource if it already has an id', async function () {
      const theatre = await Theatre.find(1)

      const name = 'My New Name'
      const address = 'My New Address'

      theatre.name = name
      theatre.address = address

      await theatre.save()

      const row = await global.knex('theatres').where({ id: 1 }).first()
      expect(row.name).to.equal(name)
      expect(row.address).to.equal(address)
    })

    it('should return the same instance from the save() invocation on update', async function () {
      const theatre = await Theatre.find(1)

      const name = 'My New Name'
      const address = 'My New Address'

      theatre.name = name
      theatre.address = address

      const result = await theatre.save()

      expect(result).to.equal(theatre)
    })

    it('should throw an error if any of the values are missing on creation', function () {
      const theatre = new Theatre()

      return theatre.save()
      .then(response => expect(response).to.not.be.ok)
      .catch(error => expect(error).to.be.ok)
    })
  })

  describe('.destroy()', function () {
    it('should delete the given theatre from the database', async function () {
      const theatre = await Theatre.find(1)
      await theatre.destroy()

      const row = await global.knex('theatres').where({ id: 1 }).first()
      expect(row).to.be.undefined
    })
    it('should return the same instance from the destroy() invocation', async function () {
      const theatre = await Theatre.find(1)
      const result = await theatre.destroy()

      expect(theatre).to.deep.equal(result)
    })
    it('should assign an internal property of `removed` to `true`', async function () {
      const theatre = await Theatre.find(1)
      const result = await theatre.destroy()

      expect(theatre.removed).to.be.true
    })
    it('should throw an error if the theatre has already been removed', async function () {
      const theatre = await Theatre.find(1)
      await theatre.destroy()

      return theatre.destroy()
      .then(response => expect(response).to.not.be.ok)
      .catch(error => expect(error).to.be.ok)
    })
  })

  xdescribe('BONUS: .valid', function () {
    it('should return true if the created theatre is valid', function () {
      const name = 'My New Name'
      const address = 'My New Address'

      const theatre = new Theatre({ name, address })
      expect(theatre.valid).to.be.true
    })
    it('should return false if the theatre is invalid', function () {
      const name = 'My New Name'

      const theatre = new Theatre({ name })
      expect(theatre.valid).to.be.false
    })
    it('should throw an error if you try and set the valid attribute manually', function () {
      const theatre = new Theatre({ name: 'Name', })
      const actual = () => theatre.valid = true

      expect(actual).to.throw()
    })
  })
})
