FROM gogojungle/node:14.18.0 as builder

## current path as root
# Create app directory
WORKDIR ${GOGO_WD}

# install accounts dependencies
COPY packages/accounts/package.json packages/accounts/yarn.lock ./packages/accounts/
RUN yarn --prod --cwd packages/accounts

# bundle app for running
FROM gogojungle/node:14.18.0
WORKDIR ${GOGO_WD}

COPY --from=builder ${GOGO_WD}/packages/accounts/node_modules ./packages/accounts/node_modules

EXPOSE 8914

COPY packages/accounts/docker/start.sh /start.sh
COPY packages/accounts/docker/cp-bundle.sh ${GOGO_WD}/cp-bundle.sh
RUN chmod +x /start.sh
RUN chmod +x ${GOGO_WD}/cp-bundle.sh

CMD [ "/start.sh" ]
