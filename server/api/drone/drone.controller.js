'use strict';

var _ = require('lodash');
var Drone = require('./drone.model');

// Get list of drones
exports.index = function(req, res) {
  Drone.aggregate({ $group: { _id: "$name", total: {$sum: 1}}},
    { $project: { _id: false, name: "$_id", total: "$total" }},
    { $sort: { name: 1 }},
    function (err, drones) {
    if(err) { return handleError(res, err); }
    return res.json(200, drones);
  });
};

// Creates a new drone in the DB.
exports.create = function(req, res) {
  var ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;

  ip = { IP: ip };
  var content = _.merge(req.body, ip);
  Drone.create(content, function(err, drone) {
    if(err) { return handleError(res, err); }
    return res.json(201, drone);
  });
};

function handleError(res, err) {
  return res.send(500, err);
}