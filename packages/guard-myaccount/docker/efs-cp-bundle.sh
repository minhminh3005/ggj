export GOGO_EFS=${CB}/surface.gogojungle.co.jp/packages/guard-myaccount
export GOGO_WD=${EFS}/guard-myaccount
rm -rf ${GOGO_WD}
mkdir -m 777 ${GOGO_WD}
${GOGO_EFS}/docker/cp-bundle.sh
