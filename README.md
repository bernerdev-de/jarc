# JARC - Just a simple cloud

### **IMPORTANT: JARC is in the very early alpha, it will change a lot and the information provided here may be incomplete**

Currently, it's just a small website for uploading and sharing files. Listing directories and uploading files is only possible as the logged-in admin user.

In the future, this project will be improved and changed. Use this version of JARC only for testing. We will not guaranty the safety of your files. Back them up.

We recommend running JARC in a containerized environment like docker or lxc. Docker images are available at [bernerdev on Dockerhub](https://hub.docker.com/r/bernerdev/jarc).

<br>

## Getting started with docker

```bash
docker volume create jarc
docker run -p  --name jarc -v jarc:/app/data bernerdev/jarc:latest
```

All your uploaded data will be stored in `/app/data`. Please mount this as volume and back it up regularly

<br>

## Getting started without containerization

```bash
cd /opt
git clone https://github.com/benerdev/jarc.git ./jarc
cd jarc
export NODE_ENV=development
npm install

# Now you can start the application in two different ways:
# Option one:
npm run start

# Option two:
npm run build
rm -r src .eslintrc.js .gitignore .git .prettierrc docker-compose.yml Dockerfile nest-cli.json README.md tsconfig.build.json tsconfig.json .vscode
export NODE_ENV=production
npm install
node dist/main.js
```

(Add description for running as system service here)

<br>

## Upcoming changes and features

* separation of front- and backend
* restructuring of the backend
* users (and roles)
* virtual filesystem (the directory structure in the database only, files are stored flat in one directory on the servers file system or in s3 like storage maybe [if you have any thoughts on this we would be happy if you contact us in [discord](https://discord.bernerdev.de)])
* file encryption
* sharing as an feature that has to be enabled on a file
* sharing of complete folders
* (sftp/ftp access)