# Digital Ocean / Server
> install node/npm/yarn
```
$ sudo apt update
$ sudo apt install nodejs
$ sudo apt install npm
$ sudo npm install -g yarn
```

# After runs deploy / on Server

> connect to ssh
```
$ ssh -tt $SSH_URL
```

> check service node log
```
$ docker logs -f node
$ docker-compose logs -t -f --tail
```

# BackUp Mongo
> save and restore
> https://docs.mongodb.com/manual/tutorial/backup-and-restore-tools/
```
$ mongodump -d old_db_name -o mongodump/
$ mongorestore -d new_db_name mongodump/old_db_name
```

# Mongo Config
> https://docs.mongodb.com/manual/reference/program/mongo/
> https://docs.mongodb.com/manual/reference/mongo-shell/
> https://docs.mongodb.com/manual/mongo/#start-the-mongo-shell-and-connect-to-mongodb