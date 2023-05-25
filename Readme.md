## Setup sycner node

you need nodejs 18 and and xray project installed on your server to serve as a syncer service in project. after cloning the project into your server. follow the instructions

### Install nodejs 18

1. run `curl -sL https://deb.nodesource.com/setup_18.x -o nodesource_setup.sh`
2. run `bash nodesource_setup.sh`
3. run `apt install nodejs` to install the package.
4. run `node -v` to check installed nodejs version on session.

### Install xray package

1. install xray `bash -c "$(curl -L https://github.com/XTLS/Xray-install/raw/main/install-release.sh)" @ install`
2. wait untill package is installed. xray installtion may throw error on a fresh installed ubuntu server about missing package `zip` or `unzip`. you can install them by running `apt install zip unzip -y`

### Syncer service configs

1. move to project root.
2. there is a file named `.env.example`. you have to make file named `.env` from it. run `cp .env.example .env`
3. open `.env` file by `nano .env` or any other editor.
4. field `SECRET_TOKEN` is an string given to you from absenat operators.
5. field `PORT` is the port number syncer service is going to be served on it. please note that the port number must be open to public and absenat operators should know it.
6. field `XRAY_CONFIG_PATH` is the absolute path to xray config json file. if you have installed the xray package. it should be on `/usr/local/etc/xray/config.json`.
7. run `npm i` to install packages.
8. run `npm run build` to build the service.
9. run `npm start` to start build files.

> please note you should update your service whenever there is a new version released for syncer service. absenat will inform you in telegram channel
