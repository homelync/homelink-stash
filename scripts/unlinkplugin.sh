if [[ $# -eq 0 ]] ; then
    echo 'usage: . unlinkplugin.sh pluginName'
    echo 'e.g: . unlinkplugin.sh my-plugin'
    return 0
fi

rm -rf ../src/plugins/$1