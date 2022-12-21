# Shamirexpression - Compose

### Prerequisites

1. Docker
2. Docker Compose
3. Valid SSL certificate
4. Docker images of frontend, backend and strapi (Last verison already exists on developers registry)

### Launch

#### SSL

If our certificates are outdates, create new and rename them to `star.shamirexpression.com.pem` and `private.key`, them place them into `./nginx/ssl`

#### Admin (Strapi)

Before running you need to unarchive provided strapi backub (`strapi-backup.tar.gz`) and place it home directory (`~/`).

#### Docker compose

1. Build images of the frontend, backend and strapi in their repos
2. Insert names of the images to corresponding services in `docker-compose.yml`
3. run command `docker-compose up -d`
4. Done

