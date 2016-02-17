// fis.match('::packager', {
//   spriter: fis.plugin('csssprites')
// });

// fis.match('*', {
//   useHash: false
// });
fis.set('project.ignore', ['output/**', '.git/**', 'fis-conf.js']);

// 后续修改时可以忽略的上传的文件
fis.set('project.ignore', ['output/**', '.git/**', 'fis-conf.js','node_modules/**','public/H-ui.admin/**','public/images/**','public/ueditor/**','public/Lib/**','public/example/**','logs/logs/**']);
fis.match('public/javascripts/{*,**/*}.js', {
   optimizer: fis.plugin('uglify-js'),
   useHash: true
});
fis.match('{logs,modules}/{*,**/*}.js', {
   optimizer: fis.plugin('uglify-js')
});

fis.match('public/stylesheets/{*,**/*}.css', {
  useSprite: true,
  optimizer: fis.plugin('clean-css'),
  useHash: true
});

fis.media('online').match('*', {
  deploy: fis.plugin('http-push', {
    receiver: 'http://101.200.232.228:8999/receiver',
    to: '/home/nodejs/note' // 这个是指的是远程机器的路径，而非本地机器
  })
});
fis.media('inline').match('*', {
  deploy: fis.plugin('http-push', {
    receiver: 'http://192.168.137.10:8999/receiver',
    to: '/home/xuming/fis/www' // 注意这个是指的是测试机器的路径，而非本地机器
  })
});
fis.media('local').match('*', {
    deploy: fis.plugin('local-deliver', {
        to: 'D:\/www\/web\/output'
    })
})
// fis.match('*.{js,css}', {
//   useHash: true
// });
// fis.match('*.png', {
//   optimizer: fis.plugin('png-compressor')
// });