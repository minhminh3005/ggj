cd ${GOGO_EFS}/packages/skijan

rsync -azR modules \
lang \
proxy \
public \
middlewares \
.awsConfVer.yaml \
i18n.config.js \
index.js \
next-i18next.config.js \
next.config.js \
package.json \
.next \
${GOGO_WD}/packages/skijan
