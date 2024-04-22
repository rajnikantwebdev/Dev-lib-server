import { createClient } from "redis";

const client = await createClient({
  password: "PD8bCNUmS60zsgUwvW2apJrerEKOZo0y",
  socket: {
    host: "redis-13478.c292.ap-southeast-1-1.ec2.cloud.redislabs.com",
    port: 13478,
  },
})
  .on("error", (err) => console.log("Redis client Error ", err))
  .connect();

export default client;
