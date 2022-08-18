FROM gogojungle/node:14.18.0 AS builder

WORKDIR /usr/src/app

COPY packages/guard-skijan/package.json packages/guard-skijan/yarn.lock ./
RUN yarn --prod

FROM gogojungle/node:14.18.0

WORKDIR /usr/src/app

COPY --from=builder /usr/src/app/node_modules ./node_modules
COPY --from=builder /usr/src/app/package.json ./package.json

EXPOSE 8920

COPY packages/guard-skijan/docker/start.sh /start.sh
COPY packages/guard-skijan/docker/cp-bundle.sh ${GOGO_WD}/cp-bundle.sh

RUN chmod +x /start.sh
RUN chmod +x ${GOGO_WD}/cp-bundle.sh

CMD [ "/start.sh" ]
