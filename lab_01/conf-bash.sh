#!/bin/bash
# this assumes that dot.bashrc are present in your home directory (~)

cd

if [[ ! -e dot.bashrc ]]
then
  echo "*** dot.bashrc missing"
  exit 1
fi

touch .bashrc
cp .bashrc dot.bashrc-old-`date "+%Y-%m-%d-%H:%M.%S"`

mv dot.bashrc .bashrc
