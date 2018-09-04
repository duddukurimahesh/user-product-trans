
/*-----------------------------------------------------------------------
   * @ file        : transactions.js
   * @ description : Here defines transactions schema.
   * @ author      : Duddukuri Mahesh
   * @ date        : 04/09/2018.
-----------------------------------------------------------------------*/

'use strict';

// Include internal and external modules.
const Mongoose     = require ('mongoose');
const autopopulate = require('mongoose-autopopulate');
const Schema       = Mongoose.Schema;

Mongoose.set('debug', true); // console mongo queries in dev mode.
  
  // Transaction Schem.
let TransactionSchema = new Schema({

  user_id     : { type: Schema.ObjectId, ref: `user`,autopopulate: true },
  product_id  : { type: Schema.ObjectId, ref: `product`,autopopulate: true },
  quantity    : { type: Number },
  total_price : { type: Number },
  date        : { type: Date, default: getTimeStamp }

});
// Configure the autopopulate plugIn.
TransactionSchema.plugin(autopopulate);
let transaction = Mongoose.model ('transaction', TransactionSchema);
module.exports  = transaction;

// To get current timeStamp.
function getTimeStamp() {
  return (new Date().toISOString())
}
