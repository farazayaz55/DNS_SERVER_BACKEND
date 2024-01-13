const express = require('express');
const auth = require('../../middlewares/auth');
const { vpnController } = require('../../controllers');

const router = express.Router();
router.post('/',vpnController.connect)
// router.post('/',auth('connect'),vpnController.connect)


module.exports=router

/**
 * @swagger
 * tags:
 *   name: Vpn
 *   description: Vpn Connection Management
 */


/**
 * @swagger
 * /vpn:
 * post:
 *  summary: connects the user to selected location
 *  tags: [vpn]
 *  requestBody:
 *      required: true
 *      content: 
 *          application/json:
 *              schema:
 *                  type: object
 *                  required: 
 *                      - user
 *                      - location
 *                  properties:
 *                      user:
 *                          type: userId
 *                      location:
 *                          type:string
 *                          enum: ['A','B','C']
 *  responses:
 *      "201":
 *          description: Created
 *          content:
 *          application/json:
 *              schema:
 *                  $ref: '#/components/schemas/Vpn'                  
 *      
 */
