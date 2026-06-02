import redis from "../config/redis.js";

export const cache =
(seconds = 300) =>
async (
 req,
 res,
 next
) => {

 const key =
   req.originalUrl;

 const cached =
   await redis.get(key);

 if (cached) {
   return res.json(
     JSON.parse(cached)
   );
 }

 res.originalJson =
   res.json;

 res.json = (body) => {

   redis.setEx(
     key,
     seconds,
     JSON.stringify(body)
   );

   res.originalJson(body);
 };

 next();
};