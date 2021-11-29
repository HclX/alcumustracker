#!/bin/sh
set -x

mkdir -p debug
. .venv/bin/activate

while true;
do
    TS=`TZ='America/Los_Angeles' date +%Y%m%d`
    TT=$(find debug -name "${TS}-*")
    if [ -z "$TT" ]
    then
        python3 main.py
        continue
    fi
    sleep 1h
done
