#! /usr/bin/bash
name=pictionary
#Build Client
cd client && npm run build && cd ..
docker kill $name
docker rm $name
docker rmi $name
docker build -t $name .
docker run -d -p 5000:5000 -v ./storage:/app/build/uploads --name $name $name