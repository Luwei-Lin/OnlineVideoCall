#!/bin/bash
# this assumes that dot.emacs and tabbar.el are present in your home directory (~)

cd

if [[ ! -e dot.emacs ]]
then
  echo "*** dot.emacs missing"
  exit 1
fi

if [[ ! -e tabbar.el ]]
then
  echo "*** tabbar.el missing"
  exit 1
fi

touch .emacs
cp .emacs dot.emacs-old-`date "+%Y-%m-%d-%H:%M.%S"`
mkdir -p .emacs.d .emacs.d/lisp
cp -r .emacs.d  dot.emacs.d-old-`date "+%Y-%m-%d-%H:%M.%S"`
mv dot.emacs .emacs
mv tabbar.el .emacs.d/lisp
