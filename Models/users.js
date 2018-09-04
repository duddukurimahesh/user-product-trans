
/*-----------------------------------------------------------------------
   * @ file        : users.js
   * @ description : Here defines users schema.
   * @ author      : Duddukuri Mahesh
   * @ date        : 04/09/2018.
-----------------------------------------------------------------------*/

'use strict';

// Include internal and external modules.
const Mongoose = require ('mongoose');
const Schema   = Mongoose.Schema;

Mongoose.set('debug', true);  // To console mongo queries in dev mode.

// User schema.
let UserSchema = new Schema({

  name    : { type: String, required: true }, 
  phone   : { type: String, required: true, unique : true, index: true }, 
  address : { type: String, required: true }

});

let user = Mongoose.model ('user', UserSchema);
module.exports = user;
