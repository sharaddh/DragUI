export default function calculateQuality(
 component
){

 let score = 0;

 if(
   component.description
 )
   score += 20;

 if(
   component.props?.length
 )
   score += 20;

 if(
   component.dependencies?.length
 )
   score += 15;

 if(
   component.version
 )
   score += 15;

 if(
   component.thumbnail
 )
   score += 20;

 if(
   component.code?.length > 200
 )
   score += 10;

 return score;
}