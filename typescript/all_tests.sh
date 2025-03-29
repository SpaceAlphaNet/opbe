#!/bin/bash

npx tsc
for file in ts-tests/cases/*.js
do
  node "$file"
done
