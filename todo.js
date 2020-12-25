// Creation and Operation on a todo list

const fs = require("fs");
let arg = process.argv.slice(2);
let date = new Date();
date = date.toISOString().slice(0, 10);
const todoPath = './todo.txt';
const donePath = './done.txt';


// todo help
function help(){
    const help = `Usage :-
$ ./todo add "todo item"  # Add a new todo
$ ./todo ls               # Show remaining todos
$ ./todo del NUMBER       # Delete a todo
$ ./todo done NUMBER      # Complete a todo
$ ./todo help             # Show usage
$ ./todo report           # Statistics`;
process.stdout.write(help);
}

// todo add
function add(arg){
    if(fs.existsSync(todoPath)){
        fs.readFile(todoPath,'utf8',function read(err, data) {
            if (err){
                throw err
            }
            const text = data;
            let lines = text.split('\r\n');
            lines = lines.filter(item => item);
            let textLen = lines.length; 
            let n = text.includes(arg);
            if(textLen == 0){
                fs.writeFile(todoPath,  arg + "\r\n" ,() => {});
            }
            
           else if(!n){
                fs.writeFile(todoPath,  arg + "\r\n" + text ,() => {});
            }    
            }
        );}
    else{
        fs.writeFile(todoPath, arg + "\r\n", () => {});
    }
    process.stdout.write(`Added todo: "${arg}"`);
}

// todo list
function ls(){
    if(fs.existsSync(todoPath)){
    fs.readFile(todoPath,'utf8',function read(err, data) {
        if (err){
            throw err
        }
        const text = data;
        let lines = text.split('\r\n');
        lines = lines.filter(item => item);
        let textLen = lines.length;
        if(textLen > 0){
                for (let i = 0; i<textLen; i++) {
                    console.log(`[${textLen - i}] `,lines[i]);
                }
        }
        else{
            process.stdout.write("There are no pending todos!");
        }
    });
    }    
    else{
        process.stdout.write("There are no pending todos!");
        }
      

}

// todo delete
function del(num){
    
    if(fs.existsSync(todoPath)){
        fs.readFile(todoPath,'utf8',function read(err, data) {
            if (err){
                throw err
            }
            const text = data;
           
            let lines = text.split('\r\n');
           
            lines = lines.filter(item => item);
           
            let textLen = lines.length;
           
            if(textLen < num || lines[num - 1] == "" || num <= 0){
                process.stdout.write(`Error: todo #${num} does not exist. Nothing deleted.`);
                }
            else{
                   
                    let nLines = new Array();
                    for(let i = 0;i<textLen; i++){
                        if(num-1 == i){continue}
                        else{nLines.push(lines[i])
                           }
                    }
                    fs.openSync(todoPath,'w');
                    for (let line of nLines) {
                        fs.appendFile(todoPath, line + "\r\n",() => {})
                    }
                    
                    process.stdout.write(`Deleted todo #${num}`);
                }
        });        
    }
    else{ 
        process.stdout.write(`Error: todo #${num} does not exist. Nothing deleted.`);
    }       
}

//todo done 
function done(num){
    if(fs.existsSync(todoPath)){
        fs.readFile(todoPath,'utf8',function read(err, data) {
            if (err){
                throw err
            }
            const text = data;
            let lines = text.split('\r\n');
            lines = lines.filter(item => item);
            let textLen = lines.length;
            if(textLen < num || lines[num - 1] == "" || num <= 0){
                process.stdout.write(`Error: todo #${num} does not exist.`);
            }
            else{
                lines = lines.filter(item => item);
                let nLines = new Array();
                let completed;
                    for(let i = 0;i<textLen; i++){
                        if(num-1 == i){
                            completed = lines[i];
                            continue
                        }
                        else{nLines.push(lines[i])}
                    }
                fs.openSync(todoPath,'w');
                for(let line of nLines){
                    
                fs.appendFile(todoPath, line +"\r\n" ,() => {});
                }
                if(fs.existsSync(donePath)){
                    fs.readFile(donePath,'utf8',function read(err, data) {
                        if (err){
                            throw err
                        }
                        let dText = data;
                        let dLines = dText.split('\r\n');
                        dLines = dLines.filter(item => item);
                        if (dLines.length > 0) {
                            let n = dLines.includes(completed);
                            if(!n){
                                fs.openSync(donePath, 'w');
                                fs.appendFile(donePath, completed + "\r\n" + dText, () => {})
                        }
                    }
                   
                    process.stdout.write(`Marked todo #${num} as done.`);
                });
            }
            else{
                fs.writeFile(donePath,completed,()=>{});
        }
        }       
    });
}
}
// todo report

function report(){
    let completed;
    let pending;
    fs.readFile(donePath, 'utf8' ,(err,data)=>{
        if(err){throw err};
        const report = data;
        status = report.split('\n');
        status = status.filter(item =>item);
        completed = [...status].length;
        fs.readFile(todoPath, 'utf8', (err,data) =>{
            if(err) {throw err};
            let value = data;
            value= value.split('\r\n');
            value= value.filter(item =>item);
            pending = [...value].length;
            process.stdout.write(`${date} Pending : ${pending} Completed : ${completed}`);
        });
    });
    
    
    
}

// Cases 
switch (arg[0]) {
    case 'help':
            help()
            break;
    case 'add' :
        if (arg.length > 1){
            add(arg[1]);
        }
        else{
            process.stdout.write("Error: Missing todo string. Nothing added!")
        }
        break;
    case 'ls':
        ls();
        break;
    case 'del':
        arg = arg.map(Number);
        if(arg.length >= 2){
            arg.shift();
            del(arg);
        }
        else{
            process.stdout.write("Error: Missing NUMBER for deleting todo.");
        }
        break;
    case 'done':
        arg = arg.map(Number);
        if (arg.length > 1){
            done(arg[1]);
        }
        else{
            process.stdout.write( "Error: Missing NUMBER for marking todo as done.");
        }
        break;
    case 'report':
        report();
        break;


    default:
        break;
}
if((arg.length == 0)){
    help();
}
