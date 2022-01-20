/**
 * # Bot type implementation of the game stages
 * Copyright(c) 2022 Melike <mnazlikaplan@gmail.com>
 * MIT Licensed
 *
 * http://www.nodegame.org
 * ---
 */
 const ngc = require('nodegame-client');
 const J = ngc.JSUS;
 
 module.exports = function(treatmentName, settings, stager, setup, gameRoom) {
 
     const channel = gameRoom.channel;
     const logic = gameRoom.node;
 
     stager.extendAllSteps(function(o) {
         o.cb = function() {
             var node, stepObj, id;
             stepObj = this.getCurrentStepObj();
             id = stepObj.id;
             node = this.node;
 
             // We do not actually play.
             if (id === 'bid') {
                 node.on('PLAYING', function() {
                     node.timer.random.exec(function() {
                         node.done({
                             contribution: J.randomInt(-1, 20)
                         });
                     });
                 });
             }
             else {
                 node.timer.random.done();
             }
         };
         return o;
     });
 };