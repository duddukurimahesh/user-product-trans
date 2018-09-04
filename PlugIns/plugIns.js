
/*-----------------------------------------------------------------------
   * @ file        : plugIns.js
   * @ description : Main module to configure all plugIns.
   * @ author      : Duddukuri Mahesh
   * @ date        : 04/09/2018.
-----------------------------------------------------------------------*/

'use strict';

module.exports = [

    {
        register: require('inert'),
        options: {}
    },
    {
        register: require('vision'),
        options: {}
    },
    {
            'register': require('hapi-swagger'),
            'options': {
                info: {
                    'title': 'Test API Documentation',
                    'version': '1.0.0'
                },
                pathPrefixSize: 2,
                basePath: '/v1',
                tags:[
                    {
                        name:'Users',
                        description:"All API's about User Operations"
                    } 
                ]
            }
    },
    {
        register: require('good'),
        options : {
            ops: {
                interval: 1000
            },
            reporters: {
                myConsoleReporter: [{
                    module: 'good-squeeze',
                    name: 'Squeeze',
                    args: [{ log: '*', response: '*' }]
                }, {
                    module: 'good-console'
                }, 'stdout']
            }
        }
    }

];
