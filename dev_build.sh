#!/usr/bin/env bash

podman build -t todo_dev:latest -f dev.Containerfile

podman pod rm -f todo_dev_pod || true

podman pod create --name todo_dev_pod -p 3000:3000 --net bridge

podman run --replace --pod todo_dev_pod --name mongodb_dev --restart on-failure:2 -d -e MONGO_INITDB_ROOT_USERNAME=root -e MONGO_INITDB_ROOT_PASSWORD=root -v mongodb_data_dev:/data/db:Z mongo:latest

podman run --replace --pod todo_dev_pod --name todo_app_dev --restart on-failure:2 -d -e MONGODB_URI=mongodb://root:root@localhost:27017/todoapp?authSource=admin -v ./:/app:Z -v /app/node_modules -v /app/.next todo_dev