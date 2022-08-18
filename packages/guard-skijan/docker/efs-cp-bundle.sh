export GOGO_EFS=${CB}/surface.gogojungle.co.jp/packages/guard-skijan
export GOGO_WD=${EFS}/guard-skijan
rm -rf ${GOGO_WD}
mkdir -m 777 ${GOGO_WD}
${GOGO_EFS}/docker/cp-bundle.sh
