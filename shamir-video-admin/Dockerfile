FROM node:14-alpine

# Set Environment to Production Environment (Optional to include in Dockerfile)

ENV NODE_ENV production

# Set up working directory that will be used to copy files/directories below :

WORKDIR /app

# Copy package.json to root directory inside Docker container of Strapi app

COPY package.json .

# Copy yarn.lock to root directory inside Docker container of Strapi app

COPY yarn.lock .

# Install dependencies, but not generate a yarn.lock lockfile and fail if an update is needed.

# RUN yarn install –frozen-lockfile
RUN yarn install --immutable

# == Copy required files ==

# In order to launch our Strapi app, we must import it into our image.

# We use the keyword ‘COPY’ to do that.

# The first parameter is the name of the file on the host.

# The second parameter is the path where to put the file on the image.

# ‘.’ or ‘/’ means the file will be put in the image root folder.

COPY favicon.ico .

# COPY public/robots.txt public/
COPY public/ public/

# COPY extensions/ extensions/

# COPY exports/ exports/

COPY src/ src/

COPY config/ config/

# Generate a folder called ‘dist’.

# A ‘dist’ folder stands for distributable and refers to a directory where files will be stored that can be directly used by others without the need to compile or minify the source code that is being reused.

RUN yarn build

# Run on port 1337

EXPOSE 1337

# We need to define the command to launch when we are going to run the image.

# We use the keyword ‘CMD’ to do that.

# The following command will execute “yarn start”.

CMD ["yarn", "start"]