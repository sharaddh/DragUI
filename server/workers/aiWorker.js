import {
 Worker
}
from "bullmq";

import Redis
from "ioredis";

const connection =
 new Redis(
  process.env.REDIS_URL
 );

new Worker(

 "aiQueue",

 async(job)=>{

  console.log(
   "Processing AI Job:",
   job.id
  );

 },

 { connection }

);