#!/bin/bash
##Assign tlsfingerprint to variable
tlsFingerPrint=`openssl s_client -connect tuner.pandora.com:443 < /dev/null 2> /dev/null | \
openssl x509 -noout -fingerprint | tr -d ':' | cut -d'=' -f2`
##Debug print
echo "$tlsFingerPrint"

##Config file path
file="/home/pi/.config/pianobar/config"

##Re-write tlsfingerprint
sed -i "s/^tls_fingerprint =.*/tls_fingerprint = $tlsFingerPrint/" $file