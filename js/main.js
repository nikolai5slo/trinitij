var igralec = null;
var trinitij = null;
var nasprotniki = [];
var centerX = null;
var centerY = null;
var mouseX = 0;
var mouseY = 0;
var camera = null;
mvtDirection = [0,0,0,0];
var KEYBOARD = {
  W : 87,
  S : 83,
  A : 65,
  D : 68,
  SPACE : 32,
  // ARROWS:
  UP    : 38,
  DOWN  : 40,
  LEFT  : 37,
  RIGHT : 39
};
var mouseOnScreen = false;

function randomNumber(min,max){
	return (Math.random()*(max-min))+min;
}

window.onload = function(){
	//Shranimo referenco na kanvas
	var canvas = document.querySelector("#canvas");

	//naložimo kanvas v babylonov izris
	var engine = new BABYLON.Engine(canvas, true);

	function createScene(){
		/****************************
			OSNOVNA KONFIGURACIJA
		****************************/
		
		var loader = null;
		var scene = new BABYLON.Scene(engine);
		scene.enablePhysics(new BABYLON.Vector3(0,0,3), new BABYLON.OimoJSPlugin());
	
		scene.actionManager = new BABYLON.ActionManager(scene);
	
		//var camera = new BABYLON.FreeCamera("camera1", new BABYLON.Vector3(0, 5, -10), scene);
		//camera.attachControl(canvas, true);
		
		camera = new BABYLON.FollowCamera("FollowCam", new BABYLON.Vector3(0, 15, -50), scene);
		
		/**********************
		????KREACIJA MEGLIC????
		**********************/
		
		// Create paticle system
		//createParticleMist(scene);
		
		/*********************
			KREACIJA LIKOV
		**********************/
		
		igralec = new Igralec();							//ustvarimo novega igralca
		igralec.create(igralec.instanca, scene, camera);	//kreiramo njegov objekt in ga dodamo v sceno
		
		trinitij = new Trinitij();					//ustvarimo ladjo trinitij
		trinitij.create(trinitij.instanca, scene);	//kreiramo njen objekt in jo dodamo v sceno
		
		for(i = 0; i < ST_NASPROTNIKOV; i++){		//za N nasprotnikov
			var tmp = new Nasprotnik();				//ustvarimo novega nasprotnika
			tmp.create(tmp.instanca, i+1, scene);	//kreiramo njegov objekt in ga dodamo v sceno
			nasprotniki.push(tmp);					//shranimo ga v tabelo nasprotnikov
		}
		
		/**************************
			KREACIJA ASTEROIDOV
		**************************/
		var astNest=AsteoridNest(scene);

		/***********************
			KREACIJA SKYBOXA
		***********************/
		// Skybox
		var skybox = BABYLON.Mesh.CreateBox("skyBox", 9000.0, scene);

		var skyboxMaterial = new BABYLON.StandardMaterial("skyBox", scene);
		skyboxMaterial.backFaceCulling = false;
		skyboxMaterial.reflectionTexture = new BABYLON.CubeTexture("textures/sky1/sky1", scene);
		skyboxMaterial.reflectionTexture.coordinatesMode = BABYLON.Texture.SKYBOX_MODE;
		skyboxMaterial.diffuseColor = new BABYLON.Color3(0, 0, 0);
		skyboxMaterial.specularColor = new BABYLON.Color3(0, 0, 0);
		skyboxMaterial.disableLighting = true;
		skybox.infiniteDistance = true;
		skybox.renderingGroupId = 0;

		skybox.material = skyboxMaterial;
		
		/*********************
			KREACIJA SONCA
		*********************/
		
		var sun=new Sun(camera, scene);
		sun.position = new BABYLON.Vector3(-2000, 50, 2000);
		sun.scaling = new BABYLON.Vector3(200, 200, 200);
		
		/**********************
			KREACIJA ZEMLJE
		**********************/
		
		var earth=new Earth(5500.0, scene);
		earth.position=new BABYLON.Vector3(0,-5000,0)

		// Create dynamic stars
		return scene;
	};

	// Now, call the createScene function that you just finished creating
	var scene = createScene();

	// Register a render loop to repeatedly render the scene
	engine.runRenderLoop(function () {
		var TIME_SPENT = Math.floor((((new Date().getTime()) - TIME) / 1000));
		if(TIME_TILL_END > TIME_SPENT) {
			scene.render();
			//izrisati je treba še števec časa
		} else {
      console.log("GAME OVER");
    }

		if(centerX == null & centerY == null){
			centerX = window.innerWidth/2;
			centerY = window.innerHeight/2;
			mouseX = window.innerWidth/2;
			mouseY = window.innerHeight/2;
		}
		if(centerX != null && centerY != null){
			if(igralec != null && igralec.instanca != null){
        if (mouseOnScreen) {
  				if(mouseX < centerX){
  					igralec.instanca.rotate(new BABYLON.Vector3(0, 1, 0), 0.03 *
  						Math.round(Math.abs((centerX - mouseX)/200), BABYLON.Space.LOCAL));
  				}
  				else if(mouseX > centerX){
  					igralec.instanca.rotate(new BABYLON.Vector3(0,-1,0), 0.03 *
  						Math.round(Math.abs((centerX - mouseX)/200), BABYLON.Space.LOCAL));
  				}
  				if(mouseY < centerY - 50){
  					igralec.instanca.rotate(new BABYLON.Vector3(-1,0,0), 0.03 *
  						Math.round(Math.abs((centerY - mouseY)/200), BABYLON.Space.LOCAL));
  				}
  				else if(mouseY > centerY + 50){
  					igralec.instanca.rotate(new BABYLON.Vector3(1,0,0), 0.03 *
  						Math.round(Math.abs((centerY - mouseY)/200), BABYLON.Space.LOCAL));
  				}
  				camera.rotation = igralec.instanca.rotation;
        }
			}
		}

    if (mvtDirection[0] != 0) {
        igralec.instanca.translate(new BABYLON.Vector3(0, 0, -2.5), 1, BABYLON.Space.LOCAL);
    } else if (mvtDirection[1] != 0) {
        igralec.instanca.translate(new BABYLON.Vector3(0, 0, -2.5), -1, BABYLON.Space.LOCAL);
    } else if (TIME_SPENT > 1){
        igralec.instanca.translate(new BABYLON.Vector3(0, 0, -2.5), 0.1, BABYLON.Space.LOCAL);
    }
		//TODO else izpiši da je zmagal
		
		/*if((Math.floor(TIME_SPENT) % 60) == 0) {
			console.log(TIME_SPENT);
		}*/
	});

	// Watch for browser/canvas resize events
	window.addEventListener("resize", function () {
		engine.resize();
		centerX = window.innerWidth/2;
		centerY = window.innerHeight/2;
	});
	
	function popraviInstance(ime){
		for(mesh in engine.scenes[0].meshes){
			if(engine.scenes[0].meshes[mesh].name == ime){
				return engine.scenes[0].meshes[mesh];
			}
		}
		return null;
	}

	window.addEventListener("mousemove", function(event){
		mouseX = event.clientX;
		mouseY = event.clientY;
		
		if(igralec != null && igralec.instanca == null){
			igralec.instanca = popraviInstance("igralec");
			//console.log(igralec.instanca);
		}
	});

  /* KEYBOARD */
  window.addEventListener("keydown", function(evt) {
    switch (evt.keyCode) {
        case KEYBOARD.W :
            mvtDirection[0] = 1;
            break;
        case KEYBOARD.S :
            mvtDirection[1] = 1;
            break;
    }

    if(igralec != null && igralec.instanca == null){
      igralec.instanca = popraviInstance("igralec");
      //console.log(igralec.instanca);
    }
  });

  window.addEventListener("keyup", function(evt) {
    switch (evt.keyCode) {
          case KEYBOARD.W :
              mvtDirection[0] = 0;  // FORWARD
              break;
          case KEYBOARD.S :
              mvtDirection[1] = 0;  // BACKWARD
              break;
    }

    if(igralec != null && igralec.instanca == null){
      igralec.instanca = popraviInstance("igralec");
      //console.log(igralec.instanca);
    }
  }); 

  canvas.addEventListener("mouseover", function(){
      mouseOnScreen = true;
  });   
  canvas.addEventListener("mouseout", function(){
      mouseOnScreen = false;
  });  
}

