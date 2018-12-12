const db = require('../db')
class Theatre {

  constructor({ id, name, address } = {}) {
    this._id = id
    this._removed = false
    this.name = name,
    this.address = address
  }

  get id() { return this._id }
  set id(val) { throw new Error('No id') }

  get removed() { return this._removed }
  set removed(val) { throw new Error('Already removed') }

  static all() {
    return db('theatres').then(theatres => theatres.map(theatre => new Theatre(theatre)))
  }

  static find(id) {
    return db('theatres').where({ id: id }).first()
    .then(theatre => new Theatre(theatre))
  }

  save() {
    if (!this.name || !this.address) return Promise.reject(new Error('Need name and address'))

    if (this._id) {
      return db('theatres')
        .update({ name: this.name, address: this.address })
        .where({ id: this._id })
        .returning('*')
        .then(([theatre]) => {
          this.name = theatre.name
          this.address = theatre.address
          return this
        })

    } else {
      return db('theatres')
        .insert({ name: this.name, address: this.address })
        .returning('*')
        .then(([theatre]) => {
          this._id = theatre.id
          return this
        })
    }
  }

  destroy() {
    return db('theatres')
      .where({ id: this._id })
      .del()
      .returning('*')
      .then(([theatre]) => {
        if (!theatre) throw new Error(`not found`)
        this._removed = true
        return this
      })
  }
}

module.exports = Theatre
