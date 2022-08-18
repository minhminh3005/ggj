FROM gogojungle/node:10.16.0 as builder

## current path as root
# Create app directory
WORKDIR ${GOGO_WD}

# install root dependencies
COPY package.json yarn.lock ./
RUN yarn --ignore-engines --prod

# install vi dependencies
COPY vi/package.json vi/yarn.lock ./vi/
RUN yarn --prod --cwd vi

# bundle app for running
FROM gogojungle/node:10.16.0
WORKDIR ${GOGO_WD}

COPY --from=builder ${GOGO_WD}/node_modules ./node_modules
COPY --from=builder ${GOGO_WD}/vi/node_modules ./vi/node_modules

EXPOSE 7077

COPY vi/docker/start.sh /start.sh
COPY vi/docker/cp-bundle.sh ${GOGO_WD}/cp-bundle.sh
RUN chmod +x /start.sh
RUN chmod +x ${GOGO_WD}/cp-bundle.sh

CMD [ "/start.sh" ]
