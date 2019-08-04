#!/bin/bash
echo "Closing out pandora process"
pkill -xf "SCREEN -S pianobar -d -m bash -c pianobar"