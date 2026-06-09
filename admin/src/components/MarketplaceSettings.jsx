export default function MarketplaceSettings({

 marketplace,

 setMarketplace

}){

 return(

 <div
 className="
 space-y-4
 "
 >

  <input

   value={
    marketplace.title
   }

   placeholder="
   Marketplace Title
   "

   onChange={(e)=>
   setMarketplace({
    ...marketplace,

    title:
     e.target.value
   })
   }

  />

  <textarea

   value={
    marketplace.description
   }

   placeholder="
   Description
   "

   onChange={(e)=>
   setMarketplace({
    ...marketplace,

    description:
     e.target.value
   })
   }

  />

 </div>

 );

}