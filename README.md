# Eavor Homework-React
Here in this project, I introduce a react based solution. I choose to use the same concept of using a state machine that I implemented in the Python based solution. 

The state machine answers a simple question. Given a state A and a state B what commands should we use to move from A to B. This approach gives us flexibility in configuring the state machine and adding new states in the future without altering the code. 

Further, the state machine can be super useful to be integrated with the Reducers in react which is another state machine for UI. 

For example, first the applicaiton says I am in @ state and I want to move to a B state (a booster), what should we do? Using the transition funciton our state machine suggests a list of commands and in this case it would be [boostCommand,moveCommand]. The applicaiton gets this commands and then dipatches the right actions to the reducer. 

It's good to mention that the command has not just a name rather has a callback funciton. Actually, in a more complex applciaiton, these callbacks would seperate the complexity and make the code more readable. 


# How To Run
The code is hosted on codesandbox so if you want to run it, please use this [link](https://codesandbox.io/p/github/maenmulhemeng/eavorHomework-React/draft/blissful-hofstadter?workspaceId=dd641f30-210b-4137-9ed0-8d019d9860d1&layout=%257B%2522sidebarPanel%2522%253A%2522EXPLORER%2522%252C%2522rootPanelGroup%2522%253A%257B%2522direction%2522%253A%2522horizontal%2522%252C%2522contentType%2522%253A%2522UNKNOWN%2522%252C%2522type%2522%253A%2522PANEL_GROUP%2522%252C%2522id%2522%253A%2522ROOT_LAYOUT%2522%252C%2522panels%2522%253A%255B%257B%2522type%2522%253A%2522PANEL_GROUP%2522%252C%2522contentType%2522%253A%2522UNKNOWN%2522%252C%2522direction%2522%253A%2522vertical%2522%252C%2522id%2522%253A%2522clwfacf2r0008356k9cm06h4u%2522%252C%2522sizes%2522%253A%255B70%252C30%255D%252C%2522panels%2522%253A%255B%257B%2522type%2522%253A%2522PANEL_GROUP%2522%252C%2522contentType%2522%253A%2522EDITOR%2522%252C%2522direction%2522%253A%2522horizontal%2522%252C%2522id%2522%253A%2522EDITOR%2522%252C%2522panels%2522%253A%255B%257B%2522type%2522%253A%2522PANEL%2522%252C%2522contentType%2522%253A%2522EDITOR%2522%252C%2522id%2522%253A%2522clwfacf2r0002356kwrt4tcbm%2522%257D%255D%257D%252C%257B%2522type%2522%253A%2522PANEL_GROUP%2522%252C%2522contentType%2522%253A%2522SHELLS%2522%252C%2522direction%2522%253A%2522horizontal%2522%252C%2522id%2522%253A%2522SHELLS%2522%252C%2522panels%2522%253A%255B%257B%2522type%2522%253A%2522PANEL%2522%252C%2522contentType%2522%253A%2522SHELLS%2522%252C%2522id%2522%253A%2522clwfacf2r0006356khedljizz%2522%257D%255D%252C%2522sizes%2522%253A%255B100%255D%257D%255D%257D%252C%257B%2522type%2522%253A%2522PANEL_GROUP%2522%252C%2522contentType%2522%253A%2522DEVTOOLS%2522%252C%2522direction%2522%253A%2522vertical%2522%252C%2522id%2522%253A%2522DEVTOOLS%2522%252C%2522panels%2522%253A%255B%257B%2522type%2522%253A%2522PANEL%2522%252C%2522contentType%2522%253A%2522DEVTOOLS%2522%252C%2522id%2522%253A%2522clwfacf2r0007356kmhhkck0u%2522%257D%255D%252C%2522sizes%2522%253A%255B100%255D%257D%255D%252C%2522sizes%2522%253A%255B50%252C50%255D%257D%252C%2522tabbedPanels%2522%253A%257B%2522clwfacf2r0002356kwrt4tcbm%2522%253A%257B%2522tabs%2522%253A%255B%257B%2522id%2522%253A%2522clwfacf2q0001356kmqvhqnkn%2522%252C%2522mode%2522%253A%2522permanent%2522%252C%2522type%2522%253A%2522FILE%2522%252C%2522filepath%2522%253A%2522%252FREADME.md%2522%257D%255D%252C%2522id%2522%253A%2522clwfacf2r0002356kwrt4tcbm%2522%252C%2522activeTabId%2522%253A%2522clwfacf2q0001356kmqvhqnkn%2522%257D%252C%2522clwfacf2r0007356kmhhkck0u%2522%253A%257B%2522tabs%2522%253A%255B%255D%252C%2522id%2522%253A%2522clwfacf2r0007356kmhhkck0u%2522%257D%252C%2522clwfacf2r0006356khedljizz%2522%253A%257B%2522tabs%2522%253A%255B%257B%2522id%2522%253A%2522clwfacf2r0003356kyxayoj34%2522%252C%2522mode%2522%253A%2522permanent%2522%252C%2522type%2522%253A%2522TASK_LOG%2522%252C%2522taskId%2522%253A%2522start%2522%257D%252C%257B%2522id%2522%253A%2522clwfacf2r0004356k7vjtxzo0%2522%252C%2522mode%2522%253A%2522permanent%2522%252C%2522type%2522%253A%2522TERMINAL%2522%252C%2522shellId%2522%253A%2522clwe9b89a0016dkis57253f1s%2522%257D%252C%257B%2522id%2522%253A%2522clwfacf2r0005356k87uu93z7%2522%252C%2522mode%2522%253A%2522permanent%2522%252C%2522type%2522%253A%2522TERMINAL%2522%252C%2522shellId%2522%253A%2522clwedtghw001tdkisaba926ax%2522%257D%255D%252C%2522id%2522%253A%2522clwfacf2r0006356khedljizz%2522%252C%2522activeTabId%2522%253A%2522clwfacf2r0003356kyxayoj34%2522%257D%257D%252C%2522showDevtools%2522%253Atrue%252C%2522showShells%2522%253Atrue%252C%2522showSidebar%2522%253Atrue%252C%2522sidebarPanelSize%2522%253A15%257D)

and the bottom panel you can open a terminal and start the application using `yarn start` and then pres on preview to see the result. Also you can visit `https://vpz29j-3000.csb.app/` 

However, if you want to install this applicaiton and run it on your machine you can clone the project and then `yarn install` and then `yarn start`

When you run the applicaiton, you can click on `Copy Case1` or `Copy Case2` to try some examples, or you can start typing your own case but you need to respect the rules as it stated in the PDF document. After that you can click on `Parse` to start the game. 

The applicaiton will start moving with respect to the provided directions and states and it will show the currents state and the history of the movements. 


# Unit Tests
Using react testing library, I introduced how we can apply some unit tests on UI level and I choose for that two compoenents. 

If you want to run the test, please run `yarn test` 

# Components 
The applicaiton has four basic components and for simplicity I arrange them in one file 
1. `InputArea` where the user can input some cases and then click on `Parse` to start the game
1. `Game`: It's the main components and it shows the `InpurtArea` and the `Board` components 
1. `Board` is a like a matrix and it shows a matrix of `Square`
1. `Square` is the basic elemement that represent a viual representation of the state machine's state

# Hooks
The hooks that have been used in the solution 
1. UseEffect: Here, we auto play the game and in every step we register the new state in a history varaible. That would give the user an opportunity go back to previous steps if they want. 

1. UseReducer: Please check the `gameReducer.js` file

1. UseStateMachine: That's right! It's a custome hook. I introduced our state machine as a custom hook and then I injected it in the Game component. Part of it is to show how handy it is to build a custom hook, however to make it more usefull, we should provide more services tham just a transition function. 

