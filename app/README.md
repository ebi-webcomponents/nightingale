## Showcase App

This directory contains the source of the showcase App for the web components of the nightingale project.

You can visit the live version of the app on https://ebi-webcomponents.github.io/nightingale/#/

### Deployment

The showcase App is running on github pages. and we have setup a worktree associated with the folder `app/dist`,
following the strategy documented here: http://sangsoonam.github.io/2019/02/08/using-git-worktree-to-deploy-github-pages.html

If you want to deploy it this way the easiest way is to create the empty dir `app/dist` and add it as a worktree of the `gh-pages` branch.

```console
✔ nightingale [master|✔] $ mkdir app/dist
✔ nightingale [master|✔] $ git worktree add app/dist/ gh-pages
Preparing worktree (checking out 'gh-pages')
HEAD is now at 4cbcbc6 version2.0.3
Can't find Husky, skipping post-checkout hook
You can reinstall it using 'npm install husky --save-dev' or delete this hook
✔ nightingale [master|✔] $ cd app/dist/
✔ nightingale/app/dist [gh-pages|✔] $ ls
0.js        10.js       12.js       14.js       16.js       18.js       2.js        4.js        6.js        8.js        index.html
1.js        11.js       13.js       15.js       17.js       19.js       3.js        5.js        7.js        9.js        main.js

```

With this configuration, you can build the the app. The files that will be created in the `app/dist` folder.
And if you go to that folder you will be in the `gh-pages` branch where you can commit and push the changes. For example:

```console
✔ nightingale [master|✔] $ yarn build-site
yarn run v1.10.1
$ lerna run build-site --stream
lerna notice cli v3.4.3

...


✔ lerna success - nightingale-showcase-app
✨  Done in 44.11s.
✔ nightingale [master|✔] $ cd app/dist/
✔ nightingale/app/dist [gh-pages|✚ 20] $  git commit -m "new app version X.X.X"
20 files changed, 314 insertions(+), 192 deletions(-)

...

✔ nightingale/app/dist [gh-pages ↑·1|✔]
16:36 $ git push
Enumerating objects: 43, done.

...

 gh-pages -> gh-pages
✔ nightingale/app/dist [gh-pages|✔] $

```

And after this the github pages will be updated to this version.
