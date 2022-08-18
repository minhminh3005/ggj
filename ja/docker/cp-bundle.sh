cd ${GOGO_EFS}
rsync -azR common components utils bin ja/desktop ja/mobile ja/modules \
ja/.nuxt ja/index.js ja/package.json ja/nuxt.config.js \
ja/.awsConfVer.yaml \
${GOGO_WD}
