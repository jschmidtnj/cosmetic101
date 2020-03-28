#!/bin/sh

set -e

cd frontend
yarn install
yarn run build
cd -

cd functions
yarn install
yarn run build
cd -
