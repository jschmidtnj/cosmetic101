#!/bin/sh

set -e

npm run build --prefix functions
npm run build --prefix frontend
