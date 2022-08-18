FROM gogojungle/node:10.16.0 as builder

## currtht path as root
# Create app directory
WORKDIR ${GOGO_WD}

# install root depthdthcies
COPY package.json yarn.lock ./
RUN yarn --ignore-engines --prod

# install th depthdthcies
COPY th/package.json th/yarn.lock ./th/
RUN yarn --prod --cwd th

# bundle app for running
FROM gogojungle/node:10.16.0
WORKDIR ${GOGO_WD}

COPY --from=builder ${GOGO_WD}/node_modules ./node_modules
COPY --from=builder ${GOGO_WD}/th/node_modules ./th/node_modules

EXPOSE 7078

COPY th/docker/start.sh /start.sh
COPY th/docker/cp-bundle.sh ${GOGO_WD}/cp-bundle.sh
RUN chmod +x /start.sh
RUN chmod +x ${GOGO_WD}/cp-bundle.sh

CMD [ "/start.sh" ]
