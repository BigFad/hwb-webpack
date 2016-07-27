var path=require('path');
var webpack =require('webpack');
var HtmlWebpackPlugin=require('html-webpack-plugin');
var ROOT_PATH=path.resolve(__dirname);
var APP_PATH=path.resolve(ROOT_PATH,'app');
var BUILD_PATH=path.resolve(ROOT_PATH,'build');
var TEM_PATH = path.resolve(ROOT_PATH, 'templates');

   module.exports={
   entry: {
      app: path.resolve(APP_PATH, 'index.js'),
      mobile:path.resolve(APP_PATH,'mobile.js'),
      //添加要打包在vendors里面的库
      vendors: ['jquery', 'moment']
    },
   	output:{
   		path:BUILD_PATH,
   		 //注意 我们修改了bundle.js 用一个数组[name]来代替，他会根据entry的入口文件名称生成多个js文件，这里就是(app.js,mobile.js和vendors.js)
   		filename:'[name].js'
   	},
   	plugins:[
  			//压缩打包的文件
  			   new webpack.optimize.UglifyJsPlugin({
  			     compress: {
  			       //supresses warnings, usually from module minification
  			       warnings: false
  			     }
  			   }),
  			 //把入口文件里面的数组打包成verdors.js
  			 new webpack.optimize.CommonsChunkPlugin('vendors', 'vendors.js'),
  			 /*所以新建一个专门放模版的文件夹templates,在里面加两个模版文件index.html 和 mobile.html*/
  			 new HtmlWebpackPlugin({
  			   title: 'Hello World app',
  			   template:path.resolve(TEM_PATH,'index.html'),
  			   filename:'index.html',
  			   //chunks这个参数告诉插件要引用entry里面的哪几个入口
  			   chunks:['app','vendors'],
  			   //要把script插入标签里
  			   inject:'body'
  			 }),
  			 new HtmlWebpackPlugin({
  			 	title:'hello Mobile app',
  			 	template:path.resolve(TEM_PATH,'mobile.html'),
  			 	filename:'mobile.html',
  			 	chunks:['mobile','vendors'],
  			 	inject:'body'
  			 })
   	],
   	devServer:{
   		historyApiFallback:true,
   		hot:true,
   		inline:true,
   		progress:true
   	},
   	module:{
   		loaders:[
   			{
   				test:/\.scss$/,
   				loaders:['style','css','sass'],
   				/*注意loaders的处理顺序是从右到左的，这里就是先运行css-loader然后是style-loade*/
   				include:APP_PATH
   			},
   			{
       			 test: /\.(png|jpg)$/,
        		loader: 'url?limit=40000'
      		},
      		{
      			test:/\.jsx?$/,
      			loader:'babel',
      			include:APP_PATH,
      			query:{
      				presets:['es2015']
      			}
      		}
   		]
   	}
}