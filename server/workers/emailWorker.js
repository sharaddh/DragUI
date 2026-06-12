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

 "emailQueue",

 async(job)=>{

  console.log(
   "Sending Email:",
   job.data.email
  );

 },

 { connection }

);