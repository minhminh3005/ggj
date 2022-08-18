export GOGO_EFS=${CB}/surface.gogojungle.co.jp
export GOGO_WD=${EFS}/gui-accounts
rm -rf ${GOGO_WD}
mkdir -m 777 -p ${GOGO_WD}/packages/accounts

${GOGO_EFS}/packages/accounts/docker/cp-bundle.sh
