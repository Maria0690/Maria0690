function initCanvas(){
    var ctx = document.getElementById('my_canvas').getContext('2d');
    var backgroundImage = new Image();
    var naveImage   = new Image(); 
    var enemiespic1  = new Image(); 
    var enemiespic2 = new Image(); 

    
    backgroundImage.src = "images/fondo1estrellas.jpg"; 
    naveImage.src       = "images/naveespacial.png"; 
  
    enemiespic1.src     = "images/enemigo1.png";
    enemiespic2.src     = "images/enemigo2.png"; 
    
 
    var cW = ctx.canvas.width; 
    var cH = ctx.canvas.height;

    
    var enemyTemplate = function(options){
        return {
            id: options.id || '',
            x: options.x || '',
            y: options.y || '',
            w: options.w || '',
            h: options.h || '',
            image: options.image || enemiespic1
        }
    }

   
    var enemies = [
        new enemyTemplate({id: "enemigo1", x: 100, y: -20, w: 50, h: 30 }),
        new enemyTemplate({id: "enemigo2", x: 225, y: -20, w: 50, h: 30 }),
        new enemyTemplate({id: "enemigo3", x: 350, y: -20, w: 80, h: 30 }),
        new enemyTemplate({id: "enemigo4", x:100,  y:-70,  w:80,  h: 30}),
        new enemyTemplate({id: "enemigo5", x:225,  y:-70,  w:50,  h: 30}),
        
     new enemyTemplate({ id: "enemigo11", x: 100, y: -220, w: 50, h: 30, image: enemiespic2 }),
                   new enemyTemplate({ id: "enemigo12", x: 225, y: -220, w: 50, h: 30, image: enemiespic2 }),
                   new enemyTemplate({ id: "enemigo13", x: 350, y: -220, w: 80, h: 50, image: enemiespic2 }),
                   new enemyTemplate({ id: "enemigo14", x: 100, y: -270, w: 80, h: 50, image: enemiespic2 }),
                  
                  ];

    
    var renderEnemies = function (enemyList) {
        for (var i = 0; i < enemyList.length; i++) {
            console.log(enemyList[i]);
            ctx.drawImage(enemyList[i].image, enemyList[i].x, enemyList[i].y += .5, enemyList[i].w, enemyList[i].h);
          
            launcher.hitDetectLowerLevel(enemyList[i]);
        }
    }

    function Launcher(){
        //ubicacion balas
        this.y = 500, 
        this.x = cW*.5-25, 
        this.w = 100, 
        this.h = 100,   
        this.direccion, 
        this.bg="white", // color de la bala
        this.misiles = [];

         
         this.gameStatus = {
            over: false, 
            message: "",
            fillStyle: 'blue',  //color texto alerta 
            font: 'italic bold 36px Arial, sans-serif',
        }

        this.render = function () {
            if(this.direccion === 'left'){
                this.x-=5;
            } else if(this.direccion === 'right'){
                this.x+=5;
            }else if(this.direccion === "downArrow"){
                this.y+=5;
            }else if(this.direccion === "upArrow"){
                this.y-=5;
            }
            ctx.fillStyle = this.bg;
            ctx.drawImage(backgroundImage, 10, 10); // imagen de fondo
            ctx.drawImage(naveImage,this.x,this.y, 100, 90); //  asegurarnos de que la nave espacial esté en la misma ubicación que las balas

            for(var i=0; i < this.misiles.length; i++){
                var m = this.misiles[i];
                ctx.fillRect(m.x, m.y-=5, m.w, m.h); //  dirección de la bala
                this.hitDetect(this.misiles[i],i);
                if(m.y <= 0){ // Si un misil pasa más allá de los límites del canva, retírelo
                    this.misiles.splice(i,1); // empalmar ese misil fuera de la matriz de misiles
                }
            }
            // CODIGO DE SI GANAS 
            if (enemies.length === 0) {
                clearInterval(animateInterval); //DETIENE EL BUCLE DE LA ANIMACION 
                ctx.fillStyle = 'yellow';
                ctx.font = this.gameStatus.font;
                ctx.fillText('HAZ GANADO!', cW * .5 - 80, 50);
            }
        }
        // DETECTA CHOQUE DE LA BALA 
        this.hitDetect = function (m, mi) {
            console.log('crush');
            for (var i = 0; i < enemies.length; i++) {
                var e = enemies[i];
                if(m.x+m.w >= e.x && 
                   m.x <= e.x+e.w && 
                   m.y >= e.y && 
                   m.y <= e.y+e.h){
                    this.misiles.splice(this.misiles[mi],1); //RETIRA EL MISIL
                    enemies.splice(i, 1); // ELIMINA AL ENEMIGO SI LO GOLPEA
                    document.querySelector('.barra').innerHTML = "Eliminado el "+ e.id+ " ";
                }
            }
        }
        // Pregúntale a la nave del jugador si un enemigo ha pasado o ha golpeado la nave del jugador   
        this.hitDetectLowerLevel = function(enemy){
            // Si la ubicación del barco es mayor que 550, entonces sabemos que pasó un nivel inferior
            if(enemy.y > 550){
                this.gameStatus.over = true;
                this.gameStatus.message = 'EL ENEMIGO HA PASADO!';
                
            }
            // Esto detecta un choque de la nave con enemigos
            //console.log(this);
            // this.y -> UBICACION DE LA NAVE 
            if(enemy.id === 'enemigo3'){
                //console.log(this.y);
                console.log(this.x);
            }
            // a) Si el enemigo Y es mayor que este.y - 25 = > entonces sabemos que hay una colisión
            // b) Si el enemigo X es mayor que este.x + 45 & el enemigo x > que.x - 45 entonces sabemos que hay una colisión
            if ((enemy.y < this.y + 25 && enemy.y > this.y - 25) &&
                (enemy.x < this.x + 45 && enemy.x > this.x - 45)) { // Comprobar si el enemigo está a la izquierda o a la derecha de la nave espacial
                    this.gameStatus.over = true;
                    this.gameStatus.message = 'HAZ MUERTO!'
                }

            if(this.gameStatus.over === true){  
                clearInterval(animateInterval); // Detener el bucle de animación del juego
                ctx.fillStyle = this.gameStatus.fillStyle; // Establecer el color en el texto
                ctx.font = this.gameStatus.font;
                // Para mostrar texto en Canvas
                ctx.fillText(this.gameStatus.message, cW * .5 - 80, 50); // texto x, Y
            }
        }
    }
    
    var launcher = new Launcher();
    function animate(){
        ctx.clearRect(0, 0, cW, cH);
        launcher.render();
        renderEnemies(enemies);
    }
    var animateInterval = setInterval(animate, 6);
    
    var left_btn  = document.getElementById('left_btn');
    var right_btn = document.getElementById('right_btn');
    var fire_btn  = document.getElementById('fire_btn'); 

   document.addEventListener('keydown', function(event) {
        if(event.keyCode == 37) // escucha evento, boton de teclado escuchado
        {
         launcher.direccion = 'left';  
            if(launcher.x < cW*.2-130){
                launcher.x+=0;  //para que el usuario no navegue fuera de la coordenada
                launcher.direccion = '';
            }
       }    
    });

    document.addEventListener('keyup', function(event) {
        if(event.keyCode == 37)
        {                 //cuando ya no se presione la tecla 
         launcher.x+=0;
         launcher.direccion = '';
        }
    }); 

    document.addEventListener('keydown', function(event) {
        if(event.keyCode == 39) 
        {                           //cuando SI se presione la tecla 
         launcher.direccion = 'right';
         if(launcher.x > cW-110){
            launcher.x-=0;
            launcher.direccion = '';
         }
        
        }
    });

    document.addEventListener('keyup', function(event) {
        if(event.keyCode == 39) 
        {                  //cuando ya no se presione la tecla 
         launcher.x-=0;   
         launcher.direccion = '';
        }
    }); 

    document.addEventListener('keydown', function(event){
         if(event.keyCode == 38) 
         {                                 //cuando SI se presione la tecla 
           launcher.direccion = 'upArrow';  
           if(launcher.y < cH*.2-80){
              launcher.y += 0;
              launcher.direccion = '';
            }
         }
    });

    document.addEventListener('keyup', function(event){
         if(event.keyCode == 38) //cuando ya no se presione la tecla 
         {
           launcher.y -= 0;
           launcher.direccion = '';
         }
    });

    document.addEventListener('keydown', function(event){
         if(event.keyCode == 40)
         {
           launcher.direccion = 'downArrow';  
          if(launcher.y > cH - 110){
            launcher.y -= 0;
            launcher.direccion = '';
           }
         }
    });
    document.addEventListener('keyup', function(event){
         if(event.keyCode == 40) // 
         {
           launcher.y += 0;
           launcher.direccion = '';
         }
    });

    document.addEventListener('keydown', function(event){
         if(event.keyCode == 13) // PRESIONAR LA tecla enter Y SE RECARGA EL NAVEGADOR
         {
          location.reload();
         }
    });

    // CONTROL DE BOTONES
    left_btn.addEventListener('mousedown', function(event) {
        launcher.direccion = 'left';           //CUANDO ESTE PRESIONANDO EL BOTON
    });

    left_btn.addEventListener('mouseup', function(event) {
        launcher.direccion = '';      //CUANDO NOO ESTE PRESIONANDO EL BOTON
    });

    right_btn.addEventListener('mousedown', function(event) {
        launcher.direccion = 'right';        
        launcher.direccion = 'left';           //CUANDO ESTE PRESIONANDO EL BOTON
    });                          

    right_btn.addEventListener('mouseup', function(event) {
        launcher.direccion = '';        //CUANDO NOO ESTE PRESIONANDO EL BOTON
    });
    //DIPARA LAS BALAS
    fire_btn.addEventListener('mousedown', function(event) {
        launcher.misiles.push({x: launcher.x + launcher.w*.5, y: launcher.y, w: 3, h: 10});
    });
    // dispara al hacer clic en el botón de espacio del teclado
    document.addEventListener('keydown', function(event) {
        if(event.keyCode == 32) {
           launcher.misiles.push({x: launcher.x + launcher.w*.5, y: launcher.y, w: 3,h: 10});
        }
    });
}

window.addEventListener('load', function(event) {
    initCanvas();
});