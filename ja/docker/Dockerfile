FROM gogojungle/node:10.16.0 as builder

## current path as root
# Create app directory
WORKDIR ${GOGO_WD}

# install root dependencies
COPY package.json yarn.lock ./
RUN yarn --ignore-engines --prod

# install ja dependencies
COPY ja/package.json ja/yarn.lock ./ja/
RUN yarn --prod --cwd ja

# bundle app for running
FROM gogojungle/node:10.16.0
WORKDIR ${GOGO_WD}

COPY --from=builder ${GOGO_WD}/node_modules ./node_modules
COPY --from=builder ${GOGO_WD}/ja/node_modules ./ja/node_modules

EXPOSE 7997

COPY ja/docker/start.sh /start.sh
COPY ja/docker/cp-bundle.sh ${GOGO_WD}/cp-bundle.sh
RUN chmod +x /start.sh
RUN chmod +x ${GOGO_WD}/cp-bundle.sh

CMD [ "/start.sh" ]
