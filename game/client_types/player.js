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

 "use strict";

 const ngc = require('nodegame-client');
 const J = ngc.JSUS;
 
 module.exports = function (treatmentName, settings, stager, setup, gameRoom) {
 
     // Define a function for future use.
     function capitalizeInput(input) {
         var str;
         str = input.value;
         str = str.charAt(0).toUpperCase() + str.substr(1).toLowerCase();
         input.value = str;
     }
 
     // Make the player step through the steps without waiting for other players.
     stager.setDefaultStepRule(ngc.stepRules.SOLO);
 
     stager.setOnInit(function () {
 
         // Initialize the client.
 
         var header;
 
         // Setup page: header + frame.
         header = W.generateHeader();
         W.generateFrame();
 
         // Add widgets.
         this.visuaStage = node.widgets.append('VisualStage', header);
         this.visualRound = node.widgets.append('VisualRound', header);
 
         this.discBox = node.widgets.append('DisconnectBox', header, {
             disconnectCb: function () {
                 var str;
                 W.init({ waitScreen: true });
                 str = 'Disconnection detected. Please refresh to reconnect.';
                 node.game.pause(str);
                 alert(str);
             },
             connectCb: function () {
                 // If the user refresh the page, this is not called, it
                 // is a normal (re)connect.
                 if (node.game.isPaused()) node.game.resume();
             }
         });
 
 
         this.doneButton = node.widgets.append('DoneButton', header, {
             text: 'Next'
         });
 
         this.backButton = node.widgets.append('BackButton', header, {
             acrossStages: true,
             className: 'btn btn-secondary'
         });
         this.backButton.button.style['margin-top'] = '6px';
 
         // No need to show the wait for other players screen in single-player
         // games.
         W.init({ waitScreen: false });
 
         // Additional debug information while developing the game.
         // this.debugInfo = node.widgets.append('DebugInfo', header)
     });
 
     stager.extendStep('consent', {
         frame: 'consent.htm',
         donebutton: false,
         widget: 'Consent',
         cb: function () {
             node.on('CONSENT_REJECTING', function () {
                 this.discBox.destroy();
             });
         }
         // Takes settings.CONSENT by default.
     });
 
     stager.extendStep('instructions', {
         frame: 'instructions.htm',
         // Do not go back to consent.
         backbutton: false,
         // No need to specify the frame, if named after the step id.
         // frame: 'instructions.htm',
         cb: function () {
             var s;
             // Note: we need to specify node.game.settings,
             // and not simply settings, because this code is
             // executed on the client.
             s = node.game.settings;
             // Replace variables in the instructions.
             W.setInnerHTML('coins', s.COINS);
             W.setInnerHTML('time', s.CONSENT.EXP_TIME);
         }
     });
 
     stager.extendStep('demographics', {
         // Make a widget step.
         widget: {
             name: 'ChoiceManager',
             options: {
                 id: 'demographics',
                 mainText: 'Your demographics.',
                 simplify: true,
                 forms: [
                     {
                         id: 'gender',
                         mainText: 'What is your gender?',
                         choices: ['Female', 'Male', 'Trans Female', 'Trans Male', 'Non-binary', 'Other'],
                         shuffleChoices: false,
                         onclick: function (value, removed) {
                             var w;
                             // Display Other.
                             w = node.widgets.lastAppended.formsById.othergender;
                             if ((value === 5) && !removed) w.show();
                             else w.hide();
                             // Necessary when the page changed size after
                             // loading it
                             W.adjustFrameHeight();
                         },
                         preprocess: capitalizeInput
                     },
                     {
                         name: 'CustomInput',
                         id: 'othergender',
                         mainText: 'Please identify your gender.',
                         width: '95%',
                         hidden: true
                     },
                     {
                         name: 'CustomInput',
                         id: 'age',
                         mainText: 'What is your age?',
                         type: 'int',
                         min: 18,
                         // requiredChoice: false
                     },
                     {
                         id: 'race',
                         selectMultiple: true,
                         mainText: 'Do you identify with any ' +
                             'of the following races/ethnic groups?',
                         choices: ['White', 'African American',
                             'Latino', 'Asian',
                             'American Indian',
                             'Alaska Native',
                             'Native Hawaiian', 'Pacific Islander'],
                             //how can I make the response not mandatory? 
                             requiredChoice: false
                     },
                     {
                         name: 'CustomInput',
                         id: 'language',
                         mainText: 'What language(s) do you speak?',
                         hint: '(if you speak more ' +
                             'than one language, separate them with comma)',
                         //preprocess: capitalizeInput,
                         width: '95%',
                     },
                     {
                         id: 'migration',
                         selectMultiple: true,
                         mainText: 'Do you have a history of migration (in the past three generations)?' +
                             ' Select all that apply.',
                             choices: [
                                'Yes, I migrated to another country in my own lifetime',
                                'Yes, my parent(s) migrated to another country',
                                'Yes, my grandparent(s) migrated to another country',
                                'No',
                            ],
                            choicesSetSize: 7
                     },
                 ],
                 formsOptions: {
                     requiredChoice: true,
                     shuffleChoices: false
                 },
                 className: 'centered'
             }
         }
     });
 
 
     stager.extendStep('demographics2', {
         widget: {
             name: 'ChoiceManager',
             options: {
                 id: 'demographics continued',
                 mainText: 'Your demographics continued.',
                 simplify: true,
                 forms: [
                     {
                         id: 'education',
                         mainText: 'What is the highest education level that you have achieved?',
                         choices: [
                             'None', 'Elementary', 'High-School', 'College',
                             'Grad School'
                         ],
                         shuffleChoices: false
                     },
                     {
                         id: 'hardship',
                         mainText: 'Hardship is a condition that causes ' +
                             'difficulty or suffering. In the course ' +
                             'of your life, would you say ' +
                             'that you have experienced hardship?',
                         hint: '(Examples are being ' +
                             'without a job or enough money)',
                         choices: ['Yes', 'No', 'Prefer not to answer'],
                         shuffleChoices: false
                         // requiredChoice: false
                     },
                     {
                         id: 'socialmedia',
                         mainText: 'Do you spend time on social media?',
                         choices: [
                             'I am a very active user',
                             'I am a somewhat active user',
                             'I rarely use them',
                             'I never use them'
                         ],
                         shuffleChoices: false
                     },
                     {
                        id: 'employment',
                        selectMultiple: true,
                        mainText: 'What is your employment status? Select all that apply.',
                        choices: [
                            'Unemployed', 'Self-employed', 'Irregular employment', 'Employed Full-time',  'Employed Part-time', 'Student',
                            'Retired'
                        ]
                    },
                    {
                        id: 'income',
                        mainText: 'What number come closest to your ' +
                            'yearly income?',
                        hint: '(in thousands of dollars)',
                        choices: [0, 5]
                            .concat(J.seq(10, 100, 10))
                            .concat(J.seq(120, 200, 20))
                            .concat(J.seq(250, 500, 50))
                            .concat(['500+']),
                        shuffleChoices: false,
                        choicesSetSize: 8
                    },
                    {
                        name: 'ChoiceTableGroup',
                        id: 'incomeclass',
                        mainText: 'To which social class do you feel ' +
                            'you belong?',
                        hint: '(If unsure, make your best guess)',
                        choices: [
                            'Bottom', 'Lower', 'Lower-Middle',
                            'Middle',
                            'Upper-Middle', 'Upper', 'Elite'
                        ],
                        items: [
                            {
                                id: 'now',
                                left: 'Now'
                            },
                            {
                                id: 'child',
                                left: 'As a child'
                            },
                            {
                                id: 'future',
                                left: 'In the future'
                            }
                        ],
                        shuffleChoices: false
                     }
                 ],
                 formsOptions: {
                     requiredChoice: true,
                     shuffleChoices: true
                 },
                 className: 'centered'
             }
         }
     });
 
 
     //Singelis scale
     stager.extendStep('self-construal', {
         widget: {
             name: 'ChoiceManager',
             id: 'selfconstrual',
             options: {
                 mainText: 'Self-construal ' +
                     'refers to the grounds of self-definition, and the extent to which the self is defined independently of others or interdependently with others.',
                 simplify: true,
                     forms: [
                     {
                         name: 'ChoiceTableGroup',
                         id: 'singelis',
                         choices: J.seq(1, 7),
                         mainText: 'Express your agreement ' +
                             'on a scale from 1 to 7, where 1 means ' +
                             'strongly disagree and 7 strongly agree, ' +
                             'with the following statements.<br/><br/>',
                         items: [
                             {
                                 id: 'HI1',
                                 left: 'I’d rather depend on myself than others'
                             },
                             {
                                 id: 'HI2',
                                 left: 'I rely on myself most of the time; I rarely rely on others'
                             },
                             {
                                 id: 'HI3',
                                 left: 'My personal identity, independent of others, is very important to me'
                             },
                             {
                                id: 'HI4',
                                left: 'I prefer to be direct and forthright when discussing with people'
                            },
                            {
                                id: 'HC1',
                                left: 'If a coworker gets a prize, I would feel proud.'
                            },
                            {
                                id: 'HC2',
                                left: 'The well-being of my coworkers is important to me'
                            },
                            {
                                id: 'HC3',
                                left: 'To me, pleasure is spending time with others'
                            },
                            {
                               id: 'HC4',
                               left: 'I feel good when I cooperate with others'
                           },
                           {
                                 id: 'VI1',
                                 left: 'It is important that I do my job better than others'
                             },
                             {
                                 id: 'VI2',
                                 left: 'Winning is everything'
                             },
                             {
                                 id: 'VI3',
                                 left: 'Competition is the law of nature; life is a game of survival of the fittest'
                             },
                             {
                                id: 'VI4',
                                left: 'When another person does better than I do, I get tense'
                            },
                            {
                                id: 'VC1',
                                left: 'Parents and children must stay together as much as possible'
                            },
                            {
                                id: 'VC2',
                                left: 'It is my duty to take care of my family even when I have to sacrifice what I want'
                            },
                            {
                                id: 'VC3',
                                left: 'Family members should stick together no matter what sacrifices are required'
                            },
                            {
                               id: 'VC4',
                               left: 'It is important to me that I respect the decisions made by my groups'
                           },
                         ]
                     },
                 ],
                 formsOptions: {
                     requiredChoice: true,
                     // how can I shuffle the questions?
                 },
                 className: 'centered'
             }
         }
     });

     //Blockchain competency quiz
 
     stager.extendStep('blockchain quiz', {
         widget: {
             name: 'ChoiceManager',
             id: 'blockchainquiz',
             options: {
                 mainText: 'Quiz questions to measure your understanding of blockchain technology. If you don\'t know the answer, please select "I don\'t know" instead of guessing. The accuracy of your selections will have no effect on your final payment.',
                 simplify: true,
                 forms: [
                     {
                         id: 'quiz1',
                         mainText: 'What is a blockchain?',
                         choices: [
                             'A type of cryptocurrency',
                             'An exchange',
                             'A distributed ledger on a peer to peer network',
                             'A centralized ledger run by Bitcoin',
                             'I don\'t know'
                         ],
                         shuffleChoices: false
                         // correctChoice: 2
                     },
                     {
                         id: 'quiz2',
                         mainText: 'Are blockchains fully public (i.e. accessible by everyone)?',
                         choices: [
                             'Yes',
                             'No',
                             'It depends',
                             'I don\'t know'
                         ],
                         shuffleChoices: false
                         // correctChoice: 2
                     },
                     {
                         id: 'quiz3',
                         mainText: 'Decentralized blockchains (like the ones used by Bitcoin) are ‘immutable,’ what does this imply?',
                         choices: [
                             'They cannot be altered',
                             'They can only store numerical data',
                             'They cannot be accessed by any user',
                             'Their computation speed is not limited',
                             'I don\'t know'
                         ],
                         // correctChoice: 0
                     },
                     {
                         id: 'quiz4',
                         mainText: 'If a hacker wanted to alter a blockchain, which percentage of the blocks would they have to alter?',
                         choices: [
                             'Only their copy',
                             '1%',
                             '51%',
                             '100%',
                             'I don\'t know'
                         ],
                         shuffleChoices: false
                         // correctChoice: 1
                     },
                     {
                         id: 'quiz5',
                         mainText: 'What incentivizes miners to give correct validation of transactions?',
                         choices: [
                             'A nonce',
                             'A block reward',
                             'Thumbs up from the community',
                             'More memory',
                             'I don\'t know'
                         ],
                         // correctChoice: 1
                     },
                     {
                        id: 'quiz6',
                        mainText: 'What is proof of stake?',
                        choices: [
                            'A certificate needed to use the blockchain',
                            'A password needed to access an exchange',
                            'How private keys are made',
                            'A transaction and block verification protocol',
                            'I don\'t know'
                        ],
                        // correctChoice: 3
                    },
                    {
                        id: 'quiz7',
                        mainText: 'What is a smart contract?',
                        choices: [
                            'A digitally written formal employment contract',
                            'A program stored on a blockchain that is automatically executed when predetermined conditions are met',
                            'A contract between Bitcoin holders and Bitcoin',
                            'A blockchain program that enables you to digitally view and manage all of your contracts',
                            'I don\'t know'
                        ],
                        // correctChoice: 1
                    },
                    {
                        id: 'quiz8',
                        mainText: 'Which of the below is not an attribute of smart contracts?',
                        choices: [
                            'Self-verifying',
                            'Self-enforcing',
                            'Tamper-proof',
                            'Risk-free',
                            'I don\'t know'
                        ],
                        // correctChoice: 3
                    },
                    {
                        id: 'quiz9',
                        mainText: 'What is a DAO?',
                        choices: [
                            'Decentralized Autonomous Organization',
                            'Distributed Anonymous Organization',
                            'Decentralized Advanced Operation',
                            'Distributed Accountable Operation',
                            'I don\'t know'
                        ],
                        // correctChoice: 0
                    },
                    {
                        id: 'quiz10',
                        mainText: 'Which of the below is not a characteristic of a DAO?',
                        choices: [
                            'Provides flexibility in the design of an organization',
                            'Provides transparency of the rules of an organization',
                            'Enables large-scale democratic decision-making',
                            'Reduces the need for centralized power structures internally and externally',
                            'Gets rid of the need for human labor',
                            'I don\'t know'
                        ],
                        // correctChoice: 4
                    }
                 ],
                 formsOptions: {
                     shuffleChoices: true
                 },
                 className: 'centered'
             }
         }
     });

     //Blockchain involvement questions

     stager.extendStep('blockchain involvement', {
        widget: {
            name: 'ChoiceManager',
            options: {
                id: 'blockchain involvement',
                mainText: 'How involved are you with blockchain technology?',
                simplify: true,
                forms: [
                    {
                        id: 'blockchain1',
                        mainText: 'Do you own any cryptocurrencies?',
                        choices: [
                            'Yes, I am highly invested', 'Yes, but not much', 'No, but I am interested', 'No, and I am not interested'
                        ],
                        shuffleChoices: false
                    },
                    {
                        id: 'blockchain2',
                        mainText: 'How many people do you know that own cryptocurrencies?',
                        choices: [
                            'None', '1-5', '6-20', '20+'
                        ]
                    },
                    {
                        id: 'blockchain3',
                        mainText: 'Have you ever heard of a Decentralized Autonomous Organization?',
                        choices: ['Yes', 'No', 'I am not sure'],
                    },
                    {
                        id: 'blockchain4',
                        mainText: 'Are you a member of a Decentralized Autonomous Organization?',
                        choices: [
                            'Yes, I founded a DAO',
                            'Yes, I am a member of a DAO',
                            'No, but I am interested',
                            'No, I am not interested'
                        ]
                    },
                    {
                        id: 'blockchain5',
                        mainText: 'Do you trust blockchain technologies?',
                        choices: [
                            'No, I am skeptical of all technology',
                            'No, I specifically do not trust blockchain technologies',
                            'No, but I might if I could understand how it works',
                            'Yes, but I am still cautious',
                            'Yes, absolutely'
                        ]
                    },
                    {
                        id: 'blockchain6',
                        mainText: 'Would you consider using blockchain technology to create an organization?',
                        choices: [
                            'Yes',
                            'No',
                            'I don\'t know',
                        ]
                    }
                ],
                formsOptions: {
                    requiredChoice: true,
                    shuffleChoices: false
                },
                className: 'centered'
            }
        }
    });

     stager.extendStep('surveydone', {
        frame: 'surveyend.htm',
        done: function() {
            node.say('survey-over');
        }
    });
 
     
 
 /**     stager.extendStep('end', {
         widget: {
             name: 'EndScreen',
             options: {
                 feedback: true,
                 email: true
             }
         },
         init: function () {
             node.say('end');
             node.game.doneButton.destroy();
             node.game.backButton.destroy();
         }
     });
//Exlcuded Questions:
     {
                        id: 'studentdebt',
                        mainText: 'Do you have a student debt?',
                        choices: [
                            'Yes, and it is large',
                            'Yes, but it is manageable',
                            'No, I have paid it off',
                            'No, I never had it'
                        ],
                        shuffleChoices: false
                    },
                    {
                         name: 'CustomInput',
                         id: 'country',
                         //what should I keep in mind when changing the id?
                         mainText: 'Which country or countries do you most identify with culturally?',
                         width: '95%',
                         hint: '(If more than one country, order alphabetically ' +
                             'and seperate with a comma)',
                         //preprocess: capitalizeInput
                     },
                      {
                        id: 'ownhouse',
                        mainText: 'Do you own a house or an apartment?',
                        choices: [
                            'Yes', 'No',
                        ],
                        shuffleChoices: false
                    },
                    {
                        id: 'owncar',
                        mainText: 'Do you own a car?',
                        choices: [
                            'Yes', 'No',
                        ],
                        shuffleChoices: false
                    },
                    {
                         id: 'quiz1',
                         mainText: 'True or False: Blockchain is the same as Bitcoin.',
                         choices: [
                             'True',
                             'False',
                             'I don\'t know'
                         ],
                         shuffleChoices: false
                         // correctChoice: 1
                     },
                     {
                         id: 'quiz3',
                         mainText: 'What does the block in a blockchain consist of?',
                         choices: [
                             'Transaction data',
                             'A hash point',
                             'A timestamp',
                             'Transaction data, a hash point and a timestamp',
                             'I don\'t know'
                         ],
                         shuffleChoices: false
                         // correctChoice: 3
                     },
                     {
                         id: 'quiz7',
                         mainText: 'What is a miner?',
                         choices: [
                             'A type of blockchain',
                             'An algorithm that predicts the next part of the chain',
                             'A person doing calculations to verify a transaction',
                             'Computers that validate and process blockchain transactions',
                             'I don\'t know'
                         ],
                         // correctChoice: 3
                     },
/** */


};