console.log("loaded main.js");

//OPOMBA: Dodaj sonce v svoj file.js
function Sun(camera, scene){
	// Sun

	// Create the "God Rays" effect (volumetric light scattering)
	var godrays = new BABYLON.VolumetricLightScatteringPostProcess('godrays', 1.0, camera, null, 80, BABYLON.Texture.BILINEAR_SAMPLINGMODE, scene.getEngine(), false);

	// By default it uses a billboard to render the sun, just apply the desired texture
	// position and scale
	godrays.mesh.material.diffuseTexture = new BABYLON.Texture('textures/sun.png', scene, true, false, BABYLON.Texture.BILINEAR_SAMPLINGMODE);
	godrays.mesh.material.diffuseTexture.hasAlpha = true;

	/*
	// Godrays parameters
	godrays.exposure = 0.4;
	godrays.decay = 0.96815;
	godrays.weight = 0.358767;
	godrays.density = 0.9526;
	*/ 

	var light = new BABYLON.PointLight("Omni", new BABYLON.Vector3(10, 50, 50), scene);
	//light.position = godrays.mesh.position;
	light.parent=godrays.mesh;

	var ambiLight = new BABYLON.HemisphericLight("ambilight", new BABYLON.Vector3(0, 1, 0), scene);
	ambiLight.diffuse = new BABYLON.Color3(0.1, 0.1, 0.1);
	ambiLight.specular = new BABYLON.Color3(0, 0, 0);
	ambiLight.groundColor = new BABYLON.Color3(0, 0, 0);
	ambiLight.position = new BABYLON.Vector3(0,0,0); 

	ambiLight.parent=godrays.mesh;

	return godrays.mesh;
}
