
/*-----------------------------------------------------------------------
   * @ file        : users.js
   * @ description : Here defines all users routes.
   * @ author      : Duddukuri Mahesh
   * @ date        : 04/09/2018.
-----------------------------------------------------------------------*/

'use strict';

// Include internal and external modules.
const Joi         = require('joi');
const Controllers = require('../Controllers');

module.exports    = [
    
    // Add Transaction Details w.r.t the user.
    {
        method: 'POST',
        path: '/v1/Users/addTransaction',
        config: {
            description: 'Api service used to add new transaction w.r.t user and product.',
            notes: '<br/>The request object should contain following fields in its <b>Payload/Body</b> object<br/>&bull; <b>role</b>: Which defines the user type. It should contain 1 of 2 values either <b>1</b> for <b>Driver</b> or <b>2</b> for <b>Space Owner</b>.<br/>&bull; <b>first_name</b>: Should carry the space saperated Full name of the user with not more than 20 characters. <br/>&bull; <b>Phone</b>: The contact number of the user on which he/she will recieve an OTP for Verification.<br/>&bull; <b>Password</b>: Should carry an alpha numeric password for the user account.<br/><br/><b>During the development phase the phone numbers to be used, shold be lnked with twilio account for recieving SMS</b>. ',
            tags: ['api'],
            validate: {
                payload: {
                    name        : Joi.string().required(),
                    phone       : Joi.string().required(),
                    address     : Joi.string().required(),
                    transaction : Joi.object().keys({
                                    product: Joi.object().keys({
                                        name: Joi.string().alphanum().min(3).max(30).required(),
                                        unit_price: Joi.number().integer().min(1).required(),
                                        description: Joi.string().required(),
                                        quantity: Joi.number().integer().min(1).required()
                                    })
                                })
                }
            }
        },
        handler: (request, reply) => Controllers.users.addTransaction(request.payload, (err, res) => reply(err || res))
    },

    // List Users.
    {
        method: 'GET',
        path: '/v1/Users/usersList',
        config: {
            description: 'Api service used to list users and their total transactions w.r.t latest transaction details.',
            notes: 'Here there is no request object',
            tags: ['api'],
            validate: {}
        },
        handler: (request, reply) => Controllers.users.usersList((err, res) => reply(err || res))
    }

];
