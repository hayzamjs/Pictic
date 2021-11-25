const { app } = require('electron')

const path = require('path')
const DB_ = require('nedb-promises')
const datastore = DB_.create(path.join(app.getPath('userData'), 'shots.db'))

class DB {
  async put (data) {
    try {
      const submission = {
        date: new Date(),
        image_data: data
      }
      await datastore.insert(submission)
    } catch (error) {
      console.log(error)
      return error
    }
  }

  async get (n, offset) {
    try {
      const count = await this.getCount()
      let result = []
      if (count < offset) {
        result = await datastore.find({})
      } else {
        result = await datastore.find({}).sort({ date: -1 }).limit(n).skip(offset)
      }
      return result
    } catch (error) {
      console.log(error)
      return error
    }
  }

  async getCount () {
    try {
      await datastore.load()
      const result = await datastore.find({})
      return result.length
    } catch (error) {
      console.log(error)
      return error
    }
  }
}

module.exports = {
  DB
}
