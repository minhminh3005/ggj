cd ${GOGO_EFS}/packages/myaccount

rsync -azR modules \
lang \
proxy \
public \
.awsConfVer.yaml \
i18n.config.js \
index.js \
next-i18next.config.js \
next.config.js \
package.json \
.next \
${GOGO_WD}/packages/myaccount
