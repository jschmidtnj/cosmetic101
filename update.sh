#!/bin/bash

# abort on errors
set -e

yarn upgrade
cd frontend
yarn upgrade
cd ../functions
yarn upgrade
cd ..
