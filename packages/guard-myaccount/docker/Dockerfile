FROM gogojungle/node:14.18.0 AS builder

WORKDIR /usr/src/app

COPY packages/guard-myaccount/package.json packages/guard-myaccount/yarn.lock ./
RUN yarn --prod

FROM gogojungle/node:14.18.0

WORKDIR /usr/src/app

COPY --from=builder /usr/src/app/node_modules ./node_modules
COPY --from=builder /usr/src/app/package.json ./package.json

EXPOSE 8919

COPY packages/guard-myaccount/docker/start.sh /start.sh
COPY packages/guard-myaccount/docker/cp-bundle.sh ${GOGO_WD}/cp-bundle.sh

RUN chmod +x /start.sh
RUN chmod +x ${GOGO_WD}/cp-bundle.sh

CMD [ "/start.sh" ]
