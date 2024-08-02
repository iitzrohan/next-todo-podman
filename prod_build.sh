#!/usr/bin/env bash

podman build -t todo_prod:latest -f prod.Containerfile

podman pod rm -f todo_prod_pod || true

podman pod create --name todo_prod_pod -p 3001:3001 --net bridge

podman run --replace --pod todo_prod_pod --name mongodb_prod --restart on-failure:2 -d -e MONGO_INITDB_ROOT_USERNAME=root -e MONGO_INITDB_ROOT_PASSWORD=root -v mongodb_data_prod:/data/db:Z mongo:latest

podman run --replace --pod todo_prod_pod --name todo_app_prod --restart on-failure:2 -d -e MONGODB_URI=mongodb://root:root@localhost:27017/todoapp?authSource=admin todo_prod