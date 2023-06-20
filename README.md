[![Docker](https://github.com/contextmachine/shipping/actions/workflows/docker-publish.yml/badge.svg)](https://github.com/contextmachine/shipping/actions/workflows/docker-publish.yml)

# Shipping Tracker Application



## Running Locally
Setup hasura endpoint as environment variable:
```bash
echo NEXT_PUBLIC_URL=http://<hasura>/v1/graphql >> .env.local
```
Install requirenments:
```bash
npm i
```
Start:
```bash
yarn dev
```
or with prod build:
```bash
yarn build
yarn start
```
## Running with docker

Pulling a current image, passing environment from file, and run container on http://localhost:3000 . 
```bash
docker run -p 0.0.0.0:3000:3000 --env-file .env.local --rm ghcr.io/contextmachine/cxm-shipping:latest
```
## Build image and run container with docker
Build local image, create container and run it:
```bash
DOCKER_BUILDKIT=1 docker build  -t shipping-test . && docker run -p 0.0.0.0:3000:3000 --env-file .env.local --rm shipping-test
```
or:
```bash
# make script executable
chmod +x build.sh 
# run script
./build.sh

```


