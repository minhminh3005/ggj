FROM gogojungle/node:14.18.0 as builder

## current path as root
# Create app directory
WORKDIR ${GOGO_WD}

# install skijan dependencies
COPY packages/skijan/package.json packages/skijan/yarn.lock ./packages/skijan/
RUN yarn --prod --cwd packages/skijan

# bundle app for running
FROM gogojungle/node:14.18.0
WORKDIR ${GOGO_WD}

COPY --from=builder ${GOGO_WD}/packages/skijan/node_modules ./packages/skijan/node_modules

EXPOSE 8921

COPY packages/skijan/docker/start.sh /start.sh
COPY packages/skijan/docker/cp-bundle.sh ${GOGO_WD}/cp-bundle.sh
RUN chmod +x /start.sh
RUN chmod +x ${GOGO_WD}/cp-bundle.sh

CMD [ "/start.sh" ]
