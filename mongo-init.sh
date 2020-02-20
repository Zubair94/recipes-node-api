#!/usr/bin/env bash
RET=1
while [[ RET -ne 0 ]] ; do
    echo "=> Waiting for confirmation of MongoDB service startup..."
    sleep 10
    mongo admin --eval "help" >/dev/null 2>&1
    RET=$?
done
echo 'Creating Database User and Database'
if [ "$db" != "admin" ]; then
    echo "=> Creating an ${db} user with a password in MongoDB"
    mongo admin -u $rootuser -p $rootpassword << EOF
use $db
db.createUser({user: '$dbuser', pwd: '$dbpassword', roles:[{role:'dbOwner', db:'$db'}]})
EOF

echo "========================================================================"
echo "$dbuser user created in $db! PROTECT the password found in the .env file."
echo "========================================================================"
else
  echo "=> Skipping App database and user creation."
fi

sleep 1

if [ -d "/var/backups/mongobackups/${db}" ]; then
  echo "========================================================================="
  echo "========================================================================="
  echo "                       Restoring Database                                "
  echo "========================================================================="
  echo "========================================================================="

  mongorestore -u ${dbuser} -p ${dbpassword} --db ${db} --drop /var/backups/mongobackups/${db}
  dbrestore=$?
  if [ $dbrestore -eq 0 ]; then
    echo "========================================================================="
    echo "                       Database ${db} Restored                           "
    echo "========================================================================="
  else
    echo "Failed to Restore Database"
  fi
else
  echo "=> Done! did not find any backup to restore database"
fi