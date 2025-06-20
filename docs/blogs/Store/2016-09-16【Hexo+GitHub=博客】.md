---
title: Hexo+GitHub=博客
date: 2016-09-16
tags: 
  - Github Page
  - Hexo
categories: 
  - 碎片
---

如何通过Hexo和GitHub Page服务搭建免费的个人博客。

还有，如何拯救你的博客(／‵口′)／~╧╧

<!-- more -->

## 搭建

### 搭建本地博客（安装Hexo）

1. 新建文件夹作为博客目录（/projectName），在命令行工具中打开；
2. 输入命令`npm install -g hexo`，全局安装hexo脚手架；
3. 输入命令`hexo init`，初始化一个hexo博客；
4. 安装依赖包`npm install`；
5. 发布`hexo g`；
6. 本地服务器（默认 localhost:4000）`hexo s`。

至此，博客已经建立成功（本地）。

### 博客配置

1. 安装主题到 /projectName/themes 中
2. 打开 projextName/_config.yml，找到theme，填写你的主题名称
3. 打开 /projectName/themes/_config.yml 根据对应的主题文档填写配置

### 百度收录

如果你想要在百度上搜索到你的网站，需要打开[百度搜索资源平台](https://ziyuan.baidu.com/dashboard/index)，注册账号后，添加网站并收录。

创建网站后验证操作（文件验证）：

1. 下载百度提供的html文件
2. 粘贴文件到：projectName/source/baidu_***.html
3. 打开 projextName/_config.yml，找到 skip_render ，填写改文件到名称（baidu_***.html）
4. 编译并发布
5. 点击认证，即可证明网站的所有权

## 发布

### 准备

- Git环境
- Node环境
- GitHub账号

环境只需下载安装好，一路next就好，注册的也非常简单，全都是提示。

### Git配置

这一步骤的主要是为了连接线上，方便后面把本地的项目发布在线上。

#### 生成SSH公钥

在Git Bash中运行以下代码：

```shell
ssh-keygen -t rsa -C "747624075@qq.com"
```

复制刚刚生成的id_rsa.pub文件中的内容，并粘贴在[GitHub的SSH key设置](https://github.com/settings/keys)选项中。

> id_rsa.pub的路径： C:\Users\windows_username\\.ssh\id_rsa.pub，windows_username是windows用户名。

#### 校验

Git Bash中运行

```shell
ssh -T git@github.com
```

验证信息如下，即为成功配置SSH。

```shell
Hi xxx! You've successfully authenticated, but GitHub does not provide shell access.
```

> 2017-12-10更新

今天，我遇到了一种新的提示：

```shell
The authenticity of host 'github.com (***.***.***.***)' can't be established.
RSA key fingerprint is SHA256:*******************************************.
Are you sure you want to continue connecting (yes/no)?
```

填写yes之后就可以正确执行并显示如上的信息。

### Github仓库

打开你的GitHub，新建版本库，名称为`GitHubID.github.io`（其中，GitHubID是你自己的id,必须按照这个格式来）。

同理，gitLab使用方法类似。

### 部署配置

1. 打开 projextName/_config.yml
2. 寻找Deployment(Ctrl+F快捷键可以快速查找)，替换此处代码，其中repo后面有两个‘xxx’，第一个是你的GitHubID，第二个是刚才设置的库名

> 如果你留意了创建仓库时的页面，也可以在上面找到repo后面应该填入的路径。

```yml
#Deployment
##Docs: https://hexo.io/docs/deployment.html
deploy:
    type: git
    repo: https://github.com/xxx/xxx.github.io.git
    branch: master
```

由于我把这里搞错过一次，导致一次迁移时，之前的库死活连接不上，只能删库重来···

### 修改与发布

1. 每次修改后都应该重新编译并发布。在博客目录文件夹（D:\hexo）中启动Git Bash，输入命令`hexo g`编译，`hexo d`发布；
2. 这样就可以成功访问你的博客`xxx.github.io`;
3. 现在，我的博客地址为 [http://www.bigtail.com.cn/](http://www.bigtail.com.cn/)，实现方法很简单：申请域名并备案，然后把域名解析到原地址`xxx.github.io`对应的ip上（查看方法，cmd中执行ping命令）。

## 错误记录

### Question_1

#### 问题1

在一次发布的时候，出现了一个报错：

```shell
warning: LF will be replaced by CRLF
```

#### 解决办法

在git bash中运行

```shell
git config --global core.autocrlf false
hexo clean
hexo g
hexo s
```

### Question_2

#### 问题2

自从我的笔记本坏掉后，我的博客就再也没有复活。

但是今天实在是忍不了了，想手动修复一下，但是始终有如下报错信息。

```shell
$ hexo d
INFO  Deploying: git
INFO  Clearing .deploy_git folder...
INFO  Copying files from public folder...
On branch master
nothing to commit, working tree clean
remote: Repository not found.
fatal: repository 'https://github.com/xxx/xxx.github.com.git/' ot found
FATAL Something's wrong. Maybe you can find the solution here: http://hexo.io/dcs/troubleshooting.html
Error: remote: Repository not found.
fatal: repository 'https://github.com/xxx/xxx.github.com.git/' ot found
```

我查了好久，但是死活是没有合理的解决办法。

重建了个库，解决。
