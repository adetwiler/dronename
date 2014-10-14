'use strict';

var _ = require('lodash');
var Drone = require('./drone.model');

// Get list of drones
exports.index = function(req, res) {
  var ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;

  Drone.aggregate({ $group: { _id: "$name", total: {$sum: 1}, ips: { $addToSet: "$IP" } }},
    { $project: {
      _id: false,
      name: "$_id",
      total: "$total",
      voted: {
        $map: {
          input: "$ips",
          as: "ip",
          in: { $cond: [ { $eq: [ "$$ip", ip ] }, true, false ] }
        }
      }
    }},
    { $sort: { name: 1 }},
    function (err, drones) {
      if(err) { return handleError(res, err, 500); }
      return res.json(200, drones);
  });
};

// Creates a new drone in the DB.
exports.create = function(req, res) {
  var ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;

  ip = { IP: ip };
  var content = _.merge(req.body, ip);
  Drone.create(content, function(err, drone) {
    if(err) { return handleError(res, err, 422); }
    return res.json(201, drone);
  });
};

function handleError(res, err, code) {
  return res.send(code, err);
}