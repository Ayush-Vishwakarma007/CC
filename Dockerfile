FROM  node:12-alpine
EXPOSE 4001
RUN adduser cc_user  --disabled-password
RUN mkdir -p /var/www/
ADD . /var/www/
WORKDIR /var/www/
RUN npm install
USER cc_user
CMD ["node", "middelwere.js"]