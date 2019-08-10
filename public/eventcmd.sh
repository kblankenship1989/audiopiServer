#!/usr/bin/env bash

host="http://127.0.0.1"
port=3000
baseurl="${host}:${port}/api"


# Here be dragons! #
# (Don't change anything below) #

stationList="${HOME}/audiopiServer/public/stationList"
currentSong="${HOME}/audiopiServer/public/currentSong"

while read L; do
	k="`echo "$L" | cut -d '=' -f 1`"
	v="`echo "$L" | cut -d '=' -f 2`"
	export "$k=$v"
done < <(grep -e '^\(title\|artist\|album\|stationName\|songStationName\|pRet\|pRetStr\|wRet\|wRetStr\|songDuration\|songPlayed\|rating\|coverArt\|stationCount\|station[0-9]*\)=' /dev/stdin) # don't overwrite $1...




post () {
	url=${baseurl}${1}
	curl -s -XPOST $url >/dev/null 2>&1
}

clean () {
	query=$1
	clean=$(echo $query | sed 's/ /%20/g')
	post $clean
}

stationList () {
	if [ -f "$stationList" ]; then
		rm "$stationList"
	fi

	end=`expr $stationCount - 1`
	
	for i in $(eval echo "{0..$end}"); do
		sn=station${i}
		eval sn=\$$sn
		echo "${i}:${sn}" >> "$stationList"
	done

    query="/pandora/stations"
	clean "$query"
}


case "$1" in
	songstart)
		STARTTIME=`date +%s`

		echo -n "${artist},,,${title},,,${album},,,${coverArt},,,${rating},,,${stationName},,,${songDuration},,,$STARTTIME" > "$currentSong"

        query="/pandora/songs/current"
		clean "$query"

		stationList
		;;

#	songfinish)
#		;;

	songlove)
		query="/pandora/songs/current?rating=${rating}"
		clean $query
		;;

#	songshelf)
#		;;

#	songban)
#		;;

#	songbookmark)
#		;;

#	artistbookmark)
#		;;

# playtimerefresh)
#   query="/songtimer/?songPlayed=${songPlayed}&songDuration=${songDuration}"
#   clean "$query"
#   ;;

esac
