/**
 * UserController
 *
 * @description :: Server-side logic for managing users
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

var sendError = function(res, message) {
  return res.status(400).json({message: message});
}

module.exports = {

  login: function(req, res) {
    if (!req.isSocket) {
      return sendError(res, 'Not a Socket request');
    }

    if(req.body.type === 'guardian') {
      User.findOne({id: req.body.ward, type: 'ward'}).exec(function(err, ward){
        if(err) {
          return sendError(res, 'Something went wrong');
        }
        User.findOne({username: req.body.username, password: req.body.password, type: req.body.type}).exec(function(err, user) {
          if(err) {
            return sendError(res, 'Something went wrong');
          }
          if(!user) {
            return sendError(res, 'No user found')
          }
          console.log(ward.id);
          User.subscribe(req, ward.id);
          return res.json(user);
        })
      })
    }

    else if (req.body.type === 'ward') {
      User.findOne(req.body).exec(function(err, ward) {
        if(err) {
          return sendError(res, 'Something went wrong');
        }
        if(!ward) {
          return sendError(res, 'No user found')
        }
        return res.json(ward);
      })
    }

  },

  register: function(req, res) {
    if (!req.isSocket) {
      return sendError(res, 'Not a Socket request');
    }
    User.create(req.body).exec(function(err, user) {
      if (err) return sendError(res, 'something went wrong');
      return res.json(user);
    })
  },

  getUsers: function(req, res) {
    if (!req.isSocket) {
      return sendError(res, 'Not a Socket request');
    }
    User.find({type: req.param('type')}).exec(function(err, data) {
      if (err) {
        return sendError(res, err);
      }
      res.json(data);
    })
  },

  fetchWardLocation: function(req, res) {
    if (!req.isSocket) {
      return sendError(res, 'Not a Socket request');
    }
    User.findOne({id: req.param('ward')}).exec(function(err, ward){
      if (err) return sendError(res, 'something went wrong');
      if (!ward) return sendError(res, 'No user found')

      res.json(ward);

    })
  }

};
