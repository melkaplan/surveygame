module.exports = function(stager, settings) {

    stager
        .stage('gameinstructions')
        //.stage('quiz')
        .stage('trust')

        .repeatStage('game', settings.REPEAT)
        .step('bid')
        .step('results')

        .stage('end')

        .gameover();

    // Modify the stager to skip some stages.

    //stager.skip('instructions');
    //stager.skip('game');
    

};


