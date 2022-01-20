/**
 * # Player type implementation of the game stages
 * Copyright(c) 2022 Melike <mnazlikaplan@gmail.com>
 * MIT Licensed
 *
 * Each client type must extend / implement the stages defined in `game.stages`.
 * Upon connection each client is assigned a client type and it is automatically
 * setup with it.
 *
 * http://www.nodegame.org
 * ---
 */

 module.exports = function(treatmentName, settings, stager, setup, gameRoom) {

    stager.setOnInit(function() {
        var header;

        console.log('INIT PLAYER! *******************************************');

        node.game.oldContrib = null;
        node.game.oldPayoff = null;

        // Setup page: header + frame.
        header = W.generateHeader();
        W.generateFrame();

        // Add widgets.
        this.visualRound = node.widgets.append('VisualRound', header);
        this.visualTimer = node.widgets.append('VisualTimer', header);
        this.doneButton = node.widgets.append('DoneButton', header);


        // This function is called to create the bars.
        this.showBars = function(contribs) {
            var player, i, div, subdiv, color;
            var barsDiv;
            var text
            var bars;

            // console.log(contribs);

            barsDiv = W.getElementById('barsResults');
            barsDiv.innerHTML = '';

            bars = W.getFrameWindow().bars;

            for (i = 0; i < contribs.length; i++) {
                div = document.createElement('div');
                // div.classList.add('groupContainer');
                // groupHeader = document.createElement('h4');
                // groupHeaderText = 'Group ' + groupNames[i];

                // groupHeader.innerHTML = groupHeaderText;
                barsDiv.appendChild(div);
                // div.appendChild(groupHeader);

                player = contribs[i].player;

                // It is me?
                if (player === node.player.id) {
                    color = '';
                    text = ' <img src="imgs/arrow.jpg" ' +
                    'style="height:15px;"/> YOU';
                }
                else {
                    color = '#9932CC';
                    text = '';
                }

                // This is the DIV actually containing the bar
                subdiv = document.createElement('div');
                div.appendChild(subdiv);
                bars.createBar(subdiv, contribs[i].contribution,
                    (1.3 * node.game.settings.COINS_GAME), color, text);

            }
        };

        this.displaySummaryPrevRound = function() {
            var save, groupReturn;
            // Shows previous round if round number is not 1.
            if ('number' !== typeof node.game.oldContrib) return;
            save = node.game.settings.COINS_GAME - node.game.oldContrib;
            groupReturn = node.game.oldPayoff - save;

            W.show('previous-round-info');
            // Updates display for current round.
            W.setInnerHTML('yourPB', save);
            W.setInnerHTML('yourOldContrib', node.game.oldContrib);
            W.setInnerHTML('yourReturn', groupReturn);
            W.setInnerHTML('yourPayoff', node.game.oldPayoff);
        };
    });


    // STAGES and STEPS.


// Game instructions.
    stager.extendStep('gameinstructions', {
        frame: 'gameinstructions.htm',
        cb: function() {
            W.setInnerHTML('n-coins', node.game.settings.COINS_GAME);
        }
    });

    //Belief elicitation (trust)
    stager.extendStep('trust', {
        widget: {
            name: 'ChoiceManager',
            root: 'container',
            options: {
                className: 'centered',
                id: 'trustquestion',
                title: false,
                forms:  [
                    {
                        name: 'CustomInput',
                        id: 'trustquestion',
                        mainText: 'What do you think the average contributions of the other players will be (0-20)?',
                        type: 'int',
                        max: 20,
                    }
                ]
            }
        }
    });

   /** Instructions quiz
    * stager.extendStep('quiz', {
        widget: {
            name: 'ChoiceManager',
            options: {
                id: 'quiz',
                title: false,
                forms: [
                    {
                        name: 'ChoiceTable',
                        id: 'coinsEveryRound',
                        choices: ['20', '40', '20 or 40', 'Other/not clear from instructions'],
                        correctChoice: 2,
                        shuffleChoices: true,
                        mainText: 'How many coins do you get every of the 4 rounds?',
                        //
                    },
                    {
                        name: 'ChoiceTable',
                        id: 'lowestPayment',
                        choices: ['30', '10', '20', 'Other/not clear from instructions'],
                        correctChoice: 2,
                        shuffleChoices: true,
                        mainText: 'If you have 20 coins, you put 10 in your personal account and 10 in the group account, and all others do the same, what is your payoff from this round?',
                        //
                    },
                    {
                        name: 'ChoiceTable',
                        id: 'leastGuarantee',
                        mainText: 'If you have 40 coins, you put 20 in your personal account and 20 in the group account, and all others do not put any coins in the group account, what is your payoff from this round?',
                        choices: ['0', '10', '25', 'Other/not clear from instructions'],
                        correctChoice: 2,
                        shuffleChoices: true,
                    },
                ]
            }
        }

    }); */

    stager.extendStep('bid', {
        frame: 'bidder.htm',
        cb: function() {

            W.setInnerHTML('bid_contrib', node.game.settings.COINS_GAME);

            // Show summary previous round.
            node.game.displaySummaryPrevRound();
            node.game.bidInput = node.widgets.append('CustomInput', "input-td", {
                type: 'int',
                min: 0,
                max: node.game.settings.COINS_GAME,
                requiredChoice: true
            });


        },
        timeup: function() {
            var contribution = node.game.oldContrib;
            if ('undefined' === typeof contribution) {
                contribution = J.randomInt(-1, node.game.settings.COINS_GAME);
            }
            node.game.bidInput.setValues({
                // Random value if undefined.
                values: contribution
            });
            node.done();
        },
        done: function() {
            var bid = node.game.bidInput.getValues();
            if (!bid.isCorrect && !node.game.timer.isTimeup()) return false;
            // Store reference for next round.
            node.game.oldContrib = bid.value;
            // Send it to server.
            return { contribution: bid.value };
        }
    });

    stager.extendStep('results', {
        frame: 'results.htm',
        cb: function () {
            node.on.data('results', function(msg) {
                var payoff, s;
                s = node.game.settings;

                payoff = msg.data.payoff;
                node.game.oldPayoff = payoff;

                // How many coins player put in personal account.
                var save = s.COINS_GAME - node.game.oldContrib;
                var payoffSpan = W.gid('payoff');
                    payoffSpan.innerHTML = save + ' + ' + (payoff - save) +
                    ' = ' + node.game.oldPayoff;

                // Show bars if required.
                if (s.showBars) this.showBars(msg.data.contribs);
            });
        }
    });


    stager.extendStep('end', {
        init: function() {
            node.game.doneButton.destroy();
            node.game.visualTimer.destroy();
        },
        widget: {
            name: 'EndScreen',
            options: {
                title: false,
                feedback: false,
                exitCode: false,
                email: {
                    texts: {
                        label: 'Enter your email (optional):'
                    }
                }
            }
        }
    });
};