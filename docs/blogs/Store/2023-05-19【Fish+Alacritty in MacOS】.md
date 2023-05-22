---
title: Fish+Alacritty in MacOS
date: 2023-05-19
tags: 
  - Shell
categories: 
  - Shell
---

看了飞猪在掘金上发的文[改良了下传说中最快的终端](2022-12-05%E3%80%90demo%E3%80%91.md)，想着尝试一下。在使用的过程中发现一些步骤在文章中没有写明，所以我补充记录一下。

<!-- more -->

## fish设为默认

文章中可以跳转到[fishshell官方文档](https://fishshell.com/docs/current/index.html#default-shell)中查看，官方提到的步骤是：

```shell
# 在 /etc/shells 文件中添加一行内容：/usr/local/bin/fish 
echo /usr/local/bin/fish | sudo tee -a /etc/shells
# 配置默认shell 
chsh -s /usr/local/bin/fish
```

### 终端中

因为我使用的是brew安装的fish，所以文件路径会不一样，这里的命令会有一点改动：

```shell
# 先查看fish安装的位置
whereis fish
# 这是返回值
# fish: /opt/homebrew/bin/fish /opt/homebrew/share/man/man1/fish.1
# 所以替换路径执行下面这两句
echo /opt/homebrew/bin/fish | sudo tee -a /etc/shells
chsh -s /opt/homebrew/bin/fish
```

要注意的是，`chsh -s` 命令是用来配置MacOS中的终端默认打开的工具

```shell
# 这是MacOS默认的工具，恢复默认用这个
chsh -s /bin/zsh
```

### Alacritty中

如果想在使用 Alacritty 时默认打开 fish，则需要编辑 `alacritty.yml` 配置文件

步骤：打开文章中提到的 `alacritty.yml` 文件，路径 `~/.config/alacritty/alacritty.yml`

```yml
# 配置默认shell
shell:
  program: /opt/homebrew/bin/fish
```

保存后重新打开 Alacritty 即可

### VScode中

同理，如果想在 VScode 中设置默认 那就在设置中查找 `shellArgs.osx` 并选择 `fish`
