#!/bin/bash
bash ./pbstop.sh 1> /dev/null
screen -S pianobar -d -m bash -c 'pianobar'
echo "Starting pandora process"