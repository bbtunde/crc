FROM node:alpine

LABEL maintainer="Jumia SRE MDS <sre.mds@jumia.com>"

ENV LINUX alpine
ENV APP paga

RUN apk add --no-cache --force-refresh \
            curl \
            net-tools \
            lsof \
            vim \
            curl \
            wget \
            tcpdump

# Create applicatin folder and adjust persmissions
RUN mkdir -p /var/www/paga && chown -Rf nobody:nobody /var/www/paga
COPY --chown=nobody:nobody . /var/www/paga

# Create link for custom configuration from Kubernetes ConfigMaps
RUN ln -sf /etc/config/config.json /var/www/paga/config/config.json

WORKDIR /var/www/paga
EXPOSE 8080

CMD [ "/usr/local/bin/npm", \
    "--prefix", \
    "/var/www/paga", \
    "start" ]
