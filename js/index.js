$(function(){
  //  document.ontouchstart
   let $main = $(".main"); 
   let $logo = $(".logo");
   let $startBtn = $(".start");
   let $planeBox = $(".plane");
   let $plane = $(".plane>img");
   let $planent = $("#planet");
   let $mainWidth = $main.width();
   let $mainHeight = $main.height();
   let $benergyTop;  // 定义能量桶的top值
   let $bullet = $(".bullet");
   let $size = parseInt($("html").css("fontSize"));      // 定义一个整体页面字体大小变量  
   let bullet;    // 定义一个子弹变量
   let enemy = [];  // 定义一个敌方飞机列表
   let $enemy;     // 定义一个敌方飞机变量
   let result = 0;  // 定义一个分数变量
   let frequency = 0;   // 定义一个按钮被点击的次数
   let $planentLeft = 0;        // 行星运动的左边距
   let timer = null;            // 定义一个控制游戏时间的计时器
   let barTimer = null;         // 创建进度条定时器
   let beiSpeed = 0;           // 定义背景速度
   let beijingTimer = null;   // 创建背景运动的定时器
   let planentTimer = null;   // 创建行星的定时器  
   let benergyTimer = null;  // 创建能量桶的定时器
   let enemyTimer = null;    // 创建敌方飞机的定时器
   
   let energy;      // 定义一个能量桶变量
   let $timeSpan = $("#timer span");

   // 行星数组
   let planetArr = [
     './images/planets/001-global.png',
     './images/planets/002-travel.png',
     './images/planets/003-science-2.png',
     './images/planets/004-science-1.png',
     './images/planets/005-science.png',
     './images/planets/006-mars.png',
     './images/planets/007-planet-earth-1.png',
     './images/planets/008-earth-globe.png',
     './images/planets/009-saturn.png',
     './images/planets/010-uranus.png',
     './images/planets/011-planet-earth.png',
     './images/planets/012-jupiter.png'];    
   // 开始游戏
   $("#start").click(function(){
       __init__();
   });
   // 查看游戏规则
   $("#rulesBtn").click(function () {
        alert("上下左右键操作我方飞机移动,空格进行射击");
   });
   // 定义一个初始化方法
   function __init__(){
     $("#musicbg")[0].play();
     // 实现初始化游戏界面
     init();
     // 实现计数器功能
     Timer();
     // 实现进度条显示
     progressBar();
     // 实现行星的移动
     Planet();
     // 实现能量桶的移动
     createBenergy();
     // 实现移动飞机
     planeMove(); 
     // 实现创建敌机
     enemys();
     // 实现字体可以变大变小的操作
     fontChanges();
     // 实现背景音乐静音操作
     silence();
   };

   // 定义一个方法操作游戏界面
   function init(){
    $logo.hide(1000);
    $startBtn.hide(100);
    $main.css("background-image","url(./images/background-2.jpg)");
    beijingTimer = setInterval(beijngMove,500);
    $("#result").show(1000);
   }
   function beijngMove(){
    beiSpeed -= 10;
    $main.css("background-position",`${beiSpeed}px,${beiSpeed}px`);
   }
   // 定义一个方法来控制我方飞船的飞行
   function planeMove(){    
     $planeBox.show(100);
     $top = $plane.offset().top - $main.offset().top; 
     $left = $plane.offset().left - $main.offset().left;
    //  console.log($mainWidth);
     let $planeWidth = $planeBox.width();
     let $planHeight = $planeBox.height();
     
    //  console.log($planeWidth,$planHeight);
     // 用键盘的上下左右控制飞机运动
     $(window).keydown(function(e){  
       switch(e.keyCode){
         case 38: 
            // 上
            $top -= 10;
            if($top <= 0){
              $top = 0;
            }
            $planeBox.css({
              "top": $top + "px"
            });
            break;
         case 40: 
            // 下
            $top += 10;
            if($top >= ($mainHeight - $planHeight)){
              $top = ($mainHeight - $planHeight);
            }
            $planeBox.css({
              "top": $top + "px"
            });
            break;
         case 37:   
            // 左
            $left -= 10;
            if($left <= 0){
              $left = 0;
            }
            $planeBox.css({
              "left": $left + "px"
            });
            break;
         case 39:            
            // 右
            $left += 10;
            if($left >= ($mainWidth - $planeWidth)){
              $left = ($mainWidth - $planeWidth);
            }
            $planeBox.css({
              "left": $left + "px"
            });
            break;   
         case 32:  
            // 按下了空格键发射子弹
            craeteBullet();
            break;
       }    
     });
   }

   // 定义一个方法来开启计时器
   function Timer(){
    count = 0;   // 默认是0秒 
    timer = setInterval(setTimer,1000);   
   }
   function setTimer(){
    count++;
    // console.log(count);
    let s = parseInt(count%60);
    let m = parseInt(count/60%60);
    s = s < 10? "0"+s:s;
    m = m <10? "0"+m:m;
    $timeSpan.text(m + ":" + s);
  }
   // 定义一个方法来显示进度条(总能量是30个点,一秒消耗掉一个点,一点能量玩家可以飞行一秒)
   function progressBar(){
     let $bar = $("#bar");
     let $lable = $("#lable");
     let $span = $("#lable span");
     value = 100;
     speed = 3.4;
     i = 30;
     $bar.progressbar({
      value: value
     });
     $("#bar").show(1000);
     function jindu(){ 
      i--;
      $span.text(i);
      if(value > 100){
        value = 100;
      }
      value -= speed;
      if(value <= 0){
         // 进度条都结束了,游戏自然也就结束了
         clearInterval(barTimer);
         barTimer = null;
         $span.text("");
         end();
      }
      $bar.progressbar({
        value: value
      });
     }
     barTimer = setInterval(jindu,1000);
   }

   // 定义一个方法创建一批行星
   function Planet(){
     // 一秒创建一个行星
      planentTimer = setInterval(creatrePlanet,5000);
   }
   // 定义一个方法创建每一个行星添加到盒子里面去
   function creatrePlanet(){
    // $planent 
    let rand = Math.ceil(Math.random()* (planetArr.length-1));
    let positionY = Math.ceil(Math.random()*$mainHeight);
    $newPlanet = $(`<img src=${planetArr[rand]} class='planent' />`);
    $planent.append($newPlanet);
    let $newPlanetX = $mainWidth;
    $newPlanet.css({
      "top": `${positionY}px`,
      "left": `${$newPlanetX}px`
    });
    $newPlanet.timer = setInterval(planetMove($newPlanet),6000);
   }

   // 定义一个方法控制行星的运动
   function planetMove($newPlanet){
      if($newPlanet.attr("src").indexOf("001") !== -1){
        res(16000);
      }else if($newPlanet.attr("src").indexOf("002")!== -1 || 
               $newPlanet.attr("src").indexOf("006")!== -1 || 
               $newPlanet.attr("src").indexOf("008")!== -1 || 
               $newPlanet.attr("src").indexOf("009")!== -1 || 
               $newPlanet.attr("src").indexOf("010")!== -1 || 
               $newPlanet.attr("src").indexOf("012")!== -1){
        res(12000);
      }else{
        res(8000);        
      }
      $planentLeft = -500;
      // 这里接受的就是每一个行星个体
      function res(time){
        $newPlanet.animate({
          left: $planentLeft+ "px",
        },time,function(){
          $(this).hide();
          $(this).remove();
        });
      }  
   }

   // 定义一个方法来创建一批能量桶
   function createBenergy(){
      benergyTimer = setInterval(benergy,3000);
   }

   // 定义一个方法创建一个能量桶
   function benergy(){
     energy = $("<img src='./images/fuel.jpg' class='energy' />");
     let weizhi = Math.ceil(Math.random()*$mainWidth);
     $("#energy").append(energy);

     let energyHeight = -energy.height();
     energy.css({
       "top": energyHeight+"px",
       "left": weizhi+"px"
     });
     benergyMove(energy);
   }
   // 定义一个方法控制能量桶的运动
   function benergyMove(energy){
    energy[0].onload = function(){
      energyTop = parseInt(energy[0].style.top);
      //  energy.timer = setInterval();
       energy.timer = setInterval(function(){
        energyTop += 30;
        if(energyTop > $mainHeight){
          energy.hide();
          energy.remove();
        }
        // 判断玩家飞机是否接受到了能量
        let falg = 
        energy[0].offsetTop >= $top && 
        energy[0].offsetTop <= $top + $plane.height()&&
        energy[0].offsetLeft >= $left&&
        energy[0].offsetLeft <= $left+$plane.width();
        if(falg){
          clearInterval(energy.timer);
          energy.timer = null;
          $("#star")[0].play();
          energy.hide();
          energy.remove();
          i += 10;
          value += speed*10;
          if(i > 30 && value > 100){
            i = 30;
            value = 100;   
          }
        }
        energy.css({"top": energyTop+"px"});
       },200);
    } 
    
   }
   
      // 定义一个对象存储敌方飞机的血量和被打中的分数
   obj = {
    small: {
      blood: 100,
      mark: 100
    },
    secondary: {
      blood: 500,
      mark: 500
    },
    big: {
      blood: 1000,
      mark: 1000
    }
   }
   // 定义一个创建一批敌方飞机的方法
   function enemys(){
    enemyTimer = setInterval(createEnemy,3000);
   }
   // 定义一个方法创建一个敌方飞机的方法
   function createEnemy(){
    // 小飞机:10/17  中飞机:5/17 打飞机:2/17
    let probability = [1,1,1,1,1,1,1,1,1,1,2,2,2,2,2,3,3];
    let index = Math.floor(Math.random()*probability.length);
    if(index <= 9){
      sort("./images/enemyC.png",100);
      $enemy.blood = obj.small.blood;
      $enemy.mark = obj.small.mark;
    }else if(index > 9 && index < 15){
      sort("./images/enemyB.png",600);
      $enemy.blood = obj.secondary.blood;
      $enemy.mark = obj.secondary.mark;
    }else{
      sort("./images/enemyA1.png",1000);
      $enemy.blood = obj.big.blood;
      $enemy.mark = obj.big.mark;
    }
   }

   // 定义一个方法来处理不同的飞机情况
   function sort(src,time){
    $enemy = $(`<img class=enemy src=${src}>`);
    $("#enemy").append($enemy);
    enemy.push($enemy);
    $enemy[0].onload = function(){
      let $enemyPosition = Math.random()*($mainWidth - $enemy.width());
      // console.log($enemyPosition);
      $enemy.css({
        "left": $enemyPosition + "px"
      });
      enemyMove($enemy,time);
    }
    
   }
   // 定义一个敌方飞机运动的方法
   function enemyMove($enemy,time){
    let $enemyTop = $enemy.offset().top - $main.offset().top;
    $enemy.timer = setInterval(function(){
      $enemyTop += 20;
      $enemy.css({
        "top": $enemyTop + "px",
      });
 
      if($enemyTop > $mainHeight){
        enemy.unshift();
        $enemy.remove();
      }
      // 调用敌方飞机与我方飞机发生碰撞的方法
      collision();
    },time);  

   }
   // 定义一个方法创建一个子弹
   function craeteBullet(){ 
    bullet = $("<span class='bullet'></span>");
    bullet.css({
      "top": $top + "px",
      "left": ($left + $plane.width()/2) + "px"
    });
    $("#bullet").append(bullet);
    bulletMove(bullet);
   }

   // 定义一个方法控制子弹的运动
   function bulletMove(bullet){
    bullet.timer = setInterval(function(){
      let $bulletTop = bullet[0].offsetTop - 50;
      if($bulletTop <= 0){
        bullet.remove();
        clearInterval(bullet.timer);
        bullet.timer = null;
      }
      bullet.css({
        "top": $bulletTop  + "px"
      });
      hit(bullet);
    },100);
    
   }
   
   // 定义一个子弹打到敌方飞机的方法
   function hit(bullet){
     for(let i=0;i<enemy.length;i++){    
          let flag = bullet[0].offsetTop > enemy[i][0].offsetTop &&
          bullet[0].offsetTop < enemy[i][0].offsetTop + enemy[i][0].offsetHeight &&
          bullet[0].offsetLeft > enemy[i][0].offsetLeft &&
          bullet[0].offsetLeft < enemy[i][0].offsetLeft + enemy[i][0].offsetWidth;
          if(flag){
            // 打中了敌方飞机的话子弹要消失
            clearInterval(bullet.timer); 
            bullet.timer = null;
            bullet.remove();   
            enemy[i].blood -= 100;
            if(enemy[i].blood <= 0){
                // console.log("1111");
                // 说明敌方飞机已经没有了血量
                die(enemy[i]);
            }
          }      
        }
   }
   // 定义一个飞机被摧毁并加分的方法
   function die(enemy) {
    // console.log(enemy.attr("src"));
    // 判断是什么类型的飞机
    if(enemy.attr("src").indexOf("C") !== -1){
      // console.log("小飞机");
      result += 100;
    }else if(enemy.attr("src").indexOf("B") !== -1){
      // console.log("中飞机");
      result += 500;
    }else{
      // console.log("大飞机");
      result += 1000;
    }  
    enemy.remove();
    $("#hit")[0].play();
    $("#result span").html("分数为:" + result);
   }
   // 定义一个方法来处理敌方飞机被击中之后的变化
  //  function enemyChange(enemy){
  //   if(enemy.attr("src").indexOf("C") !== -1){
  //     enemy.attr("src","./images/enemyC_destroy_1.png");
  //     enemy.remove();
  //   }else if(enemy.attr("src").indexOf("B") !== -1){
  //     enemy.attr("src","./images/enemyB_destroy_1.png");
  //     enemy.remove();
  //   }else{
  //     enemy.attr("src","./images/enemyA_destroy_1.png");
  //     enemy.remove();
  //   }
  
  //  }


   // 定义一个改变字体大小的方法
   function fontChanges(){
     $("#size").show(500);
     $("#reduce").click(function(){
      --$size;
      collective($size);
     });
     $("#enlarge").click(function(){
       ++$size;
       collective($size);
     });
   }
   // 封装一个改变字体的共同的方法
   function collective($size){
    $("#timer span").css("fontSize",$size+"px");
    $("#bar").css("fontSize",$size+"px");
   }

   // 定义一个操作游戏背景音乐播放静音的方法
   function silence(){
     $("#music").show(500);
     $("#musicBtn span").click(function(){
       // 获取按钮上面的值
       let $btnText = $(this).html();
       console.log($btnText);
       if($btnText === "start"){
         // 背景音乐静音
         $("#musicBtn span").html("stop");
         $("#musicbg").prop('muted', false);
         $("#star").prop('muted', false);
         $("#hit").prop('muted', false);
       }else if($btnText === "stop"){
         // 背景音乐不静音
         $("#musicBtn span").html("start");
         $("#musicbg").prop('muted', true);
         $("#star").prop('muted', true);
         $("#hit").prop('muted',true);
      
       }
     });
   }


   // 定义一个敌方飞机和我方飞机发生碰撞的方法
   function collision(){
     for(let i=0;i<enemy.length;i++){
        let flag = $top > enemy[i][0].offsetTop &&
                   $top < enemy[i][0].offsetTop + enemy[i].height() &&
                   $left + $plane.width()/2 > enemy[i][0].offsetLeft &&
                   $left + $plane.width()/2 < enemy[i][0].offsetLeft + enemy[i].width();
         if(flag){
           // 1.1 键盘不能操控我方飞机运动
           $(window).off("keydown");       
          //  1.2 我方飞机爆炸
           $plane.attr({
             "src": "./images/me_destroy_1.png"
           });
           enemy[i].remove();
           enemy.splice(i,1);
           clearInterval($enemy.timer);
           $enemy.timer = null;
           blast($plane,2,1000);
           blast($plane,3,2000);
           blast($plane,4,3000);
           
           // 1.4 结束游戏,出现成绩表单
           end(); 
         }           
     }
   }

   // 封装一个延迟爆炸的动画方法
   function blast(ele,num,time){
     setTimeout(function(){
       ele.attr({
         "src": `./images/me_destroy_${num}.png`
       });
       if(time === 3000){
          
          $plane.remove();
          try {
              $("#destroyed")[0].play();
          }catch (e) {

          }finally {

          }
       }
     },time);
   }
    
   // 定义一个游戏结束的方法
   function end(){
      value = 0;
      clearInterval(timer);
      timer = null;
      clearInterval(beijingTimer);
      beijingTimer = null;
      clearInterval(benergyTimer);
      benergyTimer = null;
      clearInterval(planentTimer);
      planentTimer = null;
      clearInterval(energy.timer);
      energy.timer = null;
      clearInterval(enemyTimer);
      enemyTimer = null;
      clearInterval($enemy.timer);
      $enemy.timer = null;  
      // $("audio").pause();
      // 出现游戏结算页面;
       showSettlement();
   }
   // 出现游戏结算界面的方法

   function showSettlement(){
        $main.html(`
          <div class="settlementBox">
             <span>游戏结束</span> 
             <span>分数为:${result}</span>  
             <button class="resetBtn">重新开始</button>
           </div>
        `);
       let $resetBtn = $(".resetBtn");
       $resetBtn.click(function () {
           console.log("1");
           window.location.reload()
       });
   }
});

 