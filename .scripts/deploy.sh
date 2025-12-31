#!/bin/bash
set -e
echo "Deploy Process"

pwd
sudo git pull origin main
sudo unzip -o public/build.zip -d public/

echo "Deploy Success"
