//①首先我们需要创建一张画布作为游戏的舞台。
var canvas=document.createElement("canvas");
var ctx=canvas.getContext("2d");
canvas.width=512;
canvas.height=480;
document.body.appendChild(canvas);
//注：首先我们需要创建一张画布作为游戏的舞台。这里通过JS代码而不是直接在HTML里写一个<canvas>元素目的是要说明代码创建也是很方便的。有了画布后就可以获得它的上下文来进行绘图了。然后我们还设置了画布大小，最后将其添加到页面上。

//②向画布中准备需要用到的图片
var bgReady=false;
var bgImage=new Image();
bgImage.onload=function(){
  bgReady=true;  
};
bgImage.src="../JS_Retro_Snaker/Images/BackGroud.png";
//准备英雄图片
var heroReady=false;
var heroImage=new Image();
heroImage.onload=function(){
  heroReady=true;  
};
heroImage.src="../JS_Retro_Snaker/Images/hero.png";
//准备怪物图片
var monsterReady=false;
var monsterImage=new Image();
monsterImage.onload=function(){
  monsterReady=true;  
};
monsterImage.src="../JS_Retro_Snaker/Images/monster.png";

//游戏对象
var hero={
    speed:256  //每秒像素运动
};
var monster={};
var monstersCaught=0;
//注：speed属性用来控制他每秒移动多少像素。怪物游戏过程中不会移动，所以只有坐标属性就够了。monstersCaught则用来存储怪物被捉住的次数。

//处理键盘控制（处理用户的输入）
var keysDown={};
addEventListener("keydown",function(e){
    keysDown[e.keyCode]=true;
},false);
addEventListener("keyup",function(e){
    delete keysDown[e.keyCode];
},false);
//注：在前端开发中，一般是用户触发了点击事件然后才去执行动画或发起异步请求之类的，但这里我们希望游戏的逻辑能够更加紧凑同时又要及时响应输入。所以我们就把用户的输入先保存下来而不是立即响应。
//为此，我们用keysDown这个对象来保存用户按下的键值(keyCode)，如果按下的键值在这个对象里，那么我们就做相应处理

//当用户抓住一只怪物后开始新一轮游戏
var reset=function(){
    hero.x=canvas.width/2;
    hero.y=canvas.height/2;
    //把怪物随机地扔在屏幕上
   monster.x = 32 + (Math.random() * (canvas.width - 64));
    monster.y = 32 + (Math.random() * (canvas.height - 64));
}
//注：reset方法用于开始新一轮和游戏，在这个方法里我们将英雄放回画布中心同时将怪物放到一个随机的地方。
//更新游戏对象的属性
var update=function(modifier){
    if(38 in keysDown){ //用户按的是↑
        hero.y-=hero.speed*modifier;
    }
    if(40 in keysDown){//用户按的是↓
        hero.y+=hero.speed*modifier;
    }
    if(37 in keysDown){//用户按的是←
        hero.x-=hero.speed*modifier;
    }
    if(39 in keysDown){//用户按的是→
        hero.x+=hero.speed*modifier;
    }
    //英雄与怪物碰到了吗？
    if(hero.x<=(monster.x+32)
       && monster.x<=(hero.x+32)
       && hero.y<=(monster.y+32)
       && monster.y<=(hero.y+32)
      ){
        ++monstersCaught;
        reset();
    }
};
//注：modifier变量，它是基于1开始且随时间变化的一个因子。例如1秒过去了，它的值就是1，英雄的速度将会乘以1，也就是每秒移动256像素；如果半秒钟则它的值为0.5，英雄的速度就乘以0.5也就是说这半秒内英雄以正常速度一半的速度移动。理论上说因为这个update 方法被调用的非常快且频繁，所以modifier的值会很小，但有了这一因子后，不管我们的代码跑得快慢，都能够保证英雄的移动速度是恒定的。
//现在英雄的移动已经是基于用户的输入了，接下来该检查移动过程中所触发的事件了，也就是英雄与怪物相遇。这就是本游戏的胜利点，monstersCaught +1然后重新开始新一轮。

//画出所有物体（背景图，英雄、怪物）
var render=function(){
    if(bgReady){
        ctx.drawImage(bgImage,0,0);
    }
    if(heroReady){
        ctx.drawImage(heroImage,hero.x,hero.y);
    }
    if(monsterReady){
        ctx.drawImage(monsterImage,monster.x,monster.y);
    }
    //计分
    ctx.fillStyle="rgb(250,250,250)";
    ctx.font="24px Helvetica";
    ctx.textAlign="left";
    ctx.textBaseline="top";
    ctx.fillText("Goblins caught:"+monstersCaught,32,32);  
};
//注：之前的工作都是枯燥的，直到你把所有东西画出来之后。首先当然是把背景图画出来。然后如法炮制将英雄和怪物也画出来。这个过程中的顺序是有讲究的，因为后画的物体会覆盖之前的物体。
//这之后我们改变了一下Canvas的绘图上下文的样式并调用fillText来绘制文字，也就是记分板那一部分。本游戏没有其他复杂的动画效果和打斗场面，绘制部分大功告成！

//主游戏循环
var main=function(){
    var now=Date.now();
    var delta=now-then;
    update(delta/1000);
    render();
    then=now;
    // 立即调用主函数
    requestAnimationFrame(main);
};
//注：上面的主函数控制了整个游戏的流程。先是拿到当前的时间用来计算时间差（距离上次主函数被调用时过了多少毫秒）。得到modifier后除以1000(也就是1秒中的毫秒数)再传入update函数。最后调用render 函数并且将本次的时间保存下来。

//requestAnimationFrame 的浏览器兼容性处理
var w=window;
requestAnimationFrame=w.requestAnimationFrame||w.webkitRequestAnimationFrame|| w.msRequestAnimationFrame || w.mozRequestAnimationFrame;
//开始游戏
var then=Date.now();
reset();
main();