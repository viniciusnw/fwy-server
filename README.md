# Connect to SSH
```
$ ssh -tt $SSH_URL
```

# Check service node log 
```
$ docker logs -f node
$ docker-compose logs -t -f --tail
```

# BackUp Mongo
save and restore
https://docs.mongodb.com/manual/tutorial/backup-and-restore-tools/
```
$ mongodump -d old_db_name -o mongodump/
$ mongorestore -d new_db_name mongodump/old_db_name
```

# Mongo Config
https://docs.mongodb.com/manual/reference/program/mongo/
https://docs.mongodb.com/manual/reference/mongo-shell/
https://docs.mongodb.com/manual/mongo/#start-the-mongo-shell-and-connect-to-mongodb

# Install SSL
sudo openssl req -x509 -nodes -days 365 -newkey rsa:2048 -keyout ./certs/nginx-selfsigned.key -out ./certs/nginx-selfsigned.crt
sudo openssl dhparam -out /etc/ssl/certs/dhparam.pem 2048

# Free SSL
https://letsencrypt.org/pt-br/getting-started/