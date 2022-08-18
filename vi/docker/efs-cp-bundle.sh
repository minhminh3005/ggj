export GOGO_EFS=${CB}/surface.gogojungle.co.jp
export GOGO_WD=${EFS}/gui-sf-vi
rm -rf ${GOGO_WD}
mkdir -m 777 ${GOGO_WD}
${GOGO_EFS}/vi/docker/cp-bundle.sh
