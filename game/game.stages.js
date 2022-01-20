/**
 * # Game stages definition file
 * Copyright(c) 2022 Melike <mnazlikaplan@gmail.com>
 * MIT Licensed
 *
 * Stages are defined using the stager API
 *
 * http://www.nodegame.org
 * ---
 */

 module.exports = function(treatmentName, settings, stager, setup, gameRoom) {

    stager
       .next('consent')
       .next('instructions')
       .next('demographics')
       .next('demographics2')
       .next('self-construal')
       .next('blockchain quiz')
       .next('blockchain involvement')
       .next('surveydone')
       .gameover();

   

   // Skip one stage.
   // stager.skip('instructions');

   // Skip multiple stages:
   // stager.skip([ 'consent', 'demographics', 'demographics2', 'self-construal', 'blockchain quiz', 'blockchain involvement'])

   // Skip a step within a stage:
   // stager.skip('game', 'results');
};

