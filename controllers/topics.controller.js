const { selectTopics } =require('../models/topics.model')

exports.getTopics = (req, res, next) => {
    selectTopics(req.query)
    .then((topics) => {
        
        res.status(200).send({ topics })
    }).catch(next)
}