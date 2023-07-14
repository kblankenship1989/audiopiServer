#!/bin/bash

BABEL_NODE="/home/pi/audiopiServer/node_modules/@babel/node/bin/babel-node.js"
BABEL_PRESET_ENV="/home/pi/audiopiServer/node_modules/@babel/preset-env/lib/index.js"
EXPRESS="/home/pi/audiopiServer/src/bin/www.js"

node $BABEL_NODE --presets $BABEL_PRESET_ENV $EXPRESS

