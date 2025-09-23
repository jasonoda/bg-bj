/**
 * This function should return an object that looks like this:
 *
 * {
 *   isValid: true | false,
 *   reasons: [] // an array of strings
 * }
 *
 * @param initialGameData This is the same data structure passed to the iFrame using the window.CG_API.InitGame message
 * @param breadcrumbs This is an array of breadcrumb objects received from the game using the window.GC_API.BreadCrumb message
 * @param finalGameData This is the final score object sent from the game using the window.GC_API.FinalScores message
 */

const validateGameDataCode = 
`
function validateGameData(initialGameData, breadcrumbs, finalGameData) {

  // add final breadcrumb

  breadcrumbs.push(finalGameData.metadata.breadcrumb);

  console.log("validate game data");
  
  var isValid = true;
  var reasons = [];

  console.log("---------------------------------------");

  for(var i=0; i<breadcrumbs.length; i++){

    console.log(i);
    console.log(breadcrumbs[i]);

  }

  console.log("---------------------------------------");

  console.log(finalGameData);

  console.log("---------------------------------------");

  // ---------------------------------------------------------------------------------------------
  // check score - breadcrumbs should add up to final score
  // ---------------------------------------------------------------------------------------------

  this.scoreCheck = 0;

  for(var i=0; i<breadcrumbs.length; i++){

    var b = breadcrumbs[i]
    console.log("Breadcrumb " + i + ":", b);
    if(b.levelScore!==undefined){
         this.scoreCheck += b.levelScore;
         console.log("Adding levelScore:", b.levelScore, "Total so far:", this.scoreCheck);
         
         // Check handScores add up to levelScore
         if(b.handScores && Array.isArray(b.handScores)){
             var handScoreTotal = 0;
             for(var j=0; j<b.handScores.length; j++){
                 handScoreTotal += b.handScores[j];
             }
             if(handScoreTotal !== b.levelScore){
                 reasons.push("HAND SCORES DON'T MATCH LEVEL SCORE for breadcrumb " + i + ": " + handScoreTotal + " / " + b.levelScore);
                 isValid = false;
             }
         }
    } else {
         console.log("No levelScore found in breadcrumb", i);
    }

    console.log("SC "+i+" / "+this.scoreCheck);
   
  }

  if(this.scoreCheck!==finalGameData.score){
    
    reasons.push("BREADCRUMB SCORES DID NOT ADD UP "+this.scoreCheck+" / "+finalGameData.score);
    isValid=false;

  }
  
  // ---------------------------------------------------------------------------------------------
  // check game scores
  // ---------------------------------------------------------------------------------------------

  this.scoreCheck = 0;

  console.log(breadcrumbs.length);

  for(var i=0; i<breadcrumbs.length; i++){

    var b = breadcrumbs[i]
    if(b.levelScore!==undefined){
         this.scoreCheck+=b.levelScore;
    }

  }

  if(this.scoreCheck!==finalGameData.score){
    
    reasons.push("GAME SCORES DID NOT ADD UP "+this.scoreCheck+" / "+finalGameData.score);
    isValid=false;

  }
  
  // ---------------------------------------------------------------------------------------------
  // check breadcrumb count - should be 8 (7 every 15 seconds + 1 final)
  // ---------------------------------------------------------------------------------------------

  var expectedBreadcrumbs = 8; // 120 seconds / 15 seconds = 8 intervals

  if( breadcrumbs.length !== expectedBreadcrumbs){

    reasons.push("INCORRECT BREADCRUMB COUNT "+breadcrumbs.length+" / "+expectedBreadcrumbs);
    isValid=false;

  }
  
  // ---------------------------------------------------------------------------------------------
  // end
  // ---------------------------------------------------------------------------------------------

  console.log("---------------------------------------");

  console.log("IS VALID: "+isValid);

  for(var i=0; i<reasons.length; i++){

    console.log( reasons[i] );

  }

  console.log("---------------------------------------");

  var status = {
    isValid: isValid,
    reasons: reasons
  }

  return status

}
`