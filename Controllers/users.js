
/*-----------------------------------------------------------------------
   * @ file        : users.js
   * @ description : Here defines all users routes business logic.
   * @ author      : Duddukuri Mahesh
   * @ date        : 04/09/2018.
------------------------------------------------------------------------*/
'use strict';

// Include internal and external modules.
const async  = require('async');
const Models = require('../Models');

module.exports = {

    // Add Transaction Details w.r.t the user and product.
    addTransaction : (data, callback) => {

        async.waterfall([

            // check the user already exist or not.
            cb =>{

                let queryObj = {
                    phone : data.phone
                };
                Models.users.findOne(queryObj).lean().exec((err, res)=>{
                    if(err){
                        cb({statusCode: 400, status: "error", message: "Technical error. Please try again later."})
                    }else if(res){
                        data.user_id = res._id;
                        cb(null, data)
                    }else{
                        // Add new user here.
                        let newUser = {
                            name    : data.name,
                            phone   : data.phone,
                            address : data.address
                        }
                        Models.users(newUser).save((err,resp)=> {
                            if (err) {
                                cb({statusCode: 400, status: "error", message: "Technical error. Please try again later."})
                            }else {
                                data.user_id = resp._id;
                                cb(null, data)
                            }
                        })
                    }
                })
            },

            // check the product already exist or not.
            (data, cb) =>{

                let queryObj = {
                    name : data.transaction.product.name
                };
                Models.products.findOne(queryObj).lean().exec((err, res)=>{
                    if(err){
                        cb({statusCode: 400, status: "error", message: "Technical error. Please try again later."})
                    }else if(res){
                        data.product_id = res._id;
                        cb(null, data)
                    }else{
                        // Add new product here.
                        let newProduct = {
                            name        : data.transaction.product.name,
                            unit_price  : data.transaction.product.unit_price,
                            description : data.transaction.product.description
                        }
                        Models.products(newProduct).save((err,resp)=> {
                            if (err) {
                                cb({statusCode: 400, status: "error", message: "Technical error. Please try again later."})
                            }else {
                                data.product_id = resp._id;
                                cb(null, data)
                            }
                        })
                    }
                })
            },

            // Add transaction document in DB.
            (data, cb) =>{

                let newTransaction = {
                    user_id     : data.user_id,
                    product_id  : data.product_id,
                    quantity    : data.transaction.product.quantity,
                    total_price : (data.transaction.product.quantity)*(data.transaction.product.unit_price)
                }
                Models.transactions(newTransaction).save((err,resp)=> {
                    if (err) {
                        cb({statusCode: 400, status: "error", message: "Technical error. Please try again later."})
                    }else {
                        cb(null, {statusCode: 200, status: "success", message: "New transaction record added succcessfully."})
                    }
                })
            }

            ], callback);

    },

    // List Users.
    usersList : callback => {

        // Ftech the users list based on aggregation pipeline.
        var pipeline = [
            { 
                $lookup: {
                    from: "users",
                    localField: "user_id",
                    foreignField: "_id",
                    as: "users"
                }
            },
            { 
                $lookup: {
                    from: "products",
                    localField: "product_id",
                    foreignField: "_id",
                    as: "products"
                }
            },
            {
                "$sort" : {
                    "date" : -1
                }
            },
            {
                "$group": {
                    "_id" : "$user_id",
                    "count" :{
                        "$sum":1
                    },
                    data : { 
                        $push: "$$ROOT" 
                    }
                    /*userData : {
                        $addToSet: "$users"
                    },
                    itemsPurchase: { 
                        $addToSet: "$products"
                    }*/
                }
            }
        ];
       
        Models.transactions.aggregate(pipeline).exec((err, res)=>{
            
            if (err) {
                
                callback(err, null)
            }else {

                let respData = res.map(obj=>{
                    return {
                        name              : obj.data[0].users[0].name,
                        phone             : obj.data[0].users[0].phone,
                        address           : obj.data[0].users[0].address,
                        total_transaction : obj.count,
                        latest_transaction_detail : {
                            product_id  : obj.data[0].products[0]._id,
                            quantity    : obj.data[0].quantity,
                            total_price : obj.data[0].total_price,
                        }
                    }
                })
                callback(null,{status:"success", statusCode: 200, message:"Users data fetched successfully.", data: respData})
            }
        });
    }

};
