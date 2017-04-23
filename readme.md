# Code & Craft Web App
Features the tools & timers used for Code & Craft events. Made with D3.


## Live Site
http://codeandcraft.org 


## Local Development


### Project Setup

- Install editorconfig plugin in your text editor.

``` shell
$ npm install
$ npm install -g webpack
```

- We use a forked GifLoopCoder, included as a git subtree at /public/vendor/glc
- Assets in /public are built with webpack and output to /dist


### Run

``` shell
$ webpack --progress --watch
$ npm start
```
View the site at http://localhost:3000.


## Author
Amit Kumar
http://www.amitkumar.com

## Image Inspirations
- https://gitlab.com/amitthekumar/code-n-craft/tree/master/public/img/kawandeep-virdee
- https://www.google.com/search?q=sol+lewitt

## References
- https://www.browsersync.io/docs/recipes
- https://bl.ocks.org/mbostock/1346410
- https://bl.ocks.org/mbostock/4341417
- http://webpack.github.io/docs/tutorials/getting-started/
- https://github.com/harytkon/d3-es6-webpack-boilerplate/blob/master/package.json
- http://webpack.github.io/docs/tutorials/getting-started/



## Hosting
- Hosted on DigitalOcean. Contact Amit Kumar for access.
- Set up with these instructions: https://www.digitalocean.com/community/tutorials/how-to-set-up-a-node-js-application-for-production-on-ubuntu-16-04
- Using Nginx, PM2, Let's Encrypt, node.js
- Project directory is at ~/code
- `$ ssh root@45.55.157.3`