/**
 * # Game settings definition file
 * Copyright(c) 2022 Melike <mnazlikaplan@gmail.com>
 * MIT Licensed
 *
 * The variables in this file will be sent to each client and saved under:
 *
 *   `node.game.settings`
 *
 * The name of the chosen treatment will be added as:
 *
 *    `node.game.settings.treatmentName`
 *
 * http://www.nodegame.org
 * ---
 */
 let basePay = 1;

 module.exports = {
 
     // Variables shared by all treatments.
 
     // #nodeGame properties:
 
     /**
      * ### TIMER (object) [nodegame-property]
      *
      * Maps the names of the steps of the game to timer durations
      *
      * If a step name is found here, then the value of the property is
      * used to initialize the game timer for the step.
      */
     //TIMER: {
        // guess: 10000
     //},
 
      /**
      * ### CONSENT (object) [nodegame-property]
      *
      * Contains info to be added to the page by the Consent widget
      *
      */
       CONSENT: {
 
         EXP_TITLE: 'Cooperation Survey Game',
 
         EXP_PURPOSE: 'The purpose of the study is to measure individual factors that are correlated with blockchain involvement and cooperative behavior.',
 
         EXP_DESCR: 'You will complete an online survey individually and then play a game. After completing the survey questions you will be forwarded to a waiting room in which, once 4 players are reached, the game will begin.',
 
         EXP_TIME: '20',
 
         EXP_MONEY: '$' + basePay + ' USD'
       },
 
       BASE_PAY: basePay,
 
 
     // # Game specific properties
 
     // Number of game rounds to repeat.
     
 
     // Number of coins available each round.
     COINS: 1,
 
     // Exchange rate coins to dollars.
     //EXCHANGE_RATE: 1,
 
     // # Treatments definition.
 
     // They can contain any number of properties, and also overwrite
     // those defined above.
 
     // If the `treatments` object is missing a treatment named _standard_
     // will be created automatically, and will contain all variables.
 
    
     // Numnber of game rounds repetitions.

  REPEAT: 4,

  // Minimum number of players that must be always connected.
  MIN_PLAYERS: 4,

  // Payment settings. *
  //MPCR
  GROUP_ACCOUNT_MULTIPLIER: 2,

  // Divider ECU / DOLLARS *
  EXCHANGE_RATE: 0.01,

  // Number of coins each round.
  COINS_GAME: 20,

// setup time for each stage
  TIMER: {
      instructions: 90000,
      effort: 60000,
      quiz: 90000,
      bid: function() {
          var round;
          round = this.getCurrentGameStage().round;
          if (round < 3) return 30000;
          return 15000;
      },
      results: function() {
          var round;
          round = this.getCurrentGameStage().round;
          if (round < 2) return 60000;
          if (round < 3) return 50000;
          return 30000;
      },
      questionnaire: 45000
  }

  /**treatments: {
      pgg: {
          description: 'Public Good Game',
          showBars: false
      },

      pgg_bars: {
          description: 'Public good game with results shown with bars',
          showBars: true
      }
  } */
 };

 /** Settings for pgg
  * module.exports = {

  // Numnber of game rounds repetitions.

  REPEAT: 4,

  // Minimum number of players that must be always connected.
  MIN_PLAYERS: 4,

  // Payment settings. *
  //MPCR
  GROUP_ACCOUNT_MULTIPLIER: 2,

  // Divider ECU / DOLLARS *
  EXCHANGE_RATE: 0.01,

  // Number of coins each round.
  COINS: 20,

// setup time for each stage
  TIMER: {
      instructions: 90000,
      effort: 60000,
      quiz: 90000,
      bid: function() {
          var round;
          round = this.getCurrentGameStage().round;
          if (round < 3) return 30000;
          return 15000;
      },
      results: function() {
          var round;
          round = this.getCurrentGameStage().round;
          if (round < 2) return 60000;
          if (round < 3) return 50000;
          return 30000;
      },
      questionnaire: 45000
  },

  treatments: {
      pgg: {
          description: 'Public Good Game',
          showBars: false
      },

      pgg_bars: {
          description: 'Public good game with results shown with bars',
          showBars: true
      }
  }
};
*/
 