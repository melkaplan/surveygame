/**
 * # Logic type implementation of the game stages
 * Copyright(c) 2022 Melike <mnazlikaplan@gmail.com>
 * MIT Licensed
 *
 * http://www.nodegame.org
 * ---
 */

/**For levels: 
The client sends a message to the logic: node.say('level_done');
Upon receiving it, 
the logic uses the Server API to move the client to next room (usually the waiting room of the next level).
node.on.data('level_done', function(msg) {
     currentRoom is optional, avoid lookup.
    let currentRoom; // let currentRoom = gameRoom.name; 
    let levelName = 'part2';
     Move client to the next level.
     (async so that it finishes all current step operations).
    setTimeout(function() {
        console.log('moving client to next level: ', msg.from);
        channel.moveClientToGameLevel(msg.from, levelName, currentRoom);
        }, 100);
});
*/


 "use strict";

 const ngc = require('nodegame-client');
 const J = ngc.JSUS;
 
 module.exports = function(treatmentName, settings, stager, setup, gameRoom) {
 
     let node = gameRoom.node;
     let channel = gameRoom.channel;
     let memory = node.game.memory;
 
     // Make the logic independent from players position in the game.
     stager.setDefaultStepRule(ngc.stepRules.SOLO);
 
     // Must implement the stages here.
 
     stager.setOnInit(function() {
 
         // Feedback.
         memory.view('feedback').stream({
             format: 'csv',
             header: [ 'time', 'timestamp', 'player', 'feedback' ]
         });
 
         // Email.
         memory.view('email').stream({
             format: 'csv',
             header: [ 'timestamp', 'player', 'email' ]
         });
 
         // Times.
         memory.stream({
             filename: 'times.csv',
             format: 'csv',
             delay: 20000,
             header: [
                 'session', 'treatment', 'player', 'stage', 'step', 'round', 'stageId', 'stepId', 'timestamp', 'time'
             ],
             stageNum2Id: false // TODO: this should be default FALSE
         });
        
         memory.view('gender').stream({
            filename: 'demo.csv',
            format: 'csv',
            header: [ 'timestamp', 'player', 'gender', 'age'],
            keepUpdated: true
        });
         

         
         
         node.on.data('survey-over', function(msg) {
            // Move client to part2.
            // (async so that it finishes all current step operations).
            node.timer.setTimeout(function() {
                // console.log('moving to stopgo interactive: ', msg.from);
                channel.moveClientToGameLevel(msg.from, 'pggame',
                                              gameRoom.name);
            }, 10);

            // Save client's data.
            if (node.game.memory.player[msg.from]) {
                let db = node.game.memory.player[msg.from];
                // node.game.memory.save('aa.json');
                db.save('data_survey.json', { flag: 'a' });
                db.save('data_survey.csv');
                
            }
        });
 
         node.on.data('end', function(msg) {
 
           let client = channel.registry.getClient(msg.from);
           if (!client) return;
 
           if (client.checkout) {
             // Just resend bonus
             gameRoom.computeBonus({
                 clients: [ msg.from ],
                 dump: false
              });
           }
           else {
 
             // Adding extra coins (as an example).
             gameRoom.updateWin(msg.from, settings.COINS);
 
             // Compute total win.
             gameRoom.computeBonus({
                 clients: [ msg.from ]
             });
 
             // Mark client checked out.
             channel.registry.checkOut(msg.from);
 
             // Select all 'done' items and save everything as json.
             memory.select('done').save('memory_all.json');
 
           }
 
         });
     });
 
     stager.setOnGameOver(function() {
         // Something to do.
     });
 };
