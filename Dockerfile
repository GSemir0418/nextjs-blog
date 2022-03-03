# 下载一个含有node12的操作系统linux
FROM node:12
# 创建工作路径
WORKDIR /usr/src/app
# 将本地的package.json和yarn.lock复制到工作目录
COPY package.json ./
COPY yarn.lock ./
RUN yarn install
# 将本地根目录下的全部文件都拷贝至工作目录
COPY . .
# 暴露3000端口
EXPOSE 3000
# 运行命令
CMD [ "yarn", "start"]