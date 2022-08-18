cd ${GOGO_EFS}/packages/accounts

rsync -azR modules \
lang \
public \
proxy \
middlewares \
common/constant.js \
.awsConfVer.yaml \
i18n.config.js \
index.js \
next-i18next.config.js \
next.config.js \
package.json \
.next \
${GOGO_WD}/packages/accounts
