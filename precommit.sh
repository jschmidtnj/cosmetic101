#!/bin/bash

# abort on errors
set -e

cd frontend
yarn run precommit
cd ../functions
yarn run precommit
cd ..
git add -A
