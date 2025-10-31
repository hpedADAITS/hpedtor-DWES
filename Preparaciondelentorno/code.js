const chalk = require('chalk');
 var youShouldNeverUseVar = "This is my very long line that eslint
should check as an error
...........................................";

 function myFunction(used, nonUsed){
 if(used){
7 console.log(used)
8 return
}
 }

 module.exports = nonExistingVar;
