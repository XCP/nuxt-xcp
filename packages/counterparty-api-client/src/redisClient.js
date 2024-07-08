import { Redis } from '@upstash/redis';

const redis = new Redis({
  url: 'https://relaxed-coral-54164.upstash.io', // Hardcoded URL
  token: 'AdOUAAIncDE5MzY5ZjdjZTMzNTk0MTU5YjIwOTg4MDk1N2UzMzhlOXAxNTQxNjQ', // Hardcoded token
});

export default redis;
