const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');

const vpnSchema = mongoose.Schema({
  user: {
    type: mongoose.Types.ObjectId,
  },

  selectedLocation: {
    type: String,
    enum: ['A', 'B', 'C'],
  },
});


// add plugin that converts mongoose to json
vpnSchema.plugin(toJSON);
vpnSchema.plugin(paginate);

/**
 * @typedef VPN
 */
const VPN = mongoose.model('VPN', vpnSchema);

module.exports = VPN;