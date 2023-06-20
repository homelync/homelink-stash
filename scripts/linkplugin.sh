if [[ $# -eq 0 ]] ; then
    echo 'usage: . linkplugin.sh pluginRepoDir pluginName'
    echo 'e.g: . linkplugin.sh my-plugin-dir my-plugin'
    return 0
fi

mkdir -p ../src/plugins/$2
lndir ../../../../$1/src ../src/plugins/$2
ln -sf ../../../../$1/package.json ../src/plugins/$2/package.json
cd ../src/plugins/$2
npm i
cd ../../..
echo "PLUGIN $2 LINKED - make sure you rerun this is you add new files or directories to the plugin, editing files does not edit this."