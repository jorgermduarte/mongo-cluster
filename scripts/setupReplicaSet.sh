#!/bin/bash

REPLICA_SET_NAME=rs0

MONGODB1=mongo1
MONGODB1_PORT=27017

MONGODB2=mongo2
MONGODB2_PORT=27018

MONGODB3=mongo3
MONGODB3_PORT=27019

echo "********** setupReplicaSet.sh **********"
echo ${MONGODB1}
until curl http://${MONGODB1}:${MONGODB1_PORT}/serverStatus\?text\=1 2>&1 | grep uptime | head -1; do
  printf '.'
  sleep 1
done

echo setupReplicaSet.sh time now: `date +"%T" `
/usr/bin/mongosh --host ${MONGODB1}:${MONGODB1_PORT} <<EOF
var cfg = {
  "_id": "${REPLICA_SET_NAME}",
  "members": [
    {
      "_id": 0,
      "host": "${MONGODB1}:${MONGODB1_PORT}",
      "priority": 2
    },
    {
      "_id": 1,
      "host": "${MONGODB2}:${MONGODB2_PORT}",
      "priority": 0
    },
    {
      "_id": 2,
      "host": "${MONGODB3}:${MONGODB3_PORT}",
      "priority": 0
    }
  ]
};
rs.initiate(cfg);
rs.reconfig(cfg, {force: true});
rs.secondaryOk();
rs.conf();
EOF