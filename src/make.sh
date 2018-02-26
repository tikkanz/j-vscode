#!/bin/bash

cd `dirname "$(realpath $0)"`

T=../extension.js
> $T

F="main util cmds entry"

for f in $F; do
  cat $f.js >> $T
done

sed -i "/\/\//d" $T
