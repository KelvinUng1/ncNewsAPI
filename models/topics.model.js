const db = require('../db/connection')

module.exports.selectTopics = () => {
    return db.query(`
    SELECT * FROM topics
    `)
    .then((result) => {
        console.log(result.rows)
        return result.rows
    })
    .catch((err) => {
        console.log(err)
    })
}