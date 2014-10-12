/**
 * Broadcast updates to client when the model changes
 */

'use strict';

var Drone = require('./drone.model');

exports.register = function(socket) {
  Drone.schema.pre('save', function (next) {
    this.wasNew = this.isNew;
    next();
  });

  Drone.schema.post('save', function (doc) {
    if (this.wasNew) {
      onSave(socket, doc);
    }
  });
};

function onSave(socket, doc, cb) {
  Drone.aggregate(
    { $match: { name: doc.name } },
    { $group: { _id: "$name", total: {$sum: 1}}},
    { $project: { total: "$total" }},
    { $sort: { name: 1 }},
    function (err, droneTotal) {
      if(err) cb(err);
      doc.total = droneTotal[0].total;
      socket.emit('drone:save', doc);
    });
}
