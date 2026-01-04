#!/bin/bash
shopt -s extglob

exec zip -r .my-extension.zip ./[!.]*@(.js|.html|.json|/)
