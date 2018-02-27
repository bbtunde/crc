FROM node:alpine
  
MAINTAINER IT MDS <it.mds@jumia.com>

# Create applicatin folder and adjust persmissions
RUN mkdir -p /var/www/paga
COPY . /var/www/paga
RUN chown -R nobody:nobody /var/www/paga

# Create link for custom configuration from Kubernetes ConfigMaps
RUN ln -sf /etc/config/config.json /var/www/paga/config/config.json

CMD [ "/usr/local/bin/npm", \
    "--prefix", \
    "/var/www/paga", \
    "start" ]
