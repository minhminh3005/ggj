export GOGO_EFS=${CB}/surface.gogojungle.co.jp
export GOGO_WD=${EFS}/gui-sf-en
rm -rf ${GOGO_WD}
mkdir -m 777 ${GOGO_WD}
${GOGO_EFS}/en/docker/cp-bundle.sh
