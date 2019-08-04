#!/bin/bash
bash /home/pi/Patiobar/scripts/pbstop.sh 1> /dev/null
screen -S pianobar -d -m bash -c 'pianobar'
echo "Starting pandora process"