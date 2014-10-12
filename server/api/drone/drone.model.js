'use strict';

var mongoose = require('mongoose'),
  Schema = mongoose.Schema,
  timestamps = require('mongoose-timestamp');

var DroneSchema = new Schema({
  nickname: String,
  name: { type: String, lowercase: true, trim: true },
  IP: String,
  total: Number
});

DroneSchema
  .path('name')
  .validate(function(value, respond) {
    this.constructor.findOne({name: value, IP: this.IP}, function(err, user) {
      if(err) throw err;
      if(user) {
        return respond(true);
      }
      respond(true);
    });
  }, 'inuse');

// Plugins
DroneSchema.plugin(timestamps);

module.exports = mongoose.model('Drone', DroneSchema);