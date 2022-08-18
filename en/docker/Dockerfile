FROM gogojungle/node:10.16.0 as builder

## current path as root
# Create app directory
WORKDIR ${GOGO_WD}

# install root dependencies
COPY package.json yarn.lock ./
RUN yarn --ignore-engines --prod

# install en dependencies
COPY en/package.json en/yarn.lock ./en/
RUN yarn --prod --cwd en

# bundle app for running
FROM gogojungle/node:10.16.0
WORKDIR ${GOGO_WD}

COPY --from=builder ${GOGO_WD}/node_modules ./node_modules
COPY --from=builder ${GOGO_WD}/en/node_modules ./en/node_modules

EXPOSE 7079

COPY en/docker/start.sh /start.sh
COPY en/docker/cp-bundle.sh ${GOGO_WD}/cp-bundle.sh
RUN chmod +x /start.sh
RUN chmod +x ${GOGO_WD}/cp-bundle.sh

CMD [ "/start.sh" ]
