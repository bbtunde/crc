FROM node:alpine
  
MAINTAINER Nuno Lima <nuno.lima@jumia.com>

# Create applicatin folder and adjust persmissions
RUN mkdir -p /var/www/paga
COPY --chown=nobody:nobody . /var/www/paga

WORKDIR /var/www/paga

EXPOSE 8080

CMD [ "/usr/local/bin/npm", \
    "--prefix", \
    "/var/www/paga", \
    "start" ]
