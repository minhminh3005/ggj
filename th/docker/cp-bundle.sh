cd ${GOGO_EFS}
rsync -azR common components utils bin \
${GOGO_WD}

cd ${GOGO_EFS}/th
rsync -azR app \
assets \
components \
js \
layouts \
middleware \
pages \
plugins \
static \
store \
utils \
nuxt.config.js \
package.json \
index.js \
.nuxt \
.awsConfVer.yaml \
${GOGO_WD}/th
