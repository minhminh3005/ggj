export GOGO_EFS=${CB}/surface.gogojungle.co.jp
export GOGO_WD=${EFS}/gui-myaccount
rm -rf ${GOGO_WD}
mkdir -m 777 -p ${GOGO_WD}/packages/myaccount

${GOGO_EFS}/packages/myaccount/docker/cp-bundle.sh
