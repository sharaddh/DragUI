import { Queue }
from "bullmq";

import Redis
from "ioredis";

const connection =
 new Redis(
  process.env.REDIS_URL
 );

export const aiQueue =
 new Queue(
  "aiQueue",
  { connection }
 );

export const emailQueue =
 new Queue(
  "emailQueue",
  { connection }
 );

export const analyticsQueue =
 new Queue(
  "analyticsQueue",
  { connection }
 );