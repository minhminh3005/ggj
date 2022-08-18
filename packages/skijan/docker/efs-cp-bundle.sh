export GOGO_EFS=${CB}/surface.gogojungle.co.jp
export GOGO_WD=${EFS}/gui-skijan
rm -rf ${GOGO_WD}
mkdir -m 777 -p ${GOGO_WD}/packages/skijan

${GOGO_EFS}/packages/skijan/docker/cp-bundle.sh
