var fs = require('fs');
var stdout = process.stdout;
var stdin = process.stdin;

fs.readdir(process.cwd(), function(err, files){
	//process.cwd()返回当前目录
	console.log(''); //为了输出更加友好，先输出一个空格
	if(!files.length){
		console.log('\033[31m No files to show!\033[39m\n');//\033[31m和\033[39m是为了让文本呈现红色
	}
	console.log('Select which file or directory you want to see\n');

	var stats = [];
	function file(i){
		var filename = files[i];
		fs.stat(__dirname + '/' + filename, function(err, stat){ //fs.state返回文件或目录的元数据

			stats[i] = stat; //将stat对象保存下来
			//如果路径代表的是目录，则用不同的颜色标示
			if(stat.isDirectory()){
				console.log('	'+i+' \033[36m'+filename+'/\033[39m');
			}else{
				console.log('	'+i+'\033[90m'+filename+'\033[39m');
			}

			i++;
			if(i == files.length){
				console.log('');
				read();
			}else{
				file(i);
			}
		})
	}
	function read(){
		stdout.write('	\033[33mEnter your choice: \033[39m'); //使用process.stdout.write而不是console.log，不会输入换行符
		stdin.resume();//等待用户输入
		stdin.setEncoding('utf8');//设置输入流编码为utf8，这样就支持特殊字符了	
		stdin.on('data', option);	
	}
	function option(data){
		var filename = files[Number(data)];

		if(!filename){
			console.log('	\033[31mEnter your choice: \033[39m');
		}else{
			stdin.pause();//检查通过，再次将流暂停，便于程序顺利退出

			if(stats[Number(data)].isDirectory()){
				fs.readdir(__dirname+'/'+filename, function(err, files){
					console.log('');
					files.forEach(function(file){
						console.log('	-	'+file);
					})
					console.log('');
				})
			}else{
				fs.readFile(__dirname+'/'+filename, 'utf8', function(err, data){ //事先制定编码，得到的数据就是相应的字符串了
					console.log('');
					console.log('\033[90m' + data.replace(/(.*)/g, '	$1')+'\033[39m'); //添加辅助缩进
				})				
			}

		}
	}
	file(0);
})