#!/bin/bash

# abort on errors
set -e

yarn install
cd frontend
yarn install
cd ../functions
yarn install
cd ..
