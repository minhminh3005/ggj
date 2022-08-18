export GOGO_EFS=${CB}/surface.gogojungle.co.jp
export GOGO_WD=${EFS}/gui-sf-th
rm -rf ${GOGO_WD}
mkdir -m 777 ${GOGO_WD}
${GOGO_EFS}/th/docker/cp-bundle.sh
