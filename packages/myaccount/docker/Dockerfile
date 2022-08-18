FROM gogojungle/node:14.18.0 as builder

## current path as root
# Create app directory
WORKDIR ${GOGO_WD}

# install myaccount dependencies
COPY packages/myaccount/package.json packages/myaccount/yarn.lock ./packages/myaccount/
RUN yarn --prod --cwd packages/myaccount

# bundle app for running
FROM gogojungle/node:14.18.0
WORKDIR ${GOGO_WD}

COPY --from=builder ${GOGO_WD}/packages/myaccount/node_modules ./packages/myaccount/node_modules

EXPOSE 8916

COPY packages/myaccount/docker/start.sh /start.sh
COPY packages/myaccount/docker/cp-bundle.sh ${GOGO_WD}/cp-bundle.sh
RUN chmod +x /start.sh
RUN chmod +x ${GOGO_WD}/cp-bundle.sh

CMD [ "/start.sh" ]
